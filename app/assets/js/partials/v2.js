import InputmaskPhone from 'inputmask/dist/inputmask/inputmask.phone.extensions';
import InputmaskRegex from 'inputmask/dist/inputmask/inputmask.regex.extensions';
import moment from 'moment/moment';
require('moment/locale/ru');
require('moment-timezone/builds/moment-timezone-with-data');

export default class TcEmailNotifier {
    printObject(object) {
        Object.entries(object).forEach(([k, v]) => {
            if(v instanceof Object) {
                this.printObject(v);
            } else {
                console.log(k + ' - ' + v);
            }
        });
    }

    constructor(options, fields) {
        this.options = options;
        this.fields = fields;
        this.d = this.options.isDebugMode ? this.options.isDebugMode : false;

        if(this.d) {
            console.log('[x] options are: ');
            this.printObject(this.options);
        }

        if(this.d) {
            console.log('[x] fields are: ');
            this.fields.forEach((field) => {
                this.printObject(field);
            });
        }

        this.createFields();
    }

    addFieldEventListener(field, fieldElement) {
        if(field.onClick) fieldElement.onclick = field.onClick;
        if(field.onFocus) fieldElement.onfocus = field.onFocus;
    }

    formatField(field, fieldElement) {
        let im;
        switch (field.type) {
            case 'email':
                im = new InputmaskRegex({
                    mask: "*{1,20}[.*{1,20}][.*{1,20}][.*{1,20}]@*{1,20}[.*{2,6}][.*{1,2}]",
                    greedy: false,
                    onBeforePaste: (pastedValue, opts) => {
                        pastedValue = pastedValue.toLowerCase();
                        return pastedValue.replace("mailto:", "");
                    },
                    definitions: {
                        '*': {
                            validator: "[0-9A-Za-z!#$%&'*+/=?^_`{|}~\-]",
                            casing: "lower"
                        }
                    }
                });
                im.mask(fieldElement);
                break;
            case 'tel':
                im = new InputmaskPhone("+7 (999) 999-99-99");
                im.mask(fieldElement);
                break;
        }
    }

    createHiddenField() {
        let fieldElement = document.createElement('input');
        fieldElement.setAttribute('type', 'hidden');
        return fieldElement;
    }

    addHiddenFields(formElement) {
        let hiddenFields = [
            {
                name: 'useragent',
                value: navigator.userAgent
            },
            {
                name: 'referrer',
                value: document.referrer
            },
            {
                name: 'timezone',
                value: moment.tz.guess()
            },
            {
                name: 'localtime',
                value: moment().toISOString()
            },
            {
                name: 'cookies',
                value: document.cookie
            }
        ];

        hiddenFields.forEach((field) => {
            let fieldElement = this.createHiddenField();
            fieldElement.setAttribute('id', field.name);
            fieldElement.setAttribute('name', field.name);
            fieldElement.setAttribute('value', field.value);
            formElement.appendChild(fieldElement);
        });
    }

    addGeolocation(formElement) {
        if(navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                this.addGeolocationCallBack(position, formElement);
            });
        }
    }

    addGeolocationCallBack(position, formElement) {
        debugger;
        let geoFields = [
            {
                name: 'geocoords',
                value: position.coords
            },
            {
                name: 'geomap',
                value: `https://maps.googleapis.com/maps/api/staticmap?center=${position.coords.latitude + "," + position.coords.longitude}&zoom=14&size=400x300&sensor=false&key=${this.options.googleMapsApiKey}`
            }
        ];

        geoFields.forEach((field) => {
            let fieldElement = this.createHiddenField();
            fieldElement.setAttribute('id', field.name);
            fieldElement.setAttribute('name', field.name);
            fieldElement.setAttribute('value', field.value);
            formElement.appendChild(fieldElement);
        });
    }

    htmlToElement(html) {
        let template = document.createElement('template');
        html = html.trim();
        template.innerHTML = html;
        return template.content.firstChild;
    }

    createFields() {
        if(this.d) {
            console.log('createFields');
        }

        let formElement = document.querySelector(`#${this.options.formId}`);

        this.fields.forEach((field) => {
            if(this.d) console.log('[x] adding field ');
            this.printObject(field);

            formElement.appendChild(this.htmlToElement(field.titleTag));

            let fieldElement = document.createElement('input');
            fieldElement.setAttribute('id', field.id);
            fieldElement.setAttribute('type', field.type);
            fieldElement.setAttribute('name', field.name);

            if(field.placeholder) fieldElement.setAttribute('placeholder', field.placeholder);
            if(field.cssClass) fieldElement.setAttribute('class', field.cssClass);
            if(field.required) fieldElement.required = true;

            formElement.appendChild(fieldElement);
            formElement.appendChild(this.htmlToElement(field.errorTag));

            this.formatField(field, fieldElement);
            this.addFieldEventListener(field, fieldElement);
        });

        if(this.options.addHiddenFields) this.addHiddenFields(formElement);
        if(this.options.addGeolocation) this.addGeolocation(formElement);
    }


}

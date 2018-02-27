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
        this.addFormBackendUrl();
        this.addSubmitEventListener();
    }

    addFormBackendUrl() {
        let formElement = document.querySelector(`#${this.options.formId}`);
        formElement.setAttribute('action', '#');
        formElement.setAttribute('method', 'post');
    }

    addSubmitEventListener() {
        let formElement = document.querySelector(`#${this.options.formId}`);

        let request = obj => {
            return new Promise((resolve, reject) => {
                debugger;
                let xhr = new XMLHttpRequest();
                xhr.open("POST", this.options.backendUrl);
                if (obj.headers) {
                    Object.keys(obj.headers).forEach(key => {
                        xhr.setRequestHeader(key, obj.headers[key]);
                    });
                }
                xhr.onload = () => {
                    if (xhr.status >= 200 && xhr.status < 300) {
                        resolve(xhr.response);
                    } else {
                        reject(xhr.statusText);
                    }
                };
                xhr.onerror = () => reject(xhr.statusText);
                xhr.send(obj.body);
            });
        };

        formElement.addEventListener('submit', (e) => {
            e.preventDefault();
            request({body: new FormData(e.target)})
                .then(answer => {
                    this.options.onSuccess(answer);
                })
                .catch(error => {
                    this.options.onError(error);
                });
        });
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
        let geoFields = [
            {
                name: 'geocoords',
                value: `lat:${position.coords.latitude};long:${position.coords.longitude}`
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

        console.log(geoFields[0])
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

            if(field.titleTag) formElement.appendChild(this.htmlToElement(field.titleTag));

            let fieldElement = document.createElement('input');
            fieldElement.setAttribute('id', field.id);
            fieldElement.setAttribute('type', field.type);
            fieldElement.setAttribute('name', field.name);

            if(field.placeholder) fieldElement.setAttribute('placeholder', field.placeholder);
            if(field.cssClass) fieldElement.setAttribute('class', field.cssClass);
            if(field.required) fieldElement.required = true;

            formElement.appendChild(fieldElement);

            if(field.errorTag) formElement.appendChild(this.htmlToElement(field.errorTag));

            this.formatField(field, fieldElement);
            this.addFieldEventListener(field, fieldElement);
        });

        if(this.options.addHiddenFields) this.addHiddenFields(formElement);
        if(this.options.addGeolocation) this.addGeolocation(formElement);
    }


}

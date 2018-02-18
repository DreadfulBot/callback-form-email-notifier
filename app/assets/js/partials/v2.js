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

    constructor(formId, backendUrl, isDebugMode, fields) {
        this.options = {};

        this.options.formId = formId;
        this.options.backendUrl = backendUrl;
        this.options.isDebugMode = isDebugMode;
        this.d = this.options.isDebugMode;
        this.options.fields = fields;

        if(this.d) {
            console.log('[x] parameters are: ');
            this.printObject(this.options);
        }

        this.createFields();
    }

    addFieldEventListener(field, fieldElem) {
        if(field.onClick !== '') {
            fieldElem.addEventListener('click', field.onClick);
        }

        if(field.onFocus !== '') {
            fieldElem.addEventListener('focus', field.onFocus);
        }
    }

    formatField(field, fieldElem) {
        switch (field.type) {
            case 'email':
                break;
            case 'tel':
                break;
        }
    }

    createFields() {
        if(this.d) {
            console.log('createFields');
        }

        this.options.fields.forEach(function (field) {
            let fieldTag = field.titleTag;
            fieldTag += `<input id="${field.id}" type="${field.type}" name="${field.name}"`;
            fieldTag += field.placeholder === '' ? '' : ` placeholder="${field.placeholder}"`;
            fieldTag += field.cssClass === '' ? '' : ` class="${field.cssClass}"`;
            fieldTag += field.required === false ? '' : ' required';
            fieldTag += '>';
            fieldTag += field.errorTag;

            let formElem = document.querySelector('#' + this.options.formId);
            formElem.innerHTML += fieldTag;

            debugger;
            let fieldElem = formElem.querySelector('#' + field.id);
            this.formatField(field, fieldElem);
            this.addFieldEventListener(field, fieldElem);
        }.bind(this));
    }


}

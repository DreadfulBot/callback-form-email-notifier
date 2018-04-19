require('./../css/style.styl');
import alertify from '../../../node_modules/alertifyjs/build/alertify.min'
import TcEmailNotifier from './partials/core';

alertify.defaults.glossary.title = "Уведомление";

let fields = [
    {
        name: 'name',
        id: 'name',
        type: 'text',
        placeholder: 'Введите свое имя',
        required: true,
        cssClass: 'name',
        parentClass: 'controls'
    },{
        name: 'email',
        id: 'email',
        type: 'text',
        placeholder: 'Введите свой email',
        required: true,
        cssClass: 'email',
        parentClass: 'controls',
    },{
        name: 'tel',
        id: 'tel',
        type: 'tel',
        placeholder: 'Введите свой телефон',
        required: true,
        cssClass: 'tel',
    },{
        name: 'mode',
        id: 'mode',
        type: 'hidden',
        value: 'call-2'
    },{
        name: 'submit',
        id: 'submit',
        type: 'submit',
    }
];

let options = {
    formId: 'callback',
    backendUrl: 'tc-email-notifier.php',
    isDebugMode: true,
    addHiddenFields: true,
    addGeolocation: true,
    addRecaptchaButton: true,
    googleMapsApiKey: '6Ld9z0oUAAAAAPfG1-uvvroY78e1LvuiHcB0aG58',
    onSuccess: (message) => {  alertify.alert(message); },
    onError: (message) => {  alertify.alert(message); },
};

new TcEmailNotifier(options, fields);
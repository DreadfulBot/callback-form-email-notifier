require('./../css/style.styl');
import alertify from '../../../node_modules/alertifyjs/build/alertify.min'
import TcEmailNotifier from './partials/v2';


alertify.defaults.glossary.title = "Уведомление";

let fields = [
    {
        titleTag: 'email',
        name: 'email',
        id: 'email',
        type: 'text',
        placeholder: 'Введите свой email',
        errorTag: 'Неправильный email',
        required: true,
        cssClass: 'class',
        onClick: () => { console.log('click'); },
        onFocus: null
    },{
        titleTag: 'tel',
        name: 'tel',
        id: 'tel',
        type: 'tel',
        placeholder: 'Введите свой телефон',
        errorTag: 'Неправильный телефон',
        required: true,
        cssClass: null,
        onClick: () => { console.log('tel clicked'); },
        onFocus: null
    },{
        titleTag: 'Время',
        name: 'time',
        id: 'time',
        type: 'text',
        placeholder: 'Укажите предпочитаемое время',
        errorTag: 'Неверное время',
        required: true
    },{
        titleTag: 'Дата',
        name: 'date',
        id: 'date',
        type: 'text',
        placeholder: 'Укажите предпочитаемую дату',
        errorTag: 'неверная дата',
        required: true
    },{
        titleTag: 'Время',
        name: 'time',
        id: 'time',
        type: 'text',
        placeholder: 'Укажите предпочитаемое время',
        errorTag: 'Неверное время',
        required: true
    },{
        titleTag: 'отправить',
        name: 'submit',
        id: 'submit',
        type: 'submit',
        placeholder: null,
        errorTag: null,
        required: null,
        cssClass: null,
        onClick: null,
        onFocus: null
    }
];

let options = {
    formId: 'callback',
    backendUrl: 'tc-email-notifier.php',
    isDebugMode: true,
    addHiddenFields: true,
    addGeolocation: true,
    googleMapsApiKey: 'AIzaSyCq7dRy7lNE3jJq68lD-DuSuyxOwfaDPqE',
    onSuccess: (message) => {  alertify.alert(message); },
    onError: (message) => {  alertify.alert(message); },
};

new TcEmailNotifier(options, fields);
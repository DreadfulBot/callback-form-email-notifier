import TcEmailNotifier from './partials/v2';
// import core from './partials/core'
// document.querySelector('#callback').innerHTML += '<p>test</p>';
// core();

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
    },
    {
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
    }
];

let options = {
    formId: 'callback',
    backendUrl: '/index.php',
    isDebugMode: true,
    onSuccess: () => { console.log('success'); },
    onError: () => { console.log('error'); },
    addHiddenFields: true,
    addGeolocation: true,
    googleMapsApiKey: 'AIzaSyCq7dRy7lNE3jJq68lD-DuSuyxOwfaDPqE'
};

let t = new TcEmailNotifier(options, fields);
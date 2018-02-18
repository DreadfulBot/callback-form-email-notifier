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
        cssClass: '',
        onClick: '',
        onFocus: ''
    },
    {
        titleTag: 'tel',
        name: 'tel',
        id: 'tel',
        type: 'tel',
        placeholder: 'Введите свой телефон',
        errorTag: 'Неправильный телефон',
        required: true,
        cssClass: '',
        onClick: '',
        onFocus: ''
    }
];

let t = new TcEmailNotifier('callback', '/index.php', true, fields);
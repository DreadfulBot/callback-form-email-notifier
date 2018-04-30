import TcEmailNotifier from '../dist/tc-email-notifier';
import alertify from '../node_modules/alertifyjs/build/alertify';

function initCallbackForm() {
	alertify.defaults.glossary.title = 'Уведомление';

	let fields = [
		{
			titleTag: '<p class="title">Имя:</p>',
			name: 'name',
			id: 'name',
			type: 'text',
			placeholder: 'Введите свое имя',
			required: true,
			cssClass: 'name',
		},
		{
			titleTag: '<p class="title">Email:</p>',
			name: 'email',
			id: 'email',
			type: 'text',
			role: 'email',
			placeholder: 'Введите свой email',
			required: true,
			cssClass: 'email',
		},
		{
			titleTag: '<p class="title">Телефон:</p>',
			name: 'tel',
			id: 'tel',
			type: 'tel',
			role: 'tel',
			placeholder: 'Введите свой телефон',
			required: true,
			cssClass: 'tel',
		},
		{
			name: 'mode',
			id: 'mode',
			type: 'hidden',
			value: 'call'
		},
		{
			titleTag: '<p class="title">Дата:</p>',
			name: 'date',
			id: 'date',
			type: 'text',
			role: 'date',
			placeholder: 'Выберите дату'
		},
		{
			name: 'submit',
			id: 'submit',
			type: 'submit',
			role: 'submit',
			value: 'Отправить',
			parentClass: 'controls'
		},
		{
			titleTag: '<p class="is-checked">С <a href="#">условиями обработки персональных</a> данных согласен:</p>',
			name: 'is-checked',
			id: 'is-checked',
			type: 'checkbox',
			role: 'checkbox',
			required: true,
			parentClass: 'controls'
		}
	];

	let options = {
		formId: 'callback',
		backendUrl: 'tc-email-notifier.php',
		isDebugMode: false,
		addHiddenFields: true,
		addGeolocation: true,
		addRecaptchaButton: true,
		googleMapsApiKey: 'xxx',
		googleReCaptchaApiKey: 'xxx',
		onSuccess: (message) => {  alertify.alert(message); },
		onError: (message) => {  alertify.alert(message); },
	};

	new TcEmailNotifier(options, fields);
}

export {initCallbackForm};
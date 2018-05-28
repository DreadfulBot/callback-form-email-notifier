import InputmaskPhone from 'inputmask/dist/inputmask/inputmask.phone.extensions';
import InputmaskRegex from 'inputmask/dist/inputmask/inputmask.regex.extensions';
import Moment from 'moment';
import jstz from 'jstimezonedetect';
import Picker from 'pickerjs';

require("alertifyjs/build/css/alertify.min.css");
require("pickerjs/dist/picker.min.css");

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
		Moment.locale('ru');
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
		formElement.setAttribute('action', '/index.php');
		formElement.setAttribute('method', 'post');
	}

	addSubmitEventListener() {
		let formElement = document.querySelector(`#${this.options.formId}`);

		let request = obj => {
			return new Promise((resolve, reject) => {
				let xhr = new XMLHttpRequest();
				xhr.responseType = 'json';
				xhr.overrideMimeType("application/json");
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
						reject(xhr.response);
					}
				};
				xhr.onerror = () => reject(xhr.response);
				xhr.send(obj.body);
			});
		};

		formElement.addEventListener('submit', (e) => {
			e.preventDefault();
			if(this.options.beforeSend) this.options.beforeSend();
			request({body: new FormData(e.target)})
			.then(answer => {
				if(this.options.afterSend) this.options.afterSend(answer);
				if(this.options.onSuccess) this.options.onSuccess(answer);
			})
			.catch(error => {
				if(this.options.afterSend) this.options.afterSend(error);
				if(this.options.onError) this.options.onError(error);
			});
		});
	}

	static addFieldEventListener(field, fieldElement) {
		if(field.onClick) fieldElement.onclick = field.onClick;
		if(field.onFocus) fieldElement.onfocus = field.onFocus;
	}

	static formatField(field, fieldElement) {
		let im;
		switch (field.role) {
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
							validator: "[0-9A-Za-zА-Яа-я!#$%&'*+/=?^_`{|}~\-]",
							casing: "lower"
						}
					}
				});
				im.mask(fieldElement);
				break;
			case 'tel':
				im = new InputmaskPhone('+7 (999) 999-99-99');
				im.mask(fieldElement);
				break;
			case 'time':
				new Picker(fieldElement, {
					format: 'HH:mm',
					language: 'ru',
					text: {
						title: 'Выберите время',
						cancel: 'Отмена',
						confirm: 'Выбор'
					}

				});
				break;
			case 'date':
				new Picker(fieldElement, {
					format: 'MM/DD/YYYY',
					language: 'ru',
					text: {
						title: 'Выберите дату',
						cancel: 'Отмена',
						confirm: 'Выбор'
					}
				});
				break;
			case 'submit':
				fieldElement.value = "Отправить";
				break;
			default:
				break;
		}
	}

	static createHiddenField() {
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
				value: new jstz.determine().name()
			},
			{
				name: 'localtime',
				value: new Moment().format()
			},
			{
				name: 'cookies',
				value: document.cookie
			}
		];

		hiddenFields.forEach((field) => {
			let fieldElement = TcEmailNotifier.createHiddenField();
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
			let fieldElement = TcEmailNotifier.createHiddenField();
			fieldElement.setAttribute('id', field.name);
			fieldElement.setAttribute('name', field.name);
			fieldElement.setAttribute('value', field.value);
			formElement.appendChild(fieldElement);
		});

		console.log(geoFields[0])
	}

	static htmlToElement(html) {
		let template = document.createElement('template');
		html = html.trim();
		template.innerHTML = html;
		return template.content.firstChild;
	}

	addRecaptchaButton(formElement) {
		let script = document.createElement('script');
		script.src = 'https://www.google.com/recaptcha/api.js';
		document.body.appendChild(script);

		let button = document.createElement('div');
		button.classList.add('g-recaptcha');
		button.setAttribute('data-sitekey', this.options.googleReCaptchaApiKey);

		formElement.appendChild(button);
	}

	createSingleField(formElement, field) {
		if(this.d) {
			console.log('[x] adding field ');
			this.printObject(field);
		}

      /* forming field element */
		let fieldElement = document.createElement('input');
		fieldElement.setAttribute('id', field.id);
		fieldElement.setAttribute('type', field.type);
		fieldElement.setAttribute('name', field.name);

		if(field.placeholder) fieldElement.setAttribute('placeholder', field.placeholder);
		if(field.cssClass) fieldElement.setAttribute('class', field.cssClass);
		if(field.required) fieldElement.required = true;
		if(field.value) fieldElement.value = field.value;

      /* adding it to area */
		let elementArea = document.createElement('div');
		elementArea.setAttribute('id', field.id);


		if(field.titleTag) elementArea.appendChild(TcEmailNotifier.htmlToElement(field.titleTag));

		elementArea.appendChild(fieldElement);

		if(field.errorTag) elementArea.appendChild(TcEmailNotifier.htmlToElement(field.errorTag));

      /* grouping by areas */
		if(field.parentClass) {
			let block = formElement.querySelector(`.${field.parentClass}`);

			if(!block) {
				block = document.createElement('div');
				block.classList.add(field.parentClass);
				formElement.appendChild(block);
			}

			block.appendChild(elementArea);
		} else {
			formElement.appendChild(elementArea);
		}

		TcEmailNotifier.formatField(field, fieldElement);
		TcEmailNotifier.addFieldEventListener(field, fieldElement);
	}

	createFields() {
		if(this.d) {
			console.log('createFields');
		}

		let formElement = document.querySelector(`#${this.options.formId}`);

		let regularFields = this.fields.filter(element => element.type !== 'submit');
		let controlFields = this.fields.filter(element => element.type === 'submit');

		regularFields.forEach((field) => {
			this.createSingleField(formElement, field);
		});

		if(this.options.addHiddenFields) this.addHiddenFields(formElement);
		if(this.options.addGeolocation) this.addGeolocation(formElement);
		if(this.options.addRecaptchaButton) this.addRecaptchaButton(formElement);

		controlFields.forEach((field) => {
			this.createSingleField(formElement, field);
		});
	}
}
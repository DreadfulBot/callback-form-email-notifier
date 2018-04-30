**PHP EMAIL NOTIFICATION PLUGIN**

BASED ON
* "nette/mail": "2.4.3",
* "nette/utils": "2.4.7",
* "google/recaptcha": "~1.1"

We are in npm now! Simply execute this command to add plugin into your project:
```
npm install callback-form-email-notifier
```

**INSTALLATION**

At first, don't forget:
```
yarn install / nmp install
composer install
```

0. copy *dist/email/settings-example.ini* to *dist/email/settings.ini*
1. set all required values in *dist/email/settings.ini*
2. import  *tc-email-notifier.js* in your js-script where you need
3. modify your webpack/grunt... script to copy *dist/vendor* and *dist/email* folders into your project

**PATH EXPLANATION**
* *vendor* folder is required for working of backend script named *tc-email-notifier.php*, so this folder should be placed at the same level with it;
* *email* folder stores backend script settings and email messages templates. if you successfulye it into another place don't forget to change variable *$base_path* in file *tc-email-notifier.php*;
* default and working directory structure is shown in *dist* folder;


**USAGE**

For more info see working example in */example* folder. You can build it with command 
```
yarn dev \ npm run dev
```

Plugin required 2 objects for initialization: global settings and field settings.

**global settings**
```js
let options = {
		formId: 'callback', /* id of callback form, where all fields and logic will be placed */
		backendUrl: 'tc-email-notifier.php', /* relative link to backend script, that will be executed after submit button pressed */
		isDebugMode: false, /* if true - some debug messages will be printed to console */
		addHiddenFields: true, /* if true - useragent, referrer, timezone, localtime, cookies will be send with all form data  */
		addGeolocation: true, /* if true - geolocation coords and google map will be send with all form data */
		addRecaptchaButton: true, /* if true - google recaptcha button 'i'm not robot' will be added */
		googleMapsApiKey: 'xxx', /* to get it, go to google developer console */
		googleReCaptchaApiKey: 'xxx', /* to get it, go to google developer console */
		onSuccess: (message) => {  alertify.alert(message); }, /* function that will be executed after form successfully submitted   */
		onError: (message) => {  alertify.alert(message); }, /* function that will be executed after form submitted with errors */
	};
```

**field settings**

typical input=text field:
```js
let field = {
			titleTag: '<p class="title">Имя:</p>',
			name: 'name',
			id: 'name',
			type: 'text',
			placeholder: 'Введите свое имя',
			required: true,
			cssClass: 'name',
		};
```

checkbox and submit controls:
```js
let controls = [{
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
		}];
```

**plugin init**
```js
new TcEmailNotifier(options, fields);
```


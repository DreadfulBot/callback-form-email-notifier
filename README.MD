**PHP EMAIL NOTIFICATION PLUGIN**

BASED ON
* "nette/mail": "2.4.3",
* "nette/utils": "2.4.7",
* "google/recaptcha": "~1.1"

**USAGE**
1. set all required values in *app/email/settings.ini*
2. run webpack building
3. include compiled css and js files to your project, copy *email* folder to http root
4. call plugin by construction:
```
$('techcode').tcEmailNotifier({
    'containerId' : 'callUsElement',
    'submitButtonId' : 'submit',
    'backendUrl' : 'tc-email-notifier.php',
    'isModal' : false
});
```
    


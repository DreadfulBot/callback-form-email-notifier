<?php
/*
 * [techcode email notifier]
 * author: Artem Krivoshchekov [zorg1995@yandex.ru]
 * all rights reserved
 * 07.08.2017
 */

require __DIR__ . '/vendor/autoload.php';
require __DIR__ . '/email/recaptchalib.php';

use Nette\Mail\Message;
use Nette\Mail\SendmailMailer;

require __DIR__ . '/email/autoload.php';

// MAIN //
$basePath = 'email/';
$settingsFileName = 'settings.ini';

try {

    $settingsWorker = new SettingsWorker();
    $fileWorker = new FileWorker();
    $emailMessageTemplateWorker = new EmailMessageTemplateWorker($settingsWorker, $fileWorker);
    $settingsWorker->loadSettings($basePath . $settingsFileName);

    try {
        $googleCaptchaValidator = new GoogleCaptchaWorker(
            ParametersWorker::get('g-recaptcha-response'),
            $settingsWorker->getOption('system', 'googleReCaptchaApiKey')
        );

        if(!$googleCaptchaValidator->checkIsCaptchaValid())
            throw new Exception("Подтвердите, что вы не робот");
    } catch (SkipStepException $e) {
        // skipping google captcha checking
    } catch (EmptyParameterException $e) {

    }


    $mode = ParametersWorker::get('mode');
    $messageTemplate = $settingsWorker->getOption('template', $mode);

    $emailMessageTemplateWorker->loadMessageTemplateFile($basePath . $messageTemplate);
    $emailMessageTemplateWorker->bindRequiredParams();
    $emailMessageTemplateWorker->bindOptionalParams();

    $fileName = $this->fileWorker->getMovedUploadFileUrl(
        $this->settingsWorker->getOption('system', 'uploadDir'),
        $this->settingsWorker->getOption('system', 'site')
    );

    $emailMessageTemplateWorker->bindFile($fileWorker);

    // start message forming
    $from = $settingsWorker->getOption('sender', 'from');
    $subject = $settingsWorker->getOption('sender', 'title');
    $to = $settingsWorker->getOption('receiver', 'to');

    foreach (explode(',', $to) as $to) {
        try {
            $mail = new Message();

            $mail->setFrom($from)
                ->addTo($to)
                ->setSubject($subject)
                ->setHtmlBody($messageTemplate);


            // $mailer = new SendmailMailer;
            // $mailer->send($mail);

            $mailer = new Nette\Mail\SmtpMailer(array(
                'host' => $settingsWorker->getOption('smtp', 'host'),
                'username' => $settingsWorker->getOption('smtp', 'user'),
                'password' => $settingsWorker->getOption('smtp', 'password')
            ));

            $mailer->send($mail);
        } catch (Exception $e) {
            throw new Exception('Не удалось отправить письмо адресату ' . $to . $e->getMessage());
        }
    }

    JsonWorker::send("Сообщение было успешно отправлено", true);
    return;
} catch (Exception $e) {
    JsonWorker::send($e->getMessage(), false);
    return;
}
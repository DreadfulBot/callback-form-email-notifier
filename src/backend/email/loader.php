<?php

class Loader {
    public function __construct()
    {
        require __DIR__ . '/Exceptions/SkipStepException.php';
        require __DIR__ . '/Exceptions/EmptyParameterException.php';
        require __DIR__ . '/Model/ErrorMessage.php';

        require __DIR__ . '/Workers/SettingsWorker.php';
        require __DIR__ . '/Workers/GoogleCaptchaWorker.php';
        require __DIR__ . '/Workers/ParametersWorker.php';
        require __DIR__ . '/Workers/FileWorker.php';
        require __DIR__ . '/Workers/EmailMessageTemplateWorker.php';
        require __DIR__ . '/Workers/JsonWorker.php';
    }
}


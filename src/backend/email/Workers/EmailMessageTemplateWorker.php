<?php
class EmailMessageTemplateWorker {
    protected $messageTemplate;

    /* @var SettingsWorker $settingsWorker */
    protected $settingsWorker;

    public function __construct($settingsWorker)
    {
        $this->settingsWorker = $settingsWorker;

    }

    public function loadMessageTemplateFile($path) {
        if(!file_exists($path)) {
            throw new Exception(ErrorMessage::getMessage('template'));
        }

        $this->messageTemplate = file_get_contents($path);
    }

    protected function bindParameter($paramName, $paramValue) {
        $converted = str_replace('{'.$paramName.'}', $paramValue, $this->messageTemplate);
        $this->messageTemplate = $converted;

    }

    public function bindRequiredParams() {
        $requiredParams = explode(',',
            $this->settingsWorker->getOption('template',ParametersWorker::get('mode').'ParamsRequired'));

        foreach ($requiredParams as $paramName) {
            $this->bindParameter($paramName, ParametersWorker::get($paramName));
        }

        /* bind site name */
        $this->bindParameter('site', $this->settingsWorker->getOption('system', 'site'));
    }

    public function bindOptionalParams() {
        $optionalParams = explode(',',
            $this->settingsWorker->getOption('template',ParametersWorker::get('mode').'ParamsOptional'));

        foreach ($optionalParams as $paramName) {
            try {
                $this->bindParameter($paramName, ParametersWorker::get($paramName));
            } catch (EmptyParameterException $e) {
                $this->bindParameter($paramName, 'X');
            }
        }
    }

    public function bindFile($fileName) {
        if($fileName) {
            $this->bindParameter('uploadFileUrl', $fileName);
            $fifo = pathinfo(basename($fileName));
            $this->bindParameter('uploadFileName', $fifo['filename'] . '.' . $fifo['extension']);
        } else {
            $this->bindParameter('uploadFileUrl', '#');
        }
    }
}
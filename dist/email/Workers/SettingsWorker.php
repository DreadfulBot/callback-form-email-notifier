<?php
class SettingsWorker {
    protected $settings = [];


    public function loadSettings($path) {
        if(!file_exists($path)) {
            throw new Exception(ErrorMessage::getMessage('settings'));
        }

        $this->settings = parse_ini_file($path, true);
    }

    public function getOption($section, $name) {
        if(!isset($this->settings[$section][$name])) {
            throw new Exception(ErrorMessage::getMessage($section));
        }

        return $this->settings[$section][$name];
    }
}
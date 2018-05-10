<?php
class ParametersWorker {
    public static function get($name) {
        if(!isset($_POST[$name]))
            throw new EmptyParameterException(ErrorMessage::getMessage('empty-parameter') . ' ' . $name);

        return $_POST[$name];
    }
}
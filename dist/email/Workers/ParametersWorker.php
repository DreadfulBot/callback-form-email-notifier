<?php
class ParametersWorker {
    public static function get($name) {
        if(is_null($_POST[$name]))
            throw new EmptyParameterException(ErrorMessage::getMessage('empty-parameter') . ' ' . $name);

        return $_POST[$name];
    }
}
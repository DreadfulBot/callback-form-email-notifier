<?php
class ErrorMessage {
    const messages = [
        'mode' => 'Не удалось определить тип запроса',
        'template' => 'Не удалось определить шаблон сообщения',
        'settings' => 'Не удалось загрузить файл настроек',
        'uploadFileSizeError' => 'Файл слишком большой',
        'uploadFileError' => 'Не удалось загрузить приложенный файл',
        'g-recaptcha-response' => 'Не пройдена проверка на робота',
        'empty-parameter' => 'Не указан обязательный параметр'
    ];

    public static function getMessage($name) {
        if(is_null(self::messages[$name])) {
            return 'undefined error';
        }

        return self::messages[$name];
    }
}
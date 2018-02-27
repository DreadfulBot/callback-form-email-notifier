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

// MAIN //
$base_path = 'email/';
$params = $_POST;

function isCaptchaValid($token, $accessKey) {
    // ваш секретный ключ
    $secret = $accessKey;

    // пустой ответ
    $response = null;

    // проверка секретного ключа
    $reCaptcha = new ReCaptcha($secret);

    if ($token) {
        $response = $reCaptcha->verifyResponse(
            $_SERVER["REMOTE_ADDR"],
            $_POST["g-recaptcha-response"]
        );
        if ($response != null && $response->success) {
            return true;
        } else {
            return false;
        }
    } else {
        return false;
    }
}

function answerJson($data, $status) {
    header('Content-type: application/json; charset=utf-8');
    echo json_encode(array("status" => $status, "error" => $data), JSON_UNESCAPED_UNICODE);
}

function getMovedUploadFileUrl($uploadDir, $site) {
    if (!isset($_FILES) || !isset($_FILES['file']))
        return null;

    if($_FILES['file']['error'] == '2') {
        throw new Exception("Файл слишком большой");
    }

    $currentDate = date('d-m-Y-H-i-s');

    $pathParts = pathinfo(basename($_FILES['file']['name']));

    $newFileName = trim($pathParts['filename']) .
        '_' . $currentDate .
        '.' . $pathParts['extension'];
    $uploadFile = $uploadDir . '/' . $newFileName;

    if (!move_uploaded_file($_FILES['file']['tmp_name'], $uploadFile)) {
        throw new Exception("Не удалось загрузить файл");
    }

    $url = sprintf("%s/%s/%s", $site, "uploads", $newFileName);
    return $url;
}

try {
    // load settings
    if(!file_exists($base_path . 'settings.ini')) {
        throw new Exception('Не удалось загрузить файл настроек');
    }

    $ini_array = parse_ini_file($base_path . "settings.ini", true);

    if(isset($params['g-recaptcha-response'])) {
        if(!isCaptchaValid($params['g-recaptcha-response'], $ini_array['system']['googleAccessKey'])) {
            throw new Exception("Подтвердите, что вы не робот");
        }
    }

    // detect mode
    if(empty($params['mode'])) {
        throw new Exception('Не удалось определить тип запроса');
    }

    $mode = $params['mode'];

    // detect template
    if(empty($ini_array['template'][$mode])) {
        throw new Exception('Не удалось определить шаблон сообщения');
    }

    $message_template = $ini_array['template'][$mode];

    if(!file_exists($base_path . $message_template)) {
        throw new Exception('Не удалось определить шаблон сообщения');
    }

    $message_template = file_get_contents($base_path . $message_template);

    //detect template params
    if(empty($ini_array['template'][$mode.'ParamsRequired'])) {
        throw new Exception('Не удалось определить обязательные параметры для шаблона сообщения');
    }

    $required_message_params = json_decode($ini_array['template'][$mode.'ParamsRequired']);
    $optional_message_params = json_decode($ini_array['template'][$mode.'ParamsOptional']);
    $params['site'] = $ini_array['system']['site'];

    // check template params exists
    foreach ($required_message_params as $message_param) {
        if(empty($params[$message_param])) {
            throw new Exception($message_param . ' - значение не может быть пустым');
        }
    }

    // move upload file
    $fileName = getMovedUploadFileUrl($ini_array['system']['uploadDir'], $ini_array['system']['site']);
    if($fileName) {
        $params["uploadFileUrl"] = $fileName;
        $fifo = pathinfo(basename($fileName));
        $params["uploadFileName"] = $fifo['filename'] . '.' . $fifo['extension'];
    } else {
        $params["uploadFileUrl"] = '#';
    }

    // bind required params in template
    foreach ($required_message_params as $message_param) {
        $message_template =
            str_replace('{'.$message_param.'}', $params[$message_param], $message_template);
    }

    // bind optional params in template
    $key = '';
    foreach ($optional_message_params as $message_param) {
        $key = '{'.$message_param.'}';
        if(!empty($params[$message_param])) {
            $message_template =
                str_replace($key, $params[$message_param], $message_template);
        } else {
            $message_template =
                str_replace($key, 'X', $message_template);
        }
    }

    // start message forming
    $from = $ini_array['sender']['from'];
    $subject = $ini_array['sender']['title'];

    foreach (json_decode($ini_array['receiver']['to']) as $to) {
        try {
            $mail = new Message();

            $mail->setFrom($from)
                ->addTo($to)
                ->setSubject($subject)
                ->setHtmlBody($message_template);


            // $mailer = new SendmailMailer;
            // $mailer->send($mail);

            $mailer = new Nette\Mail\SmtpMailer(array(
                'host' => $ini_array['smtp']['host'],
                'username' => $ini_array['smtp']['user'],
                'password' => $ini_array['smtp']['password']
            ));

            $mailer->send($mail);
        } catch (Exception $e) {
            throw new Exception('Не удалось отправить письмо адресату ' . $to . $e->getMessage());
        }
    }

    answerJson("Сообщение было успешно отправлено", true);
} catch (Exception $e) {
    answerJson($e->getMessage(), false);
    return;
}
<?php

class JsonWorker {
    static function send($data, $status) {
        header('Content-type: application/json; charset=utf-8');

        if(!$status) {
            header('HTTP/1.1 500' . $data);
            echo json_encode(array('status' => $status, 'error' => $data, 'code' => 1337), JSON_UNESCAPED_UNICODE);
        } else {
            header('HTTP/1.1 200' . $data);
            echo json_encode(array('status' => $status, 'error' => $data, 'code' => 200), JSON_UNESCAPED_UNICODE);
        }
    }
}
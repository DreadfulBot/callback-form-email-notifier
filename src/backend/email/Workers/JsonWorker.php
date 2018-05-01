<?php

class JsonWorker {
    static function send($data, $status) {
        header('Content-type: application/json; charset=utf-8');
        echo json_encode(array("status" => $status, "error" => $data), JSON_UNESCAPED_UNICODE);
    }
}
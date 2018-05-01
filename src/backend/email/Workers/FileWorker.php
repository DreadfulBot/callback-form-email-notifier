<?php

class FileWorker {
    public function getMovedUploadFileUrl($site, $uploadDir) {
        if (!isset($_FILES) || !isset($_FILES['file']))
            return null;

        if($_FILES['file']['error'] == '2') {
            throw new Exception(ErrorMessage::getMessage('uploadFileSizeError'));
        }

        $currentDate = date('d-m-Y-H-i-s');

        $pathParts = pathinfo(basename($_FILES['file']['name']));

        $newFileName = trim($pathParts['filename']) .
            '_' . $currentDate .
            '.' . $pathParts['extension'];

        $uploadFile = $uploadDir . '/' . $newFileName;

        if (!move_uploaded_file($_FILES['file']['tmp_name'], $uploadFile)) {
            throw new Exception(ErrorMessage::getMessage('uploadFileError'));
        }

        $url = sprintf("%s/%s/%s", $site, "uploads", $newFileName);
        return $url;
    }
}
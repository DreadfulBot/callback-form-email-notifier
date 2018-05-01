<?php

class GoogleCaptchaWorker {
    protected $token;
    protected $accessKey;

    public function __construct($token, $accessKey)
    {
        $this->token = $token;
        $this->accessKey = $accessKey;
    }

    public function checkIsCaptchaValid() {
        if(is_null($_SERVER["REMOTE_ADDR"]) || is_null($_POST["g-recaptcha-response"]))
            throw new SkipStepException('remote address or g-recaptcha-response parameter is not allowed');

        $reCaptcha = new ReCaptcha($this->accessKey);

        $response = $reCaptcha->verifyResponse(
            $_SERVER["REMOTE_ADDR"],
            $_POST["g-recaptcha-response"]
        );

        if ($response != null && $response->success) {
            return true;
        } else {
            return false;
        }
    }
}
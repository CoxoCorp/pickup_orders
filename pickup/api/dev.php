<?php
const __IS_DEV__ = true;
global $USER;
$headers = apache_request_headers();
if (!$USER->IsAuthorized()) {
    $USER->Authorize(112648, true);

    //$USER->Authorize(99413, true); //админ


}

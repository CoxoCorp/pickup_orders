<?php
require "../header_auth.php";
global $USER;

$res=[
    'status'=>'error',
];

if ($USER->IsAuthorized()) {
    Bitrix\Main\Loader::includeModule("coxo.pickup");
    $res=Coxo\Pickup\Api::getWorker( $USER->getId());
}

echo json_encode($res, JSON_NUMERIC_CHECK);
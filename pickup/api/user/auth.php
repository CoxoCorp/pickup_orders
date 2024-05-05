<?php
require "../header_auth.php";
global $USER;
$request = \Bitrix\Main\Context::getCurrent()->getRequest();
$login=$request->get('login');
$password=$request->get('password');

$arAuthResult = $USER->Login($login,$password, "Y");
if (is_array($arAuthResult)) {
    $res = [
        'status' => 'error',
        'error' => [
            'message' => strip_tags($arAuthResult['MESSAGE'])
        ]
    ];
} else {
    Bitrix\Main\Loader::includeModule("coxo.pickup");
    $res=Coxo\Pickup\Api::getWorker( $USER->getId());
}
echo json_encode($res, JSON_NUMERIC_CHECK);
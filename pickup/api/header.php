<?php
if (array_key_exists('HTTP_ORIGIN', $_SERVER)) {
    $allow_domens=[
        "http://localhost:5173",
    ];
    if ($_SERVER['HTTP_ORIGIN']) {
        if (in_array($_SERVER['HTTP_ORIGIN'], $allow_domens)) header("Access-Control-Allow-Origin: " . $_SERVER['HTTP_ORIGIN']);
        header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, Auth, devUserId, Dev-Token, X-Requested-With");
        header("Access-Control-Max-Age: 86400");
    }
    if ($_SERVER['REQUEST_METHOD']==="OPTIONS") die();
}
$headers = apache_request_headers();
require($_SERVER["DOCUMENT_ROOT"] . "/bitrix/modules/main/include/prolog_before.php");

if ($_SERVER['HTTP_REFERER']==="http://localhost:5173/") {
    $headers = apache_request_headers();
    if ($headers['Dev-Token']) {
        global $USER;
        $USER->Authorize($headers['Dev-Token'], true); //Реальный покупатель
    }
}

if ($_SERVER['HTTP_ORIGIN']) {
    require_once ("dev.php");
} else {
    require_once ("prod.php");
}

global $USER;
if ($USER->IsAuthorized()) {
    //Проверяем права доступа для запроса
    Bitrix\Main\Loader::includeModule("coxo.pickup");
    $res=Coxo\Pickup\Api::getWorker( $USER->getId());

} else {
    $res=[
        'status'=>'error',
        'error'=>[
            'code'=>'NotAuth',
            'message'=>'Вы не авторизованы на сайте!',
            'recommendation'=>'Доступ в данный раздел имеют только администраторы интернет-магазина Сохо',
        ]
    ];
}

if (!empty($res)) {
    if ($res['status']==='error') {
        echo json_encode($res, JSON_NUMERIC_CHECK);
        die();
    }
}
<?php
if (array_key_exists('HTTP_ORIGIN', $_SERVER)) {
    $allow_domens=[
        "http://localhost:5174",
        "http://localhost:5174/",
        "https://coxo.ru",
    ];
    if ($_SERVER['HTTP_ORIGIN']) {
        if (in_array($_SERVER['HTTP_ORIGIN'], $allow_domens)) header("Access-Control-Allow-Origin: " . $_SERVER['HTTP_ORIGIN']);
        header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, Auth, devUserId, devBuyerId, X-Requested-With");
        header("Access-Control-Max-Age: 86400");
    }
    if ($_SERVER['REQUEST_METHOD']==="OPTIONS") die();
}
$headers = apache_request_headers();
require($_SERVER["DOCUMENT_ROOT"] . "/bitrix/modules/main/include/prolog_before.php");

if ($_SERVER['HTTP_ORIGIN']) {
    require_once ("dev.php");
} else {
    require_once ("prod.php");
}

global $USER;
if ($USER->IsAuthorized()) {
    //Проверяем права доступа для запроса

    $arGroups = CUser::GetUserGroup($USER->GetID());
    $arGroupAvalaible=[30];
    $result_intersect = array_intersect($arGroupAvalaible, $arGroups);

    if (!empty($result_intersect)) {
        $access=true;
    } else {
        $access=false;
    }

    if (array_key_exists('Auth', $headers)) {
        if (__IS_DEV__) {
            $access = true;
        }
    }
    if (!$access) {
        $res = [
            'status' => 'error',
            'error' => [
                'code' => 'NotAccess',
                'message' => 'Недостаточно прав для просмотра страницы!',
                'recommendation' => 'Если Вам необходим доступ, свяжитесь с руководителем IT отдела компании Coxo',
            ]
        ];
    }

} else {
    $res=[
        'status'=>'error',
        'error'=>[
            'code'=>'NotAuth',
            'message'=>'Вы не авторизованы на сайте!',
            'recommendation'=>'Доступ в данный раздел имеют только администраторы интернет-магазина Сохо',
            'ankor'=>'Авторизоваться',
            'appLink'=>'https://www.coxo.ru/auth/?backurl=/admin/'
        ]
    ];
}

if (!empty($res)) {
    echo json_encode($res, JSON_NUMERIC_CHECK);
    die();
}
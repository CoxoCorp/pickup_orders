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
require($_SERVER["DOCUMENT_ROOT"] . "/bitrix/modules/main/include/prolog_before.php");


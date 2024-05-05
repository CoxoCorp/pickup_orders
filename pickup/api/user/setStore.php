<?php
require "../header.php";
$request = \Bitrix\Main\Context::getCurrent()->getRequest();
$store=trim($request->get('store'));
echo json_encode(setStore($store), JSON_NUMERIC_CHECK);

function setStore($store): array
{
    global $USER;
    if (!$store) return [
        'status'=>'error',
        'error'=>[
            'message'=>'Не указан Store'
        ]
    ];

    if (!$USER->IsAuthorized()) {
        return [
            'status'=>'error',
            'error'=>[
                'message'=>'Вы не авторизированны на сайте',
                'appLink'=> '/auth/?backUrl=/pickup/',
                'ankor'=>'Авторизоваться'
            ]
        ];  
    }
    $user = new CUser;
    $user->Update($USER->getId(), ['UF_PICKUP_STORE_LINK'=>$store]);

    return [
        'status'=>'ok',
        'data'=>[
            'store'=>$store,
            'userId'=>$USER->getId()
        ]
    ];
}
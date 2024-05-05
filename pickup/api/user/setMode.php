<?php
require "../header.php";
$request = \Bitrix\Main\Context::getCurrent()->getRequest();
$mode=trim($request->get('mode'));
echo json_encode(setMode($mode), JSON_NUMERIC_CHECK);

function setMode($mode): array
{
    global $USER;
    if (!$mode) return [
        'status'=>'error',
        'error'=>[
            'message'=>'Не указан Mode'
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
    $user->Update($USER->getId(), ['UF_PICKUP_MODE'=>$mode]);

    return [
        'status'=>'ok',
        'data'=>[
            'mode'=>$mode,
            'userId'=>$USER->getId()
        ]
    ];
}
<?php
require "../header.php";
$request = \Bitrix\Main\Context::getCurrent()->getRequest();
Bitrix\Main\Loader::includeModule('messenger');
$type=$request->get('type');
$phone=$request->get('phone');
$telegramChatId=$request->get('telegramChatId');
$dealId=$request->get('shipmentId');
$res=sendCode($type, $phone, $telegramChatId, $dealId);
echo json_encode($res, JSON_NUMERIC_CHECK);

function sendCode($type, $phone, $telegramChatId, $dealId): array
{
    $codeFields=[
        'USER_PHONE'=>$phone,
        'DEAL_ID'=>$dealId
    ];
    $code=Messenger\Api::getCode($codeFields);
    switch ($type) {
        case "voice":
            $text = $code;
            break;
        case "vk":
            $text = $code . ' - ваш код подтверждения';
            break;
        default:
            $text = $code." - Ваш код авторизации на сайте СОХО.RU";
    }
    $params=[
        'method'=>$type,
        'phone'=>$phone,
        'message'=>$text,
        'telegram'=>$telegramChatId
    ];
    return Messenger\Api::sendMessage($params);

}
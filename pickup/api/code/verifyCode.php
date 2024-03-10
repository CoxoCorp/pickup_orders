<?php
require "../header.php";
$request = \Bitrix\Main\Context::getCurrent()->getRequest();
Bitrix\Main\Loader::includeModule('messenger');
$phone=$request->get('phone');
$dealId=$request->get('shipmentId');
$code=$request->get('code');
$res=verifyCode($phone, $dealId, $code);
echo json_encode($res, JSON_NUMERIC_CHECK);

function verifyCode($phone, $dealId, $code): array
{
    $codeFields=[
        'USER_PHONE'=>$phone,
        'DEAL_ID'=>$dealId
    ];
    $currentCode=Messenger\Api::getCode($codeFields);
    if ($currentCode===$code)  {
        return [
            'status'=>'ok',
            'data'=>[
                'phone'=>$phone,
                'dealId'=>$dealId,
                'code'=>$code
            ]
        ];
    }
    return [
        'status'=>'error',
        'error'=>[
            'message'=>'Код введен неверно. Повторите попытку.'
        ]
    ];
}
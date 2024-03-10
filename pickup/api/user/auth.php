<?php
require "../header_auth.php";
global $USER;
$request = \Bitrix\Main\Context::getCurrent()->getRequest();
$login=$request->get('login');
$password=$request->get('password');
require $_SERVER["DOCUMENT_ROOT"]."/customClasses/CustomUser.php";



$arAuthResult = $USER->Login($login,$password, "Y");
if (is_array($arAuthResult)) {
    $res = [
        'status' => 'error',
        'error' => [
            'message' => strip_tags($arAuthResult['MESSAGE'])
        ]
    ];
} else {
    $arGroups = CUser::GetUserGroup($USER->GetID());
    if (in_array(30, $arGroups)) {
        $res=[
            'status'=>'ok',
            'data'=>[
                'user'=>[
                    'id'=>$USER->getId(),
                    'firstName'=>$USER->GetFirstName(),
                ]
            ]
        ];
    } else {
        $res = [
            'status' => 'error',
            'error' => [
                'message' => "У Вас недостаточно прав для работы с системой. Обратитесь к руководителю ИТ отдела для получения необходимых прав."
            ]
        ];
    }



}
echo json_encode($res, JSON_NUMERIC_CHECK);
<?php
require "../header_auth.php";
global $USER;

$res=[
    'status'=>'error',
];

if ($USER->IsAuthorized()) {
    $arGroups = CUser::GetUserGroup($USER->GetID());
    if (in_array(30, $arGroups)) {
        $res = [
            'status' => 'ok',
            'data' => [
                'user' => [
                    'id' => $USER->getId(),
                    'firstName' => $USER->GetFirstName(),
                ]
            ]
        ];
    }
}

echo json_encode($res, JSON_NUMERIC_CHECK);
<?php
require "../header.php";
$res=[
    'status'=>'error',
];
global $USER;

if ($USER->IsAuthorized()) {
    Bitrix\Main\Loader::includeModule("coxo.pickup");
    $res=Coxo\Pickup\Api::loadPossibleOrders( $USER->getId());
}

echo json_encode($res, JSON_NUMERIC_CHECK);
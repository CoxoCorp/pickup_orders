<?php
require($_SERVER["DOCUMENT_ROOT"]."/bitrix/modules/main/include/prolog_before.php");
Bitrix\Main\Loader::includeModule("coxo.pickup");
$request = \Bitrix\Main\Context::getCurrent()->getRequest();
$orderId=trim($request->get('orderId'));
$api= new Coxo\Pickup\Api('prod');
$data=$api->getOrder($orderId);
echo '<pre>';
print_r($data);
echo '</pre>';
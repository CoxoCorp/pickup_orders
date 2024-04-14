<?php
require($_SERVER["DOCUMENT_ROOT"]."/bitrix/modules/main/include/prolog_before.php");
Bitrix\Main\Loader::includeModule("coxo.pickup");
$api= new Coxo\Pickup\Api('dbs');


$api->checkOrders();

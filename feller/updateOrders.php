<?php
require($_SERVER["DOCUMENT_ROOT"]."/bitrix/modules/main/include/prolog_before.php");
Bitrix\Main\Loader::includeModule("coxo.pickup");
$api= new Coxo\Pickup\Api('dev');
echo '<pre>';
print_r($api->updateShipments());
echo '</pre>';

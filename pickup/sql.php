<?php
require($_SERVER["DOCUMENT_ROOT"] . "/bitrix/modules/main/include/prolog_before.php");
Bitrix\Main\Loader::includeModule("coxo.pickup");
?>
<h1>Первичные данные</h1>
<?php
$connection = Bitrix\Main\Application::getConnection();
foreach (Coxo\Pickup\ShopTable::getSqlQuery() as $query) {
    $res = $connection->query($query);
}
echo 'Магазины созданы <br>';
foreach (Coxo\Pickup\ShipmentTable::getSqlQuery() as $query) {
    $res = $connection->query($query);
}
echo 'Shipment созданы <br>';
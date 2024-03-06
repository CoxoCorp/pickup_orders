<?php
require($_SERVER["DOCUMENT_ROOT"] . "/bitrix/modules/main/include/prolog_before.php");
Bitrix\Main\Loader::includeModule("coxo.loyalty");
?>
<h1>Первичные данные</h1>
<?php
$connection = Bitrix\Main\Application::getConnection();
foreach (Coxo\Loyalty\ItemTable::getSqlQuery() as $query) {
    $res = $connection->query($query);
}
echo 'Товары созданы <br>';
<?php
require($_SERVER["DOCUMENT_ROOT"] . "/bitrix/modules/main/include/prolog_before.php");
Bitrix\Main\Loader::includeModule("coxo.pickup");


//Добавить столбец
//'ALTER TABLE '.
//Coxo\Loyalty\ProjectTable::getTableName().
//' ADD COLUMN CODE VARCHAR(255)'

//Удалить столбец
//'DROP TABLE '.
//Coxo\Loyalty\ProjectTable::getTableName().

//поменять тип
//'ALTER TABLE '.
//Coxo\Pickup\ShipmentTable::getTableName().
//' MODIFY COLUMN DELIVER_ID VARCHAR(255)',


$arMigrate=[
    'ALTER TABLE '.
Coxo\Pickup\ItemTable::getTableName().
' ADD COLUMN ITEM_INDEX INT',

];

$connection = Bitrix\Main\Application::getConnection();
foreach ($arMigrate as $query) {
    $res = $connection->query($query);
}
echo 'Миграция завершена';
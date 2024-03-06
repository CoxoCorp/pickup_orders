<?php
require($_SERVER["DOCUMENT_ROOT"] . "/bitrix/modules/main/include/prolog_before.php");
Bitrix\Main\Loader::includeModule("coxo.loyalty");


//Добавить столбец
//'ALTER TABLE '.
//Coxo\Loyalty\ProjectTable::getTableName().
//' ADD COLUMN CODE VARCHAR(255)'

//Удалить столбец
//'DROP TABLE '.
//Coxo\Loyalty\ProjectTable::getTableName().



$arMigrate=[
'ALTER TABLE '.
Coxo\Loyalty\ItemTable::getTableName().
' ADD COLUMN TITLE VARCHAR(255)'
];

$connection = Bitrix\Main\Application::getConnection();
foreach ($arMigrate as $query) {
    $res = $connection->query($query);
}
echo 'Миграция завершена';
<?php
use Bitrix\Main\Config\Option;
global $APPLICATION;
$moduleId="coxo.pickup";

$aTabs=[];

$aTabs[]=[
    "DIV"=>"setting",
    "TAB"=>"Параметры",
    "TITLE"=>"Параметры системы выдачи заказов",
    "OPTIONS"=>[
        [
            "sql_prefix",
            "Префикс для таблиц в MySql",
            "",
            ["text"],
        ],
    ],

];

if ($_SERVER['REQUEST_METHOD'] == 'POST')
{
    $options=[];
    foreach ($aTabs as $tab) {
        $options=array_merge($options,$tab['OPTIONS']);
    }
    __AdmSettingsSaveOptions($moduleId, $options);
    LocalRedirect($APPLICATION->GetCurPage() . '?mid_menu=1&mid=' . urlencode($moduleId));
}

$tabControl = new CAdminTabControl("tabControl", $aTabs, false);

?>
    <form action="" method="post">
        <?php
        $tabControl->Begin();
        foreach ($aTabs as $tab) {
            $tabControl->BeginNextTab();
            __AdmSettingsDrawList($moduleId, $tab['OPTIONS']);
            $tabControl->EndTab();
        }
        $tabControl->Buttons(array('btnApply' => false, 'btnCancel' => false, 'btnSaveAndAdd' => false));
        bitrix_sessid_post();
        $tabControl->End();
        ?>
    </form>
<?php
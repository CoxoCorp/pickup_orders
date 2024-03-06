<?php
use Bitrix\Main\Application;
use Bitrix\Main\Loader;
use Bitrix\Main\Entity\Base;
use Bitrix\Main\Localization\Loc;
use Bitrix\Main\ModuleManager;

class coxo_pickup extends CModule
{
    public function __construct()
    {
        $arModuleVersion = array();
        include __DIR__ . '/version.php';
        if (is_array($arModuleVersion) && array_key_exists('VERSION', $arModuleVersion)) {
            $this->MODULE_VERSION = $arModuleVersion['VERSION'];
            $this->MODULE_VERSION_DATE = $arModuleVersion['VERSION_DATE'];
        }
        $this->MODULE_ID = 'coxo.pickup';
        $this->MODULE_NAME = "Coxo. Система выдачи заказов";
        $this->MODULE_DESCRIPTION = "Обеспечивает работу выдачи заказов";
        $this->MODULE_GROUP_RIGHTS = 'N';
        $this->PARTNER_NAME = "Coxo";
        $this->PARTNER_URI = 'https://feller.ru';
    }
    //здесь мы описываем все, что делаем до инсталляции модуля, мы добавляем наш модуль в регистр и вызываем метод создания таблицы
    public function doInstall()
    {
        ModuleManager::registerModule($this->MODULE_ID);
    }
    //вызываем метод удаления таблицы и удаляем модуль из регистра
    public function doUninstall()
    {
        $this->uninstallDB();
        ModuleManager::unRegisterModule($this->MODULE_ID);
    }
    //вызываем метод создания таблицы из выше подключенного класса
    public function installDB()
    {

    }
    //вызываем метод удаления таблицы, если она существует
    public function uninstallDB()
    {

    }
}
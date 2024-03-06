<?
namespace Coxo\Pickup;
use Bitrix\Main\Entity,
    Bitrix\Main\ORM\Query\Join,
    Bitrix\Main\ORM\Fields\Relations\OneToMany,
    Bitrix\Main\ORM\Fields\Relations\Reference;
class ShopTable extends Entity\DataManager
{
    public static function getSqlQuery()
    {
        return (self::getEntity()->compileDbTableStructureDump());
    }
    public static function getTableName(): string
    {
        return \Bitrix\Main\Config\Option::get("coxo.pickup", 'sql_prefix').'_shops';
    }

    public static function getMap(): array
    {
        return array(
            new Entity\IntegerField(
                'ID',
                array(
                    'primary' => true,
                    'autocomplete' => true
                )),
            new Entity\StringField('TITLE', [
                'required'=>true
            ]),
            new Entity\IntegerField('CREATE_TIMESTAMP'),
            new Entity\IntegerField('PHONE'),
            new Entity\StringField('CITY'),
            new Entity\StringField('ADDRESS'),
            new Entity\StringField('EMAIL'),
            new Entity\FloatField('GPS_N'),
            new Entity\FloatField('GPS_S'),
            new Entity\StringField('WORK_TIME'),
        );
    }
}
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
            new Entity\StringField('TITLE'),
            new Entity\IntegerField('CREATE_TIMESTAMP'),
            new Entity\StringField('ADDRESS'),
            new Entity\IntegerField('BITRIX_ID'),
            new Entity\StringField('CODE'),
        );
    }
}
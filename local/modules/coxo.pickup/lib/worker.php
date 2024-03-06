<?
namespace Coxo\Pickup;
use Bitrix\Main\Entity,
    Bitrix\Main\ORM\Query\Join,
    Bitrix\Main\ORM\Fields\Relations\OneToMany,
    Bitrix\Main\ORM\Fields\Relations\Reference;
class WorkerTable extends Entity\DataManager
{
    public static function getSqlQuery()
    {
        return (self::getEntity()->compileDbTableStructureDump());
    }

    public static function getTableName(): string
    {
        return \Bitrix\Main\Config\Option::get("coxo.pickup", 'sql_prefix').'_workers';
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
            new Entity\StringField('BITRIX_USER_ID'),
            new Entity\IntegerField('PHONE'),
            new Entity\IntegerField('SHOP_ID'),
            (new Reference(
                'SHOP',
                ShopTable::class,
                Join::on('this.SHOP_ID', 'ref.ID')
            ))->configureJoinType('inner'),
            new Entity\StringField('FIRST_NAME'),
            new Entity\StringField('LAST_NAME'),
            new Entity\StringField('SECOND_NAME'),
        );
    }
}
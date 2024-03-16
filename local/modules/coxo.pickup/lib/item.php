<?php
namespace Coxo\Pickup;

use Bitrix\Main\Entity,
    Bitrix\Main\ORM\Query\Join,
    Bitrix\Main\ORM\Fields\Relations\OneToMany,
    Bitrix\Main\ORM\Fields\Relations\Reference;

class ItemTable extends Entity\DataManager
{
    public static function getSqlQuery()
    {
        return (self::getEntity()->compileDbTableStructureDump());
    }

    public static function getTableName(): string
    {
        return \Bitrix\Main\Config\Option::get("coxo.pickup", 'sql_prefix') . '_items';
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
            new Entity\StringField('SHIPMENT_ID', [
                'required' => true
            ]),
            (new Reference(
                'SHIPMENT',
                ShopTable::class,
                Join::on('this.SHIPMENT_ID', 'ref.SHIPMENT_ID')
            ))->configureJoinType('inner'),
            new Entity\StringField('OFFER_ID'),
            new Entity\StringField('NAME'),
            new Entity\IntegerField('ITEM_INDEX'),
            new Entity\IntegerField('PRICE'),
            new Entity\IntegerField('FINAL_PRICE'),
            new Entity\IntegerField('QUANTITY'),
            new Entity\StringField('GOODS_ID'),
        );
    }


}
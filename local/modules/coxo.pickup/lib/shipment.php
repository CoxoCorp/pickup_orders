<?php

namespace Coxo\Pickup;

use Bitrix\Main\Entity,
    Bitrix\Main\ORM\Query\Join,
    Bitrix\Main\ORM\Fields\Relations\OneToMany,
    Bitrix\Main\ORM\Fields\Relations\Reference;

class ShipmentTable extends Entity\DataManager
{
    public static function getSqlQuery()
    {
        return (self::getEntity()->compileDbTableStructureDump());
    }

    public static function getTableName(): string
    {
        return \Bitrix\Main\Config\Option::get("coxo.pickup", 'sql_prefix') . '_shipments';
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
            new Entity\IntegerField('CREATE_TIMESTAMP'),
            new Entity\StringField('ORDER_CODE'),
            new Entity\IntegerField('SHOP_CODE'),
            (new Reference(
                'SHOP',
                ShopTable::class,
                Join::on('this.SHOP_CODE', 'ref.ID')
            ))->configureJoinType('inner'),
            new Entity\EnumField(
                'STATUS',
                array(
                    'values'=>[
                        'NEW', // - новый заказ
                        'MERCHANT_CANCELED', // - отмена Мерчантом
                        'PENDING', // - обработка заказа со стороны Мегамаркета (справочная информация)
                        'PENDING_CONFIRMATION', // - обработка подтверждения со стороны Мегамаркета (справочная информация)
                        'CONFIRMED', // - подтверждено Мерчантом
                        'PENDING_PACKING', // - обработка сообщения о комплектации со стороны Мегамаркета (справочная информация)
                        'PACKED', // - скомплектовано Мерчантом
                        'PENDING_SHIPPING', // - обработка сообщения об отгрузке со стороны Мегамаркета (справочная информация)
                        'SHIPPED', // - отгружено Мерчантом (в схеме Закажи и Забери не используется)
                        'PACKING_EXPIRED', // - просрочка комплетации
                        'SHIPPING_EXPIRED', // - просрочка отгрузки для C&D
                        'DELIVERED', // - исполнение заказа
                        'CUSTOMER_CANCELED', // - отмена покупателем
                    ]
                )
            ),
            new Entity\EnumField(
                'SUB_STATUS',
                array(
                    'values'=>[
                        'LATE_REJECT', // - отменено мерчантом после подтверждения
                        'CONFIRMATION_REJECT', // - отмена на этапе подтверждения
                        'CONFIRMATION_EXPIRED', // - просрочка подтверждения
                        'PACKING_EXPIRED', // - просрочка на этапе комплектации
                    ]
                )
            ),
            new Entity\IntegerField('PRICE'),
            new Entity\IntegerField('FINAL_PRICE'),
            new Entity\BooleanField('ERRORS_REPORTED',array(
                'values' => array('N', 'Y')
            )),
            new Entity\BooleanField('VALIDATE_BY_CODE',array(
                'values' => array('N', 'Y')
            )),
        );
    }
}
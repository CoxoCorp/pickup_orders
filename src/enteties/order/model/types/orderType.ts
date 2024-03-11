import {ItemType} from "src/enteties/item";
import {OverridableStringUnion} from "@mui/types";
import {AlertColor, AlertPropsColorOverrides} from "@mui/material/Alert/Alert";
export type statusVariants =
    'MERCHANT_CANCELED' |
    'NEW' |
    'PENDING' |
    'PENDING_CONFIRMATION' |
    'CONFIRMED' |
    'PENDING_PACKING' |
    'PACKED' |
    'PENDING_SHIPPING' |
    'SHIPPED' |
    'PACKING_EXPIRED' |
    'SHIPPING_EXPIRED' |
    'DELIVERED' |
    'CUSTOMER_CANCELED';

export const statusType: Record<statusVariants, {title: string, class: OverridableStringUnion<AlertColor, AlertPropsColorOverrides>}> = {
    MERCHANT_CANCELED: {title:  "Отмена магазином", class: "error"},
    NEW: {title:  "новый заказ", class: "warning"},
    PENDING: {title:  "Обработка заказа Мегамаркетом", class: "warning"},
    PENDING_CONFIRMATION: {title:  "обработка подтверждения со стороны Мегамаркета", class: "warning"},
    CONFIRMED: {title:  "Подтверждено магазином", class: "warning"},
    PENDING_PACKING: {title:  "Обработка сообщения о комплектации со стороны Мегамаркета", class: "warning"},
    PACKED: {title:  "Готово к выдаче", class: "info"},
    PENDING_SHIPPING: {title:  "Обработка сообщения об отгрузке со стороны Мегамаркета", class: "warning"},
    SHIPPED: {title:  "Отгружено магазином", class: "warning"},
    PACKING_EXPIRED: {title:  "просрочка комплетации", class: "warning"},
    SHIPPING_EXPIRED: {title:  "просрочка отгрузки", class: "warning"},
    DELIVERED: {title:  "Выдан покупателю", class: "success"},
    CUSTOMER_CANCELED: {title:  "Отменён покупателем", class: "error"},
}
export interface CustomerType {
    firstName?: string,
    lastName?: string,
    phone?: number,
    telegramChatId?: number,
}

export interface OrderType {
    shipmentId: number,
    orderCode?: string,
    confirmedTimeLimit?: string, //	Крайняя дата подтверждения мерчантом
    packingTimeLimit?: string,//Крайняя дата комплектации	string
    shippingTimeLimit?: string, //	Крайняя дата доставки	string
    shipmentDateFrom?: string, //	Отгрузка с	string
    shipmentDateTo?: string, //	Отгрузка по	string
    packingDate?: string, //	Дата до которой должна быть произведена комплектация	dateTime/string
    reserveExpirationDate?: string //	Дата истечения срока резерва	dateTime/string
    deliveryId?: number //	Номер доставки	string
    shipmentDateShift?: boolean, //	Изменение даты отгрузки	boolean
    shipmentIsChangeable?: boolean //	Перекомплектация	boolean
    customerFullName?: string //	Имя клиента(вводится на чекауте)	string
    customerAddress?: string //	Адрес торговой точки	string
    shippingPoint?: string //	Идентификатор магазине по системе продавца	string
    creationDate?: string //	Дата создания отправления	string
    deliveryDate?: string //	дата доставки до покупателя	dateTime/string
    deliveryDateFrom?: string // 	Дата и время с которой клиент может выкупить товар	string
    deliveryDateTo?: string //	Дата и время до которой клиент должен выкупить товар	string
    items?: ItemType[],
    status: statusVariants,
    customer?: CustomerType
}
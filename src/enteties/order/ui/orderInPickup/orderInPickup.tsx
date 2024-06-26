import {OrderType, statusType} from "../../index.ts";
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import cls from "./orderInPickup.module.scss";
import {getCustomDate} from "src/shared/lib/getCustomDate.ts";
import {normalNumber} from "src/shared/lib/normalNumber.ts";
import {classNames} from "src/shared/lib/classNames/classNames.ts";

interface orderInPickupProps {
    order: OrderType
}

export const OrderInPickup = (props: orderInPickupProps) => {
    const {order} = props;
    let customerName = order.customerFullName;
    if (!customerName) {
        if (order.customer) {
            if (order.customer?.firstName) customerName = order.customer.firstName + " ";
            if (order.customer?.lastName) customerName = customerName + order.customer.lastName;
        }
    }
    return (

        <Accordion>
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1-content"
                id="panel1-header"
            >
                {
                    order?.type==="coxo"
                    ?
                        <span>
                            Заказ Coxo.ru № {order.shipmentId}
                         </span>
                        :
                        <span>
                            Детали доставки № {order.deliveryId}
                        </span>
                }


            </AccordionSummary>
            <AccordionDetails>
                <table>
                    <tbody>
                    {
                        order?.orderCode &&
                        <tr>
                            <td className="title">
                                Заказ в Сохо:
                            </td>
                            <td className="value">
                                {order.orderCode}
                            </td>
                        </tr>

                    }
                    {
                        order.creationDateString &&
                        <tr>

                            <td className="title">
                                Создан:
                            </td>
                            <td className="value">
                                {order.creationDateString}
                            </td>
                        </tr>
                    }
                    {order.creationDate &&
                        <tr>

                            <td className="title">
                                Создан:
                            </td>
                            <td className="value">
                                {getCustomDate(new Date(order.creationDate))}
                        </td>
                    </tr>
                    }
                    {
                        customerName !== "" &&
                        <tr>
                            <td className="title">
                                Покупатель:
                            </td>
                            <td className="value">
                                {customerName}
                            </td>
                        </tr>

                    }
                    {
                        order?.customer?.phone &&
                        <tr>
                            <td className="title">
                                Телефон:
                            </td>
                            <td className="value">
                                {order?.customer?.phone}
                            </td>
                        </tr>
                    }

                    </tbody>
                </table>
                { (order?.items && order.items.length>0 ) &&
                    <div className={cls.itemsBlock}>
                        <div className={cls.title}>Товары в заказе:</div>
                        {
                            order.items.map((item, index)=>
                            <div className={cls.oneItem} key={index}>
                                <div className={cls.itemValue}>
                                    <div className={cls.itemNumber}>
                                        {index+1}
                                    </div>
                                    <div className={cls.info}>
                                        {
                                            item.goodsData?.name &&
                                            <div className={cls.itemTitle}>
                                                {item.goodsData.name}
                                            </div>
                                        }
                                        {
                                            item.price &&
                                            <div className={cls.oneInfo}>
                                                <div className={cls.field}>
                                                    Базовая цена:
                                                </div>
                                                <div className={classNames(cls.fieldValue)}>
                                                    {normalNumber(item.price)} руб.
                                                </div>
                                            </div>
                                        }
                                        {
                                            item.finalPrice &&
                                            <div className={cls.oneInfo}>
                                                <div className={cls.field}>
                                                    Финальная цена:
                                                </div>
                                                <div className={cls.fieldValue}>
                                                    {normalNumber(item.finalPrice)} руб.
                                                </div>
                                            </div>
                                        }
                                        {
                                            item.quantity &&
                                            <div className={cls.oneInfo}>
                                                <div className={cls.field}>
                                                    Количество:
                                                </div>
                                                <div className={cls.fieldValue}>
                                                    {normalNumber(item.quantity)} шт.
                                                </div>
                                            </div>
                                        }
                                    </div>
                                </div>
                            </div>
                            )
                        }

                    </div>
                }
                {
                    order?.payments && order.payments.length>0 &&
                    <div className={cls.itemsBlock}>
                        <div className={cls.title}>Оплаты в заказе:</div>
                        {
                            order.payments.map((p,index)=>
                                <div className={cls.oneItem} key={index}>
                                    <div className={cls.itemValue}>
                                        <div className={cls.itemNumber}>
                                            {index + 1}
                                        </div>
                                        <div className={cls.info}>
                                            <div className={cls.itemTitle}>
                                                {p.NAME}
                                            </div>
                                            <div className={cls.oneInfo}>
                                                <div className={cls.field}>
                                                    Сумма:
                                                </div>
                                                <div className={cls.fieldValue}>
                                                    {normalNumber(p.SUM)} руб.
                                                </div>
                                            </div>
                                            <div className={cls.oneInfo}>
                                                <div className={cls.field}>
                                                    Статус:
                                                </div>
                                                <div
                                                    className={classNames(cls.fieldValue, {[cls.done]: p.Paid}, [cls.payStatus])}>
                                                    {p.Paid ? "Оплачен" : "Не оплачен"}
                                                </div>
                                            </div>
                                        </div>


                                    </div>
                                </div>
                            )
                        }

                    </div>
                }


            </AccordionDetails>
        </Accordion>

    );
};

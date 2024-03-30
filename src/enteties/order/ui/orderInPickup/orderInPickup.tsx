import {OrderType, statusType} from "../../index.ts";
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import cls from "./orderInPickup.module.scss";
import {getCustomDate} from "src/shared/lib/getCustomDate.ts";
import {normalNumber} from "src/shared/lib/normalNumber.ts";

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

                    Детали доставки № {order.deliveryId}


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
                            <div className={cls.oneItem} key={item.offerId}>
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
                                                <div className={cls.fieldValue}>
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

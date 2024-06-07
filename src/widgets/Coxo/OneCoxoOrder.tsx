import {OrderType} from "src/enteties/order";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import {normalNumber} from "src/shared/lib/normalNumber.ts";
import React, {useState} from "react";
import cls from "./OneCoxoOrder.module.scss";

interface OneCoxoOrderProps {
    setOrderId: (code: string | undefined)=>void,
    o: OrderType
}

export const OneCoxoOrder = (props: OneCoxoOrderProps) => {
    const {setOrderId, o} = props;
    const [openPop, setOpenPop] = useState<boolean>(false);
    const mouseEnter = ()=>{
        setOpenPop(true);
    }
    const mouseLeave = ()=>{
        setTimeout(()=>{
            setOpenPop(false);
        }, 10)
    }
      return (
        <>

            <ListItem
                sx={{cursor: "pointer"}}
                onClick={() => setOrderId(o.orderCode)}
                id={"coxoOrder" + o.orderCode}

            >
                <div style={{
                    position: "absolute",
                    top: "10px",
                    right: "-225px",
                    border: "solid 1px gray",
                    borderRadius: "5px",
                    padding: "10px",
                    display: openPop?"block":"none"
                }}>
                    <div style={{width: "200px"}} className={cls.orderInfo}>
                        <p>
                            Покупатель: {o.customer?.firstName}
                        </p>
                        <p>
                            Телефон: {o.customer?.phone}
                        </p>
                        <p>
                            Товар в заказа
                        </p>
                        <ul>
                            {o.items?.map(i=>
                            <li key={i.goodsData?.name}>
                                {i.goodsData?.name} - {i.quantity} шт.
                            </li>
                            )}
                        </ul>
                    </div>

                </div>
                <ListItemText
                    primary={'Заказ № ' + normalNumber(o.shipmentId)}
                    onMouseEnter={() => mouseEnter()}
                    onMouseLeave={() => mouseLeave()}
                />

            </ListItem>
        </>
      );
};

import Typography from "@mui/material/Typography";
import * as React from "react";
import {OrderType} from "src/enteties/order";
import Box from "@mui/material/Box";
import DoneIcon from "@mui/icons-material/Done";
import Button from "@mui/material/Button";
import {Alert} from "@mui/material";
import {loadData} from "src/shared/lib/loadData.ts";
import {useState} from "react";

interface OrderEndProps {
    order: OrderType,
    endMessage?: string,
    nullOrder: ()=>void,
    checkCode?: string
}

export const OrderEnd = (props: OrderEndProps) => {
    const {order, nullOrder, endMessage, checkCode} = props;
    const [isSmsSend, setIsSmsSend] = useState<boolean>(false);
    const sendSms = async ()=>{
        const params= {
            code: checkCode,
            phone: order.customer?.phone,
            telegramChatId: order.customer?.telegramChatId?order.customer?.telegramChatId:0,
            orderId: order.shipmentId
        }
        const res = await loadData("code/sendSms.php", undefined, "post", params)
        setIsSmsSend(true)
    }
    return (
        <Box
            sx={{
                marginTop: 2,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}
        >
            <Typography component="h1" variant="h5">
                Работа с заказом {order.shipmentId} закончена.
            </Typography>
            {
                endMessage &&
                <Alert severity="success">
                    {endMessage}
                </Alert>
            }{
                checkCode &&
                <>
                    <br/>
                    <Alert severity="success">
                        Сформирован результирующий чек!
                        {
                            order.customer?.email &&
                            <>
                                <br/>
                                Чек был выслать на e-mail: <strong>{order.customer.email}</strong>
                            </>
                        }
                    </Alert>

                    {
                        isSmsSend &&
                        <>
                            <br/>
                                <Alert severity="success">
                                    Сообщение с чеком отправлено
                                    {order.customer?.telegramChatId
                                        ?
                                            <span> в телеграм</span>
                                        :
                                            <span> в СМС сообщении</span>
                                    }
                                </Alert>
                        </>
                    }

                    <Button
                        sx={{marginTop: 3}}
                        variant="outlined"
                        startIcon={<DoneIcon/>}
                        onClick={()=>sendSms()}
                        color="success"
                        disabled={isSmsSend}
                    >
                        Отправить чек по СМС
                    </Button>
                    <br/>
                    <a href={"https://service-2b.ru/c/"+checkCode} target="_blank">
                        Открыть печатную форму чека
                    </a>
                </>
            }

            <Button
                variant="outlined"
                startIcon={<DoneIcon/>}
                onClick={()=>nullOrder()}
                sx={{marginTop: 2}}
            >
                Вернуться
            </Button>

        </Box>
    );
};

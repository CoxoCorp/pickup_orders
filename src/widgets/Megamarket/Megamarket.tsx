import React, {useEffect, useState} from 'react';
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {Alert, CircularProgress} from "@mui/material";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import {loadData} from "src/shared/lib/loadData";
import {OrderType} from "src/enteties/order";
import {ErrorType} from "src/shared/ui/ErrorBlock/ErrorBlock";

interface PropsType {
    setOrder: (order:OrderType | undefined)=>void,
}

interface requestType {
    orderId: string,
    chatId?: number,
    res: {
        error?: {
            code?: string,
            description?: string
            message?: string
        }[],
        success: 0|1,
        data?: {
            shipments?: OrderType[]
        }
    },
}
interface possibleOrdersRequestType {
    orders: OrderType[],
}

export const Megamarket = (props: PropsType) => {
    const {setOrder} = props;
    const [error, setError] = useState<ErrorType | undefined>(undefined);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [orderId, setOrderId] = useState<string | undefined>(undefined);
    const [possibleOrders, setPossibleOrders] = useState<OrderType[] | undefined>(undefined);
    const style = {
        py: 0,
        width: '100%',
        maxWidth: 360,
        borderRadius: 2,
        border: '1px solid',
        borderColor: 'divider',
        backgroundColor: 'background.paper',
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        setIsLoading(true);
        setError(undefined);
        event.preventDefault();
        const data = {
            orderId: orderId
        }
        const res = await loadData<requestType>("data/getOrder.php", undefined, "post", data);
        if (res.status==='error') {
            setError(res?.error)
        }
        if (res.status === 'ok') {
            if (res.data) {
                if (res.data?.res) {
                    if (res.data.res.success===0) {
                        const resErrors=res.data.res?.error;
                        if (resErrors && resErrors.length>0) {
                            const resError=resErrors[0];
                            setError({
                                message: resError?.message?resError.message:"Сервер MegaMarket Вернул ошибку ",
                                code: resError?.code,
                                recommendation: resError?.description
                            })
                        } else {
                            setError({
                                message: 'Сервер MegaMarket Вернул ошибку'
                            })
                        }

                    }
                    if (res.data.res.success===1) {
                        if (res.data?.res?.data?.shipments) {
                            if (res.data.res.data.shipments?.length>0) {
                                const newOrder:OrderType=res.data.res.data.shipments[0];
                                if (res.data.chatId) {
                                    if (newOrder.customer) {
                                        newOrder.customer.telegramChatId=res.data.chatId;
                                    }
                                }
                                setOrder(newOrder)
                            }
                        }
                    }
                }
            }
        }
        setIsLoading(false);
    };
    const loadPossibleOrders = async ()=>{
        const res = await loadData<possibleOrdersRequestType>("/user/loadPossibleOrders.php");
        if (res.status==='ok') {
            if (res.data?.orders) setPossibleOrders(res.data.orders);
        }
    }
    useEffect(() => {
        loadPossibleOrders().then();
    }, []);
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
                Заказы МегаМаркета
            </Typography>
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
                {error &&
                    <Alert severity="error">
                        {error.message}
                        <br/>
                        {!!error.recommendation && error.recommendation}

                    </Alert>
                }

                <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="orderId"
                    label="Номер заказа"
                    name="orderId"
                    autoFocus
                    value={orderId?orderId:""}
                    onChange={(e)=>setOrderId(e.target.value)}

                />
                {
                    isLoading
                        ?
                        <CircularProgress/>
                        :
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Проверить
                        </Button>
                }


            </Box>
            {possibleOrders?
                <>
                    {possibleOrders.length>0 &&
                        <>
                            <Box sx={{mt:2, mb: 2, fontWeight: 700}}>
                                Или выберите из доступных:
                            </Box>
                            <Box sx={{mt:2, mb: 2, fontWeight: 700}}>
                                <List sx={style}>
                                    {
                                        possibleOrders.map(o=>
                                            <ListItem
                                                key={o.shipmentId}
                                                sx={{cursor: "pointer"}}
                                                onClick={()=>setOrderId(o.orderCode)}
                                            >
                                                <ListItemText primary={o.orderCode+" ("+o.shipmentId+")"}  />
                                            </ListItem>
                                        )
                                    }

                                </List>

                            </Box>
                        </>
                    }
                </>
                :
                <CircularProgress/>
            }
        </Box>
    );
};
import * as React from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import {useEffect, useState} from "react";
import {ErrorType} from "src/shared/ui/ErrorBlock/ErrorBlock.tsx";
import {Alert, CircularProgress} from "@mui/material";
import {loadData} from "src/shared/lib/loadData.ts";
import {OrderType} from "src/enteties/order";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';



// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

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
    orders: OrderType[]
}

export function WorkTable(props: {setOrder: (order:OrderType | undefined)=>void, logout: ()=>void}) {
    const {setOrder, logout} = props;
    const [possibleOrders, setPossibleOrders] = useState<OrderType[] | undefined>(undefined);
    const [orderId, setOrderId] = useState<string | undefined>(undefined);
    const [error, setError] = useState<ErrorType | undefined>(undefined);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        setIsLoading(true);
        setError(undefined);
        event.preventDefault();
        const data = {
            orderId: orderId
        }
        const res = await loadData<requestType>("data/getOrder.php", undefined, "post", data);
        if (res.status==='error') {
            if (res.error?.code==='NotAuth') {

            }
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
    const style = {
        py: 0,
        width: '100%',
        maxWidth: 360,
        borderRadius: 2,
        border: '1px solid',
        borderColor: 'divider',
        backgroundColor: 'background.paper',
    };
    const loadPossibleOrders = async ()=>{
        const res = await loadData<possibleOrdersRequestType>("/user/loadPossibleOrders.php");
        if (res.status==='ok') {
            console.log(res.data?.orders);
            if (res.data?.orders) setPossibleOrders(res.data.orders);
        }
    }
    useEffect(() => {
        loadPossibleOrders().then();
    }, []);
    return (
        <ThemeProvider theme={defaultTheme}>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Typography component="h1" variant="h5">
                        Укажите номер доставки
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
            </Container>
        </ThemeProvider>
    );
}
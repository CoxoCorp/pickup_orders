import * as React from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import {useState} from "react";
import {ErrorType} from "src/shared/ui/ErrorBlock/ErrorBlock.tsx";
import {Alert, CircularProgress} from "@mui/material";
import {loadData} from "src/shared/lib/loadData.ts";
import {OrderType} from "src/enteties/order";



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

export function WorkTable(props: {setOrder: (order:OrderType | undefined)=>void}) {
    const {setOrder} = props;
    const [error, setError] = useState<ErrorType | undefined>(undefined);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        setIsLoading(true);
        setError(undefined);
        event.preventDefault();
        const data = new FormData(event.currentTarget);
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
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
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
                </Box>
            </Container>
        </ThemeProvider>
    );
}
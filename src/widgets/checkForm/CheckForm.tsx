
import {OrderInPickup, OrderType, statusType} from "src/enteties/order";
import CssBaseline from "@mui/material/CssBaseline";
import * as React from "react";
import Box from "@mui/material/Box";
import Container from '@mui/material/Container';
import {createTheme, ThemeProvider} from "@mui/material/styles";
import Button from "@mui/material/Button";
import CloseIcon from "@mui/icons-material/Close";
import {Alert} from "@mui/material";
import {MessageBlock} from "src/widgets/MessageBlock/ui/MessageBlock.tsx";

interface CheckFormProps {
    order: OrderType,
    cancelFun: ()=>void,
}

export const CheckForm = (props: CheckFormProps) => {
    const {order, cancelFun} = props;
    const defaultTheme = createTheme();
    return (
        <ThemeProvider theme={defaultTheme}>
            <Container component="main" maxWidth="xl">
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <div>
                        <div className="buttonsBlock">
                            <Button
                                variant="outlined"
                                color="error"
                                startIcon={<CloseIcon/>}
                                onClick={()=>cancelFun()}
                            >
                                Вернуться
                            </Button>
                        </div>
                        <Alert
                            severity={statusType[order.status].class}> Статус: {statusType[order.status].title} ({order.status})
                        </Alert>
                        <OrderInPickup order={order}/>
                        {
                            order.status === 'PACKED'
                                ?
                                <div>
                                    <h2>
                                        Выдача заказа
                                    </h2>
                                    {
                                        order.customer?.phone
                                            ?
                                        <MessageBlock
                                            phone={order.customer.phone}
                                            telegramChatId={order.customer.telegramChatId}
                                            shipmentId={order.shipmentId}
                                            cancelFun={cancelFun}
                                        />
                                            :
                                            <p>
                                                У покупателя не указан номер телефона. Выдача без кода подтверждения.
                                            </p>

                                    }


                                </div>
                                :
                                <div>
                                <h2>
                                        Статус заказа не позволяет проводить с ним дополнительные манипуляции.
                                    </h2>
                                </div>

                        }
                    </div>
                </Box>
            </Container>
        </ThemeProvider>

);
};

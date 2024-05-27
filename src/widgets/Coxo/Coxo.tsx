import React, {useEffect, useState} from 'react';
import {OrderType} from "src/enteties/order";
import {ErrorType} from "src/shared/ui/ErrorBlock/ErrorBlock";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {Alert, CircularProgress} from "@mui/material";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import {loadData} from "src/shared/lib/loadData";
import {workerType} from "src/enteties/worker";
import {normalNumber} from "src/shared/lib/normalNumber";

interface possibleOrdersRequestType {
    orders: OrderType[],
}

interface PropsType {
    setOrder: (order:OrderType | undefined)=>void,
    worker: workerType
}
interface requestType {
    order: OrderType
}

const Coxo = (props: PropsType) => {
    const {setOrder, worker} = props;
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
        const res = await loadData<requestType>("catalog/getCoxoOrder.php", undefined, "post", data, "coxo");
        if (res.status==='error') {
            setError(res?.error)
        }
        if (res.status === 'ok') {
            if (res.data) {
                if (res.data?.order) {
                    setOrder(res.data.order);
                }
            }
        }
        setIsLoading(false);
    };
    const loadPossibleOrders = async ()=>{
        const params= {
            storeId: worker.linkStore?.bitrixId
        }
        const res = await loadData<possibleOrdersRequestType>("/catalog/getCoxoOrders.php", undefined, "post", params, "coxo");
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
                marginLeft: "60px"
            }}
        >
            <Typography component="h1" variant="h5">
                Заказы Coxo.ru
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
                                                <ListItemText primary={'Заказ № '+ normalNumber(o.shipmentId)}  />
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

export default Coxo;
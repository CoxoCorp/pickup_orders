import Box from "@mui/material/Box";
import {OrderType} from "src/enteties/order";
import * as React from "react";
import Typography from "@mui/material/Typography";
import {Alert} from "@mui/material";
import Button from "@mui/material/Button";
import DoneIcon from "@mui/icons-material/Done";
import {CustomModal} from "src/widgets/CustomModal/CustomModal.tsx";
import ClearIcon from '@mui/icons-material/Clear';
import {useContext, useState} from "react";
import {loadData} from "src/shared/lib/loadData.ts";
import {normalNumber} from "src/shared/lib/normalNumber.ts";
import {AlertTitle} from "@mui/lab";
import {OrderEndContext} from "src/app/providers/OrderEndProvider/OrderEndProvider.tsx";

interface CheckDonePageProps {
    order?: OrderType
}
interface requestType {
    checkCode?: string
}
export const CheckDonePage = (props: CheckDonePageProps) => {
    const {order} = props;
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [cancelModalOpen, setCancelModalOpen] = useState<boolean>(false);
    const [doneModalOpen, setDoneModalOpen] = useState<boolean>(false);
    const orderEndData = useContext(OrderEndContext);
    const sendStatus = async (
        status: 'done'|'canceled',
        subCancelStatus: 'CANCEL_BY_CUSTOMER' | 'HANDOVER_IMPOSSIBLE' | undefined = undefined
    )=>{
        setCancelModalOpen(false);
        setIsLoading(true);
        const params = {
            order: order,
            status: status,
            subCancelStatus: subCancelStatus
        }
        const res = await loadData<requestType>("order/sendStatus.php", undefined, "post",params);
        if (res.status==="error") {
            orderEndData.sendEndMessage('Чек еще печатается. Через некоторые время чек будет напечатан и выслан покупателю по емайл или СМС. ')

        } else {
            
            if (res.data?.checkCode) {
                orderEndData.setCheckCode(res.data.checkCode);
            }
        }
        orderEndData.setStatus(true);
        setIsLoading(false);
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
            <CustomModal isOpen={doneModalOpen} closeModal={() => setDoneModalOpen(false)}
                         title="Подтвердите выдачу заказа!">
                <Box sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: "15px"
                }}>
                    {
                        !!((order?.toPay && order.toPay>0) || order?.type==="mega") &&
                        <Alert severity="success" sx={{width: "100%"}}>
                            После нажатия кнопки <strong>подтвердить</strong>, Покупателю будет выслан чек на покупку.
                            {
                                !!(order?.toPay && order.toPay>0) &&
                                <>
                                    <br/> <br/>
                                    Убедитесь также, что Вы приняли оплату от покупателя в
                                    размере <strong>{normalNumber(order.toPay)} руб.</strong>
                                </>
                            }

                        </Alert>
                    }



                    <Button
                        sx={{marginTop: 2}}
                        variant="outlined"
                        startIcon={<DoneIcon/>}
                        onClick={()=>{sendStatus('canceled', "HANDOVER_IMPOSSIBLE")}}
                        color="success"
                    >
                        Подтвердить выдачу заказа
                    </Button>

                    <Button
                        sx={{marginTop: 2}}
                        variant="outlined"
                        startIcon={<ClearIcon/>}
                        onClick={()=>{setDoneModalOpen(false)}}
                    >
                        Отмена
                    </Button>
                </Box>
            </CustomModal>

            <CustomModal isOpen={cancelModalOpen} closeModal={() => setCancelModalOpen(false)}
                         title="Подтвердите отмену заказа!">
                <Box sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: "15px"
                }}>
                    <Button
                        sx={{marginTop: 2}}
                        variant="outlined"
                        startIcon={<ClearIcon/>}
                        onClick={()=>{sendStatus('canceled', "CANCEL_BY_CUSTOMER")}}
                        color="error"
                    >
                        Покупатель сам отказался
                    </Button>
                    <Button
                        sx={{marginTop: 2}}
                        variant="outlined"
                        startIcon={<ClearIcon/>}
                        onClick={()=>{sendStatus('canceled', "HANDOVER_IMPOSSIBLE")}}
                        color="error"
                    >
                        Проблема с товаром
                    </Button>

                    <Button
                        sx={{marginTop: 2}}
                        variant="outlined"
                        startIcon={<ClearIcon/>}
                        onClick={()=>{setCancelModalOpen(false)}}
                    >
                        Не отменять заказ
                    </Button>
                </Box>
            </CustomModal>

            <Typography component="h1" variant="h5">
                Товары можно выдать
            </Typography>
            <Alert severity="success" >
                Код введен верно. Заказ можно выдать покупателю.
            </Alert>
            {(order?.toPay && order.toPay>0)
                ?
                <Alert severity="error" variant="outlined" sx={{marginTop: 2}} >
                    <AlertTitle>Внимание!</AlertTitle>

                    Заказ не оплачен! К оплате <strong>{normalNumber(order.toPay)} руб.</strong>
                    <br/>
                    Сейчас примите оплату от покупателя. (Только безнал)

                </Alert>
                :
                <Alert severity="success" variant="outlined" sx={{marginTop: 2}} >
                    <AlertTitle>Заказ полностью оплачен</AlertTitle>

                </Alert>

            }


            <div style={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", marginTop: "15px"}}>

                <Button
                    variant="outlined"
                    startIcon={<DoneIcon/>}
                    onClick={()=>{setDoneModalOpen(true)}}
                >
                    {order?.toPay?"Оплата принята":"Выдать заказ"}
                </Button>
                <Button
                    sx={{marginTop: 2}}
                    variant="outlined"
                    startIcon={<ClearIcon/>}
                    onClick={()=>{setCancelModalOpen(true)}}
                    color="error"
                >
                    Отмена выдачи
                </Button>
            </div>
        </Box>
    );
};

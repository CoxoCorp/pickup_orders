import {ButtonsType} from "src/widgets/MessageBlock/model/types/buttonsType.ts";
import {OneButton} from "src/widgets/MessageBlock/ui/OneButton/OneButton.tsx";
import {useState} from "react";
import {ConfirmCodeForm} from "src/widgets/ConfirmCodeForm/ConfirmCodeForm.tsx";
import {Alert} from "@mui/material";
import * as React from "react";
import Button from "@mui/material/Button";
import DoneIcon from '@mui/icons-material/Done';


interface MessageBlockProps {
    telegramChatId?: number,
    phone: number,
    shipmentId: number,
    cancelFun: ()=>void,
}

export const MessageBlock = (props: MessageBlockProps) => {
    const {telegramChatId, phone, shipmentId, cancelFun} = props;
    const [isDone, setIsDone] = useState<boolean>(false);
    const [doneMessage, setDoneMessage] = useState<string | undefined>(undefined);
    const buttons: ButtonsType[]=["vk", "voice", "sms"];
    if (telegramChatId) buttons.unshift("telegram");
    if (isDone) {
        return (
            <>
                <Alert severity="success">
                    Код введен верно. Заказ можно выдать.
                </Alert>
                <div style={{display: "flex", justifyContent: "center", marginTop: "15px"}}>
                <Button
                    variant="outlined"
                    startIcon={<DoneIcon/>}
                    onClick={()=>{cancelFun()}}
                >
                    Вернуться на главную
                </Button>
                </div>
            </>
        )
    }
    return (
            <div>
                {
                    doneMessage &&
                    <>
                        <h3>Подтвердить код </h3>
                        <ConfirmCodeForm
                            doneMessage={doneMessage}
                            phone={phone}
                            shipmentId={shipmentId}
                            setCodeDone={()=>setIsDone(true)}

                        />
                    </>
                }
                <h3>Отправить код подтверждения</h3>
                <p style={{textAlign: "center"}}>
                   Именно в этом порядке:
                </p>
                {
                    buttons.map(b=>
                        <OneButton
                            setDoneMessage={setDoneMessage}
                            type={b}
                            key={b}
                            phone={phone}
                            shipmentId={shipmentId}
                            telegramChatId={telegramChatId}/>
                    )
                }

            </div>
    );
};

import {ButtonsType} from "../../model/types/buttonsType.ts";
import cls from "./OneButton.module.scss";
import PhoneAndroidIcon from "@mui/icons-material/PhoneAndroid";

import TelegramIcon from '@mui/icons-material/Telegram';
import ComputerIcon from '@mui/icons-material/Computer';
import SmsIcon from '@mui/icons-material/Sms';
import * as React from "react";
import {useState} from "react";
import LoadingButton from '@mui/lab/LoadingButton';
import Button from "@mui/material/Button";
import {loadData} from "src/shared/lib/loadData.ts";
import {ErrorType} from "src/shared/ui/ErrorBlock/ErrorBlock.tsx";
import {Alert} from "@mui/material";
interface OneButtonProps {
    type: ButtonsType,
    telegramChatId?: number,
    shipmentId: number,
    phone?: number,
    setDoneMessage: (mes: string|undefined)=>void
}

interface requestType {
    message: string
}
export const OneButton = (props: OneButtonProps) => {
    const {type, telegramChatId, phone, shipmentId, setDoneMessage} = props;
    const [isWait, setIsWait] = useState<boolean>(false);
    const [error, setError] = useState<ErrorType | undefined>(undefined);
    const [isCodeSend, setIsCodeSend ] = useState<boolean>(false)
    let buttonTitle: string = "";
    switch (type) {
        case "telegram":
            buttonTitle= "Телеграм";
            break;
        case "vk":
            buttonTitle="Вконтакте"
            break;
        case "sms":
            buttonTitle="SMS"
            break;
        case "voice":
            buttonTitle="Звонок"
            break;
    }
    const clickHandler = async ()=>{
        setIsWait(true);
        const data={
            phone, telegramChatId, type, shipmentId
        }

        const res= await loadData<requestType>("code/sendCode.php", undefined, "post", data);
        if (res.status) {
            if (res.status=='error') {
                setError(res?.error)
            }
            if (res.status=='ok') {
                setDoneMessage(res.data?.message);
                setIsCodeSend(true)
            }
        }

        setIsWait(false);
    }
    if (error) return (
        <Alert severity="error">{error.message}</Alert>
    )
    return (
            <div className={cls.oneButton}>
                {
                    isWait?
                        <LoadingButton
                            loading
                            variant="outlined"
                            loadingPosition="start"
                            startIcon={Icon(type)}
                        >
                            <span>{buttonTitle}</span>
                        </LoadingButton>
                        :
                        <Button
                            variant="outlined"
                            startIcon={Icon(type)}
                            onClick={()=>clickHandler()}
                            disabled={isCodeSend}
                        >
                            {buttonTitle}
                        </Button>

                }


            </div>
    );
};

const Icon = (type: ButtonsType): React.ReactNode=> {
    switch (type) {
        case "telegram":
           return <TelegramIcon/>;
        case "vk":
            return <ComputerIcon/>;
        case "sms":
            return <SmsIcon/>
        case "voice":
            return <PhoneAndroidIcon/>;
    }
}
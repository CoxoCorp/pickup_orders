import cls from "./ErrorBlock.module.scss"
import {useEffect, useState} from "react";
import {classNames} from "src/shared/lib/classNames/classNames";

export interface ErrorType {
    code?: string,
    message: string,
    recommendation?: string,
    appLink?: string,
    ankor?: string,
    errorTitle?: string
}

interface ErrorBlockProps {
    className?: string,
    error: ErrorType
}

export const ErrorBlock = (props: ErrorBlockProps) => {
    const {error} = props;
    const {
        message,
        recommendation="Обратитесь в тех. поддержку.",
        appLink,
        ankor="Перейти",
        errorTitle='Что-то пошло не так!'
    }  = error;
    const [visible, setVisible] = useState(false);
    useEffect(()=>{
        setTimeout(()=>{
            setVisible(true);
        }, 10)


    },[])
    return (
        <div className="content">
            <div className={classNames(cls.ErrorBlock,{[cls.visible]:visible},["form600","center"])}>
                <div className={cls.title}>
                    {errorTitle}
                </div>
                <div className={cls.value}>
                    {message}
                </div>
                {
                    recommendation &&
                    <div className={cls.recommendation}>
                        {recommendation}
                    </div>
                }
                {
                    appLink &&
                    <div className={cls.link}>
                        <a href={appLink}>{ankor}</a>
                    </div>

                }
            </div>
        </div>
    );
};

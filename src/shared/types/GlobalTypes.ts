import {FunctionComponent, SVGAttributes} from "react";
import {ErrorType} from "src/shared/ui/ErrorBlock/ErrorBlock";

export interface LinkType {
    title: string,
    icon?: FunctionComponent<SVGAttributes<SVGElement>>,
    pngIcon?: string,
    color?: string,
    globalLink?: string;
    appLink?: string;
    onClick?: ()=>void
}

export interface resType<T> {
    status: 'error' | 'ok',
    error?: ErrorType;
    method?: string;
    data?: T
}


export enum PaymentTypes {
    'nal'="Картой или наличными при получении",
    'cart'= "Банковской картой на сайте"
}
export enum DeliverTypes {
    'courier'="Курьерская доставка",
    'post'="Доставка Почтой РФ",
    'point'="Доставка на пункт выдачи"

}
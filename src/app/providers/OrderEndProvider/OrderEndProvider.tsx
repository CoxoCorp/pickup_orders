import React, {createContext} from 'react';

interface propsType {
    children: React.ReactNode;
    status: boolean,
    setStatus: (status: boolean)=>void,
    endMessage?: string,
    sendEndMessage: (val: string)=>void,
    checkCode?: string,
    setCheckCode: (val: string)=>void,
}
export interface OrderEndContextType {
    status?: boolean,
    setStatus: (status: boolean)=>void,
    endMessage?: string,
    sendEndMessage: (val: string)=>void,
    checkCode?: string,
    setCheckCode: (val: string)=>void,
}
const init:OrderEndContextType = {
    status: false,
    setStatus: ()=>{},
    sendEndMessage: (val: string)=>{},
    setCheckCode: (val: string)=>{},

}

export const OrderEndContext = createContext<OrderEndContextType>(init)

export const OrderEndProvider = (props: propsType) => {
    const {children, status, setStatus, sendEndMessage, endMessage, checkCode, setCheckCode} = props;
    return (
        <OrderEndContext.Provider value={{status, setStatus, sendEndMessage, endMessage, checkCode, setCheckCode}}>
            {children}
        </OrderEndContext.Provider>
    );
};
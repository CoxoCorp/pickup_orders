import React, {createContext, useState} from 'react';

interface propsType {
    children: React.ReactNode;
    status: boolean,
    setStatus: (status: boolean)=>void
}
export interface CheckDoneContextType {
    status?: boolean,
    setStatus: (status: boolean)=>void
}
const init:CheckDoneContextType = {
    status: false,
    setStatus: ()=>{}
}

export const CheckDoneContext = createContext<CheckDoneContextType>(init)

export const CheckDoneProvider = (props: propsType) => {
    const {children, status, setStatus} = props;
    return (
        <CheckDoneContext.Provider value={{status, setStatus}}>
            {children}
        </CheckDoneContext.Provider>
    );
};
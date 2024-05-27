import React, {createContext, useState} from 'react';

interface propsType {
    children: React.ReactNode;
    status: boolean,
    setStatus: (status: boolean)=>void
}
export interface CheckContextType {
    status?: boolean,
    setStatus: (status: boolean)=>void
}
const init:CheckContextType = {
    status: false,
    setStatus: ()=>{}
}

export const CheckContext = createContext<CheckContextType>(init)

export const CheckDoneProvider = (props: propsType) => {
    const {children, status, setStatus} = props;
    return (
        <CheckContext.Provider value={{status, setStatus}}>
            {children}
        </CheckContext.Provider>
    );
};
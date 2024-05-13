import React, {createContext, useState} from 'react';

interface propsType {
    children: React.ReactNode;
}
interface CheckDoneContextType {
    status?: boolean,
    setStatus: (status: boolean)=>void
}
const init:CheckDoneContextType = {
    status: false,
    setStatus: ()=>{}
}

export const CheckDoneContext = createContext<CheckDoneContextType>(init)

export const CheckDoneProvider = (props: propsType) => {
    const [status, setStatus] = useState<boolean>(false)
    const {children} = props;

    return (
        <CheckDoneContext.Provider value={{status, setStatus}}>
            {children}
        </CheckDoneContext.Provider>
    );
};
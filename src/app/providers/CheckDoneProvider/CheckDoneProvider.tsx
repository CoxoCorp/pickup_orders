import React, {createContext} from 'react';

interface propsType {
    children: React.ReactNode;
}
interface CheckDoneContextType {
    status?: boolean,
    setStatus: (status: boolean)=>void
}
const init:CheckDoneContextType = {
    status: false,
}

export const CheckDoneContext = createContext<CheckDoneContextType>()

export const CheckDoneProvider = (props: propsType) => {
    const {children} = props;

    return (
        <div>

        </div>
    );
};
import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import {OrderType} from "src/enteties/order";
import {workerType} from "src/enteties/worker";
import {Megamarket} from "src/widgets/Megamarket/Megamarket";
import Coxo from "src/widgets/Coxo/Coxo";



// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();



interface PropsType {
    setOrder: (order:OrderType | undefined)=>void,
    logout: ()=>void,
    worker: workerType,
    changeWorkerMode: ()=>void
}

export function WorkTable(props: PropsType ) {
    const {setOrder, worker, changeWorkerMode } = props;
    console.log(worker)
    const mode=worker.mode==="dbs"?"Доставка собственными силам":"Закажи и забери";
    return (
        <ThemeProvider theme={defaultTheme}>
            <Container component="main" maxWidth="xl">
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 2,
                        border: "solid 1px gray",
                        borderRadius: "4px",

                        marginLeft: "auto",
                        marginRight: "auto",
                        padding: "0 16px"
                    }}
                >
                    {
                        !!worker.login &&
                        <p>
                            Вы авторизованы как <strong>{worker.login}</strong>
                        </p>
                    }
                    {
                        !!mode &&
                        <p>
                            Тип работы с МегаМаркетом:
                            <strong style={{color: "teal"}}> {mode}</strong>
                            <span
                                onClick={()=>changeWorkerMode()}
                                style={{
                                    cursor: "pointer",
                                    color: "rgb(21, 101, 192)",
                                    textDecoration: "underline",
                                    marginLeft: "18px"
                                }}
                            >Изменить</span>
                        </p>
                    }
                    {
                        !!worker?.linkStore?.title &&
                        <p>
                            Магазин: <strong>{worker.linkStore.title}</strong>
                        </p>
                    }
                </Box>
                <br/>
                <Box sx={{display: "flex", justifyContent: "center"}}>
                    <Megamarket setOrder={setOrder}/>
                    <Coxo setOrder={setOrder} worker={worker}/>
                </Box>

            </Container>
        </ThemeProvider>
    );
}
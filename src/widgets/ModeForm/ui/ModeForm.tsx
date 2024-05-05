import React, {useState} from 'react';
import {createTheme, ThemeProvider} from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Button from '@mui/material/Button';
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import {Alert} from "@mui/material";
import {ErrorType} from "src/shared/ui/ErrorBlock/ErrorBlock.tsx";
import {loadData} from "src/shared/lib/loadData.ts";
import {ModeType, workerType} from "src/enteties/worker";
import Typography from "@mui/material/Typography"
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
interface requestType {
    mode: ModeType
}
interface propsType {
    setMode: (mode: ModeType)=>void
}
const ModeForm = (props: propsType) => {
    const {setMode} = props;
    const [error, setError] = useState<ErrorType | undefined>(undefined);
    const [currentMode, setCurrentMode] = useState<ModeType | undefined>(undefined);
    const defaultTheme = createTheme();
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        setError(undefined);
        event.preventDefault();
        if (currentMode) {
            const data = {
                mode: currentMode
            };
            const res = await loadData<requestType>("user/setMode.php", setError, "post", data);
            console.log(res)
            if (res.status === 'error') {
                setError(res?.error)
            }
            if (res.status === 'ok') {
                if (res.data?.mode)
                    setMode(res.data.mode);
            }
        }
    }
    return (
        <ThemeProvider theme={defaultTheme}>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Typography component="h1" variant="h5">
                        Вид работы с СберМаркетом.
                    </Typography>
                    <br/>
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{mt: 1}}>
                        {error &&
                            <Alert severity="error">{error.message}</Alert>
                        }
                        <br/>
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">Вид работы</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={currentMode?currentMode:""}
                                label="Вид работы"
                                onChange={(e) => setCurrentMode(e.target.value as ModeType)}
                            >
                                <MenuItem value={undefined}>Выбрать</MenuItem>
                                <MenuItem value={"dbs"}>Доставка собственными силами</MenuItem>
                                <MenuItem value={"coxo"}>Закажи и забери</MenuItem>
                            </Select>
                        </FormControl>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{mt: 3, mb: 2}}
                        >
                            Изменить
                        </Button>

                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
    );
};

export default ModeForm;
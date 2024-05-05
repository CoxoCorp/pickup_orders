import {LinkStoreType, ModeType} from "src/enteties/worker";
import React, {useState} from "react";
import {ErrorType} from "src/shared/ui/ErrorBlock/ErrorBlock.tsx";
import {loadData} from "src/shared/lib/loadData.ts";
import {createTheme, ThemeProvider} from "@mui/material/styles";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {Alert} from "@mui/material";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";

interface StoreFormProps {
    setStore: (store: LinkStoreType| undefined)=>void,
    allStores: LinkStoreType[]
}
interface requestType {
    store: LinkStoreType,
}

const StoreForm = (props: StoreFormProps) => {3
    const {setStore, allStores} = props;
    const [error, setError] = useState<ErrorType | undefined>(undefined);
    const [currentStore, setCurrentStore] = useState<string | undefined>(undefined);
    const defaultTheme = createTheme();
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        setError(undefined);
        event.preventDefault();
        if (currentStore) {
            const data = {
                store: currentStore
            };
            const res = await loadData<requestType>("user/setStore.php", setError, "post", data);
            if (res.status === 'error') {
                setError(res?.error)
            }
            if (res.status === 'ok') {
                if (res.data?.store) {
                    setStore(allStores.find(s => s.id === Number(currentStore)));
                    console.log(res)
                }
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
                        Ваш рабочий пункт выдачи
                    </Typography>
                    <br/>
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{mt: 1}}>
                        {error &&
                            <Alert severity="error">{error.message}</Alert>
                        }
                        <br/>
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">Пункт выдачи</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={currentStore?currentStore:""}
                                label="Пункт выдачи"
                                onChange={(e) => setCurrentStore(e.target.value as ModeType)}
                            >
                                <MenuItem value={undefined}>Выбрать</MenuItem>
                                {
                                    allStores.map(s=>
                                        <MenuItem key={s.id} value={String(s.id)}>{s.title}</MenuItem>
                                    )
                                }
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
export default StoreForm;
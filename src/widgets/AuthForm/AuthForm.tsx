import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import {workerType} from "src/enteties/worker";
import {loadData} from "src/shared/lib/loadData.ts";
import {useState} from "react";
import {ErrorType} from "src/shared/ui/ErrorBlock/ErrorBlock.tsx";
import {Alert} from "@mui/material";



// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();
interface propsType {
    setWorker: (worker: workerType)=>void
}
interface requestType {
    user: workerType
}
export default function AuthForm(props: propsType) {
    const {setWorker} = props;
    const [error, setError] = useState<ErrorType | undefined>(undefined);
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        setError(undefined);
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const res = await loadData<requestType>("user/auth.php", undefined, "post", data);
        if (res.status==='error') {
            setError(res?.error)
        }
        if (res.status === 'ok') {
            if (res?.data) {
                if (res.data?.user)
                    setWorker(res.data.user);
                localStorage.setItem("DevUserId", String(res.data.user.id));
            }
        }
    };

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
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Необходима авторизация
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                        {error &&
                            <Alert severity="error">{error.message}</Alert>
                        }

                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="login"
                            label="login"
                            name="login"
                            autoFocus
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Войти
                        </Button>

                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
    );
}
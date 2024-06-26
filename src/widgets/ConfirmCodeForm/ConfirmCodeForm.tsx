import {Alert} from "@mui/material";
import * as React from "react";
import TextField from "@mui/material/TextField";
import {useContext, useState} from "react";
import {ErrorType} from "src/shared/ui/ErrorBlock/ErrorBlock.tsx";
import {loadData} from "src/shared/lib/loadData.ts";
import Box from '@mui/material/Box';
import Button from "@mui/material/Button";
import {CheckDoneContext} from "src/app/providers/CheckDoneProvider/CheckDoneProvider.tsx";


interface ConfirmCodeFormProps {
    doneMessage: string,
    phone: number,
    shipmentId: number,
}
interface requestType {

}

export const ConfirmCodeForm = (props: ConfirmCodeFormProps) => {
    const {doneMessage, shipmentId, phone} = props;
    const [error, setError] = useState<ErrorType | undefined>(undefined);
    const CheckDone = useContext(CheckDoneContext);
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        setError(undefined);
        event.preventDefault();
        const data = {
            phone: phone,
            shipmentId: shipmentId,
            code: new FormData(event.currentTarget).get("code")
        };
        const res = await loadData<requestType>("code/verifyCode.php", setError, "post", data);
        if (res.status==='ok') {
            CheckDone.setStatus(true);
        }

    };
    return (
            <div>
                <Alert severity="success">
                    {doneMessage}
                </Alert>
                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>

                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="code"
                        label="Проверочный код"
                        name="code"
                        autoFocus
                    />
                    {error &&
                        <Alert severity="error">{error.message}</Alert>
                    }
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Ввести код
                    </Button>
                </Box>
            </div>
    );
};

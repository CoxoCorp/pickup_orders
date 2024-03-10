import {ErrorType} from "src/shared/ui/ErrorBlock/ErrorBlock";
import {resType} from "src/shared/types/GlobalTypes";
import {$apiCoxo} from "src/shared/lib/axios/coxo";
import {AxiosError} from "axios";

type setErrorFuncType = (error: ErrorType | undefined)=>void | undefined;
export async function loadData<T>  (
    url: string,
    setError?: setErrorFuncType,
    method: "get"| "post" = "get",
    params:any|undefined = undefined

) : Promise<resType<T>> {
    try {
        let data: resType<T>;
        if (method === "get") {
            const res = await $apiCoxo.get<resType<T>>(url);
            data = res.data;
        } else {
            const res = await $apiCoxo.post<resType<T>>(url, params);
            data = res.data;
        }
        if (!data) {
            const error:resType<T> = {
                status: "error",
                error: {
                    message: "Сервер вернул пустые данные!"
                }
            }
            if (setError) setError(error.error);
            return error;
        }
        if (data.status==="error") {
            if (setError) setError(data.error)
        }
        return data
    } catch (e: unknown | AxiosError) {

        const error:resType<T> = {
            status: "error",
            error: {
                message: ( e instanceof AxiosError) ? e.message:"Неизвестная ошибка"
            }
        }
        if (setError) setError(error.error);
        return error;
    }
}

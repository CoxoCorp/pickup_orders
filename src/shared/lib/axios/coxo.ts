import axios from "axios";
export const __IS_DEV__ = !import.meta.env.PROD;
const BASE_URL=__IS_DEV__?"https://www.coxo.ru/pickup/api/":"/pickup/api/";
const headers = __IS_DEV__
    ?{
        'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8',
        'Auth': 'DEV'
    }
    :{'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8'}

export const $apiCoxo=axios.create({
    baseURL: BASE_URL,
    headers: headers
})

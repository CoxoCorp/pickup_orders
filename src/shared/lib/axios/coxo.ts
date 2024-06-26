import axios from "axios";
export const __IS_DEV__ = !import.meta.env.PROD;
const BASE_URL=__IS_DEV__?"https://service-2b.ru/pickup/api/":"/pickup/api/";
const DevUserId=localStorage.getItem("DevUserId");
const headers = __IS_DEV__
    ?{
        'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8',
        'Dev-token': DevUserId?DevUserId:"0"
    }
    :{'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8'}

export const $apiService=axios.create({
    baseURL: BASE_URL,
    headers: headers
})

export const $apiCoxo=axios.create({
    baseURL: 'https://www.coxo.ru/Api/',
    headers: headers
})
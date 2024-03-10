export const normalPhone = (phone: string)=> {
    return phone.replace(/^7(\d{3})(\d{3})(\d{2})(\d{2})$/, '+7 ($1) $2-$3-$4');
}
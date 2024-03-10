export const normalNumber = (n: number):string => {
    return new Intl.NumberFormat("ru-RU").format(Number(n.toFixed(2)))
}
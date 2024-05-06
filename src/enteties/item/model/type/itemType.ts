export interface ItemType {
    finalPrice?: number,
    price?: number,
    quantity?: number,
    goodsData?: {
        categoryName?: string,
        isDelivery?: boolean
        isDigitalMarkRequired?: boolean
        name: string
    }
    goodsId: number,
    offerId: string,
}
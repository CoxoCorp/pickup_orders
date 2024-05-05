export type ModeType = "dbs" | "coxo";

export interface workerType {
    id: number,
    firstName: string,
    mode?: ModeType,
    linkStore?: LinkStoreType,
    allShops: LinkStoreType[]
}

export interface LinkStoreType {
    id: number,
    title: string,
    code: string
}
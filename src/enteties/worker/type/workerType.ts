export type ModeType = "dbs" | "coxo";

export interface workerType {
    id: number,
    firstName: string,
    mode?: ModeType,
    login: string,
    linkStore?: LinkStoreType,
    allShops: LinkStoreType[]
}

export interface LinkStoreType {
    bitrixId: number,
    id: number,
    title: string,
    code: string
}
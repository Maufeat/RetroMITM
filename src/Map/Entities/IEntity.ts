export interface IEntity{
    cellId: number
    orientation: number,
    unk1: number,
    id: number,

    parseEntity(): any
    setEntity(infos: string[]): IEntity
}

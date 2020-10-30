import Client from "./Client";

export enum PacketCmd{
    ASK = "ASK"
}

export interface Packet{
    cmd: string
    handler(client: Client, context: string): string
}
import Client from "./Client";

export interface Packet{
    cmd: string
    handler(client: Client, context: string): string
}
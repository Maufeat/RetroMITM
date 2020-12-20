import Client from "../Network/Client";
import { PacketCmd } from "../Utils/Enums";
import { Packet } from "../Network/Packet";

export const GDM: Packet = {

    cmd: PacketCmd.MapData,

    handler(client: Client, context: string): string{
        
        client.map.parseMap(context)

        return this.cmd + context
        
    }
}
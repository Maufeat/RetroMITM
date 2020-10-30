import Client from "../Network/Client";
import { Packet, PacketCmd } from "../Network/Packet";

export const ASK: Packet = {

    cmd: PacketCmd.ASK,

    handler(client: Client, context: string): string{
        console.log("ON ASK: + " + this.cmd + context);
        return this.cmd + context;
    }
}
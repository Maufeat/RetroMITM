import Client from "../Network/Client";
import { PacketCmd } from "../Utils/Enums";
import { Packet } from "../Network/Packet";

export const Template: Packet = {

    cmd: PacketCmd.GameMovement,

    handler(client: Client, context: string): string{
        return this.cmd + context
    }
}
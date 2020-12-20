import Client from "../Network/Client";
import { PacketCmd } from "../Utils/Enums";
import { Packet } from "../Network/Packet";
import Logger from "../Utils/Logger";
import { ASK } from "./ASK";

//[>>]BM*|!x|
export const BM: Packet = {

    cmd: PacketCmd.BasicMessage,

    handler(client: Client, context: string): string{
        let sendingMessage = context.split("|")
        switch(sendingMessage[1]){
            case "!tlogs":                
                Logger.logAllPackets = !Logger.logAllPackets
                client.recv(`cs<font color='#2C49D7'>Log Status changed to: ${Logger.logAllPackets}</font>`)
                return ""
            case "!mapinfo":
                client.recv(`cs<font color='#2C49D7'>Current Map ${client.map.getEntityCound()}</font>`)
                return ""
        }                
        return this.cmd + context
    }
}
import { addSyntheticLeadingComment } from "typescript";
import Client from "../Network/Client";
import { PacketCmd } from "../Utils/Enums";
import { Packet } from "../Network/Packet";
import { ChatChannel } from "../Utils/Enums";
import Utils from "../Utils/Utils";
import Logger from "../Utils/Logger";

export const cMK: Packet = {

    cmd: PacketCmd.ChatMessage,

    handler(client: Client, context: string): string{

        let chatPayload = context.split("|")

        switch(chatPayload[0]){
            case ChatChannel.NORMAL:
                console.log(`[Normal] ${chatPayload[2]}: ${chatPayload[3]}`)
                break;
            case ChatChannel.GROUP:
                console.log(`[Group] ${chatPayload[2]}: ${chatPayload[3]}`)
                break;
            case ChatChannel.TRADE:
                console.log(`[Trade] ${chatPayload[2]}: ${chatPayload[3]}`)
                break;
            case ChatChannel.RECRUTE:
                console.log(`[Recrute] ${chatPayload[2]}: ${chatPayload[3]}`)
                break;
            case ChatChannel.ADMIN:
                console.log(`[Admin] ${chatPayload[2]}: ${chatPayload[3]}`)
                break;
            case ChatChannel.GUILD:
                console.log(`[Guild] ${chatPayload[2]}: ${chatPayload[3]}`)
                break;
            case ChatChannel.ALIGNMENT:
                console.log(`[Alignment] ${chatPayload[2]}: ${chatPayload[3]}`)
                break;
            default:
                console.log(`[Unknown (${chatPayload[0]})] ${chatPayload[2]}: ${chatPayload[3]}`)
                break;
        }

        return this.cmd + chatPayload.join("|");
    }
}
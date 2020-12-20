import Client from "../Network/Client";
import { Packet } from "../Network/Packet";
import { PacketCmd } from "../Utils/Enums";

export const ASK: Packet = {

    cmd: PacketCmd.ASK,

    handler(client: Client, context: string): string{
        let character_infos = context.split("|")

        client.character.id = Number.parseInt(character_infos[1])
        client.character.name = character_infos[2]
        client.character.level = Number.parseInt(character_infos[3])
        client.character.class = Number.parseInt(character_infos[4])
        client.character.gender = Number.parseInt(character_infos[5])
        client.character.gfx = Number.parseInt(character_infos[6])
        client.character.color1 = character_infos[7]
        client.character.color2 = character_infos[8]
        client.character.color3 = character_infos[9]
        client.character.inventory = character_infos[10]

        console.log(`Logged in as: ${client.character.name} [${client.character.id}]`)

        return this.cmd + client.character.toASK()
    }
}
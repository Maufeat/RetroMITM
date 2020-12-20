import Client from "../Network/Client";
import { PacketCmd } from "../Utils/Enums";
import { Packet } from "../Network/Packet";

export const GE: Packet = {

    cmd: PacketCmd.GameEnd,

    handler(client: Client, context: string): string{
        client.fight = null
        client.castedSpell = false
        let monster = client.map.getMonster()
        if(monster){
            console.log("Would attack: " + monster.id + " on cell: " + monster.cellId)
        }
        return this.cmd + context
    }
}
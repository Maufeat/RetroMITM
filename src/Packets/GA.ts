import Client from "../Network/Client";
import { GameAction, PacketCmd } from "../Utils/Enums";
import { Packet } from "../Network/Packet";
import Utils from "../Utils/Utils";

export const GA: Packet = {

    cmd: PacketCmd.GameAction,

    handler(client: Client, context: string): string{
        let data = context.split(";")
        
        if(data[0] == "0" || data[0].startsWith("S") || data[0].startsWith("F"))
            return this.cmd + context
        
        let actionId = Number.parseInt(data[1])
        let entityId = Number.parseInt(data[2])

        switch(actionId){
            case GameAction.MOVEMENT:
                //[<<]GA;1;-2;aesde8
                let destination = client.map.cells[Utils.getCellId(data[3].substr(data[3].length - 2))]

                if(client.fight == null){
                    /*if(entityId == client.character.id && destination.id > 0 && client.character.cellId != destination.id){

                    }*/
                    let entity = client.map.getEntity(entityId)
                    if(entityId != client.character.id && entity != null){
                        console.log(entityId + " moved to " + destination.id)
                        client.map.updateEntity(entity, destination)
                    }
                }
                break;
            case GameAction.START_FIGHT:
                break;
        }
        
        return this.cmd + context
    }
}
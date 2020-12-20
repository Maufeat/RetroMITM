//GTS200011936

import Client from "../Network/Client";
import { PacketCmd } from "../Utils/Enums";
import { Packet } from "../Network/Packet";
import Utils from "../Utils/Utils";

export const GTS: Packet = {

    cmd: PacketCmd.GameTurnStart,

    handler(client: Client, context: string): string{
        if(Number.parseInt(context) == client.character.id && client.map.id == 1869){
            if(!client.castedSpell){
                setTimeout(() => {
                    //Beben
                    client.send("GA300181;" + client.startPosition) 
                    setTimeout(() => {
                        //GiftGP
                        client.send("GA300196;" + client.startPosition)
                        setTimeout(() => {
                            //Baum werden
                            client.send("GA300197;" + client.startPosition);
                            setTimeout(() => {
                                //Runde beenden
                                client.castedSpell = true
                                client.send("Gt");
                            }, Utils.getRandomInt(2000))
                        }, Utils.getRandomInt(2000))
                    }, Utils.getRandomInt(2000))
                }, Utils.getRandomInt(2000))
            } else {
                setTimeout(() => {
                    client.send("Gt");
                }, Utils.getRandomInt(2000));
            }
        }

        return this.cmd + context
    }
}
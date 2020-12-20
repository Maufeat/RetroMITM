import Client from "../Network/Client";
import { PacketCmd } from "../Utils/Enums";
import { Packet } from "../Network/Packet";
import Utils from "../Utils/Utils";
import Fight from "../Map/Fight";

export const GP: Packet = {

    cmd: PacketCmd.GamePlacement,

    handler(client: Client, context: string): string{
        client.fight = new Fight();
        if(client.map.id == 1869){
            if(context.startsWith("b-cicCcKeMeTfefj")){

                console.log("Start on outer ring.");
                client.startPosition = 301;
                
                setTimeout(() => {client.send("Gp301")}, Utils.getRandomInt(500, 1000));
                setTimeout(() => {client.send("GR1")}, Utils.getRandomInt(2000, 1500));

            } else if (context.startsWith("c2c3")) {


                console.log("Start on inner ring.");
                client.startPosition = 196;

                setTimeout(() => {client.send("Gp196")}, Utils.getRandomInt(500, 1000));
                setTimeout(() => {client.send("GR1")}, Utils.getRandomInt(2000, 1500));

            }
        }
        return this.cmd + context
    }
}
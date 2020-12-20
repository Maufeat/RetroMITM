import Client from "../Network/Client";
import { EntityType, PacketCmd } from "../Utils/Enums";
import { Packet } from "../Network/Packet";
import CharacterEntity from "../Map/Entities/CharacterEntity";
import MobEntity from "../Map/Entities/MobEntity";

export const GM: Packet = {

    cmd: PacketCmd.GameMovement,

    handler(client: Client, context: string): string{
        let map_entity = context.split("|")

        if(client.fight == null){
            map_entity.forEach((entity, index) => {
                
                let infos = entity.split(";")
                let prefix = infos[0].substr(0,1);

                switch(prefix){
                    case "+":
                        let type = Number.parseInt(infos[5])

                        switch (type){
                            case EntityType.CREATURE:
                            case EntityType.MOB:
                            case EntityType.MOB_GROUP:
                                let mob: MobEntity = new MobEntity(Number.parseInt(infos[0]))
                                client.map.addEntity(mob)
                                break
                            case EntityType.NPC:
                                break
                            case EntityType.MERCHANT:
                                break
                            case EntityType.PERZ:
                                break
                            default:
                                let character: CharacterEntity = new CharacterEntity().setEntity(infos);
                                if(character.id == client.character.id){
                                    client.character.setEntity(infos)
                                    client.character.aura = 2
                                    client.character.name = "[Admin]"
                                    client.character.setItems(0, 9181, 8876, 7911, 10076)
                                    infos = client.character.parseEntity()
                                }
                                client.map.addEntity(character)
                                infos[0] = "+" + infos[0]
                                break;
                        }
                        break;
                    case "-":
                        let entityId = Number.parseInt(infos[0].substr(1))
                        client.map.removeEntity(entityId)
                        break;
                    default:
                        break;
                }
                map_entity[index] = infos.join(";");
            })
        }
        
        return this.cmd + map_entity.join("|")
    }
}
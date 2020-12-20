import Utils from "../../Utils/Utils";
import { IEntity } from "./IEntity";

export default class CharacterEntity implements IEntity{

    cellId: number = 0
    orientation: number = 0
    unk1: number = 0
    id: number = 0
    name: string = "None"
    level: number = 0
    class: number = 1
    title: number = 0
    gfx: number = 0
    size: number = 100
    gender: number = 0
    alignment: number = 0
    alignmentUnk: number = 0
    showWings: number = 0
    alignmentLevel: number = 0
    color1: string = "-1"
    color2: string = "-1"
    color3: string = "-1"
    items: string[] = ["", "", "", "", ""]
    inventory: string = ""
    aura: number = 0
    emote: number | null = null
    emoteTimer: number | null = null
    guildName: string | null = null
    guildEmblem: string | null = null
    speed: number = 0
    mountColor: string | null = null
    unk2: string | null = null
   
    constructor(){
        
    }

    setEntity(entityInfos: string[]): CharacterEntity{
        this.cellId = Number.parseInt(entityInfos[0])
        this.orientation = Number.parseInt(entityInfos[1])
        this.unk1 = Number.parseInt(entityInfos[2])
        this.id = Number.parseInt(entityInfos[3])
        this.name = entityInfos[4]
        let classAndTitle = entityInfos[5].split(",")
        this.class =  Number.parseInt(classAndTitle[0])
        if(classAndTitle.length > 1)
            this.title =  Number.parseInt(classAndTitle[1])
        else
            this.title = 0

        let gfxAndSize = entityInfos[6].split("^")
        this.gfx = Number.parseInt(gfxAndSize[0])
        this.size = Number.parseInt(gfxAndSize[1])
        this.gender = Number.parseInt(entityInfos[7])

        let alignmentInfos = entityInfos[8].split(",")
        this.alignment = Number.parseInt(alignmentInfos[0])
        this.alignmentUnk = Number.parseInt(alignmentInfos[1])
        this.showWings = Number.parseInt(alignmentInfos[2]),
        this.alignmentLevel = Number.parseInt(alignmentInfos[3])

        this.color1 = entityInfos[9]
        this.color2 = entityInfos[10]
        this.color3 = entityInfos[11]
        this.items = entityInfos[12].split(",")
        this.aura = Number.parseInt(entityInfos[13])
        this.emote = (entityInfos[14] == "") ? null : Number.parseInt(entityInfos[14])
        this.emoteTimer = (entityInfos[15] == "") ? null : Number.parseInt(entityInfos[15])
        this.guildName = (entityInfos[16] == "") ? null : entityInfos[16]
        this.guildEmblem = (entityInfos[17] == "") ? null : entityInfos[17]
        this.speed = Number.parseInt(entityInfos[18])
        this.mountColor = (entityInfos[19] == "") ? null : entityInfos[19]
        this.unk2 = (entityInfos[20] == "") ? null : entityInfos[20]

        return this;
    }

    setItems(weaponId: number, hatId: number, capeId: number, petId: number, shieldId: number){
        this.items[0] = (weaponId > 0) ? Utils.decimalToHex(weaponId) : ""
        this.items[1] = (hatId > 0) ? Utils.decimalToHex(hatId) : ""
        this.items[2] = (capeId > 0) ? Utils.decimalToHex(capeId) : ""
        this.items[3] = (petId > 0) ? Utils.decimalToHex(petId) : ""
        this.items[4] = (shieldId > 0) ? Utils.decimalToHex(shieldId) : ""
    }

    toASK(): string{
        return `|${this.id}|${this.name}|${this.level}|${this.class}|${this.gender}|${this.gfx}|${this.color1}|${this.color2}|${this.color3}|${this.inventory}`
    }

    parseEntity(): string[]{
        let entityString: string[] = []
        entityString.push(this.cellId.toString())
        entityString.push(this.orientation.toString())
        entityString.push(this.unk1.toString())
        entityString.push(this.id.toString())
        entityString.push(this.name)
        let classAndTitle = (this.title>0) ? `${this.class},${this.title}` : `${this.class}` 
        entityString.push(classAndTitle)
        entityString.push(`${this.gfx}^${this.size}`)
        entityString.push(this.gender.toString())
        let alignment = `${this.alignment},${this.alignmentUnk},${this.showWings},${this.alignmentLevel}`
        entityString.push(alignment)
        entityString.push(this.color1)
        entityString.push(this.color2)
        entityString.push(this.color3)
        entityString.push(this.items.join(","))
        entityString.push(this.aura.toString())
        entityString.push((this.emote) ? this.emote.toString() : "")
        entityString.push((this.emoteTimer) ? this.emoteTimer.toString() : "")
        entityString.push((this.guildName) ? this.guildName.toString() : "")
        entityString.push((this.guildEmblem) ? this.guildEmblem.toString() : "")
        entityString.push(this.speed.toString())
        entityString.push((this.mountColor) ? this.mountColor.toString() : "")
        entityString.push((this.unk2) ? this.unk2.toString() : "")

        console.log(entityString.join(";"))

        return entityString
    }

}
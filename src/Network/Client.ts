import Net from 'net'
import CharacterEntity from '../Map/Entities/CharacterEntity'
import Map from '../Map/Map'
import { ASK } from '../Packets/ASK'
import { BM } from '../Packets/BM'
import { cMK } from '../Packets/cMK'
import { GM } from '../Packets/GM'
import { GDM } from '../Packets/GDM'
import { GP } from '../Packets/GP'
import { GTS } from '../Packets/GTS'
import { GE } from '../Packets/GE'
import { PacketCmd } from "../Utils/Enums";
import Logger from '../Utils/Logger'
import Utils from '../Utils/Utils'
import { Packet } from './Packet'
import PacketHandler from './PacketHandler'
import Fight from '../Map/Fight'
import { GA } from '../Packets/GA'

export default class Client{

    dofusClient: Net.Socket
    ankamaServer: Net.Socket

    map: Map = new Map()
    fight: Fight | null = null

    character: CharacterEntity = new CharacterEntity()

    buffer = ""
    packetHandler: PacketHandler = new PacketHandler()

    castedSpell: boolean = false
    startPosition: number = 301;

    constructor(_client: Net.Socket){

        this.dofusClient = _client

        this.ankamaServer = new Net.Socket()
        
        this.dofusClient.on('data', (data: Buffer) =>{
            if(data.toString().startsWith("CONNECT")){
                var packet = data.toString().split(" ")[1].split(":")
                console.log(`Connecting to: ${packet[0]}:${packet[1]}`)
                this.ankamaServer.connect(Number.parseInt(packet[1]), packet[0])
                this.recv("HTTP/1.0 200 OK")
                this.ankamaServer.on('data', (data: Buffer) => {
                    this.recv(data)
                });
            } else {
                if( Logger.logAllPackets )
                    console.log("[>>]" + data.toString())
                let _handled = this.handlePackets(data.toString())
                if(_handled !== ""){
                    this.send(_handled)
                } 
            }
        })

        this.packetHandler.addPacket(ASK);
        this.packetHandler.addPacket(cMK);
        this.packetHandler.addPacket(GM);
        this.packetHandler.addPacket(BM);
        this.packetHandler.addPacket(GDM);
        this.packetHandler.addPacket(GTS);
        this.packetHandler.addPacket(GP);
        this.packetHandler.addPacket(GE);
        this.packetHandler.addPacket(GA);
    }

    send(data: Buffer | string){
        if(data instanceof Buffer){
            this.ankamaServer.write(data)
        } else {
            // every outgoing file has 0x0a 0x00 as the last two bytes	
            if(data.substr(data.length-2) == "\x0a\x00"){
                this.ankamaServer.write(data);
            } else {
                this.ankamaServer.write(data + "\x0a")
            }
        }
    }

    recv(data: Buffer | string){
        var packets = data.toString().split('\x00');
        var newPacket: string = ""
        packets.forEach((packet, index) => {
            if(packet != ""){
                if( Logger.logAllPackets )
                    console.log("[<<]" + packet.toString())

                if(packet.length >= 1384 && !packet.startsWith("al")){
                    console.log("EXTENDING PACKET")
                    this.buffer += packet;
                } else {
                    if(this.buffer != ""){
                        this.buffer += packet;
                        newPacket += this.handlePackets(this.buffer)
                        this.buffer = ""
                    } else {
                        packets[index] = this.handlePackets(packet.toString())
                    }
                }
            }
        })
        this.dofusClient.write(packets.join('\x00'));
    }

    handlePackets(_packet: string): string{
        let packet: Packet | null = this.packetHandler.getPacket(_packet);
        if(packet)
            _packet = packet.handler(this, _packet.substr(packet.cmd.length));
        return _packet;
    }

}
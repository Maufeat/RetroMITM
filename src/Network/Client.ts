import Net from 'net'
import Character from '../Models/Character'
import { ASK } from '../Packets/ASK'
import { Packet, PacketCmd } from './Packet'
import PacketHandler from './PacketHandler'

export default class Client{

    dofusClient: Net.Socket
    ankamaServer: Net.Socket

    character: Character = new Character();

    packetHandler: PacketHandler = new PacketHandler();

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
                //console.log("[>>]" + data.toString())
                this.send(data)
            }
        })

        this.packetHandler.addPacket(ASK);
    }

    send(data: Buffer | string){
        if(data instanceof Buffer){
            this.ankamaServer.write(data)
        } else {
            // every outgoing file has 0x0a 0x00 as the last two bytes		
            if(data.charAt(data.length - 1) != "\n")
            {
                data = data + "\n";
            }
            this.ankamaServer.write(data)
        }
    }

    recv(data: Buffer | string){
        var packets = data.toString().split('\x00');
        var newPacket = "";
        packets.forEach((packet) => {
            if(packet != ""){
                //console.log("[<<]" + packet.toString())
                newPacket = newPacket + this.handlePackets(packet.toString())
            }
            newPacket += '\x00'
        })
        this.dofusClient.write(newPacket);
    }

    handlePackets(_packet: string): string{
        let packet: Packet | null = this.packetHandler.getPacket(_packet);
        if(packet){
            //console.log("FOUND");
            _packet = packet.handler(this, _packet.substr(packet.cmd.length));
        } else {
            //console.log("NOT FOUND");
        }
        return _packet;
    }

}
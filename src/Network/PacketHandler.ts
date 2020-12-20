import Client from "./Client";
import { Packet } from "./Packet";

export default class PacketHandler{

    packets: Packet[] = []

    addPacket(packet: Packet){
        this.packets.push(packet)
    }

    getPacket(_packet: string): Packet | null{
        let packet: Packet | null = null;
        this.packets.forEach((_p) => {
            if(_p.cmd === _packet.substr(0,3))
                packet = _p;
            if(_p.cmd === _packet.substr(0,2))
                packet = _p;
            if(_p.cmd === _packet.substr(0,1))
                packet = _p;
        })
        return packet;
    }
}
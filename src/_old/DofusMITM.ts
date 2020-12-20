import Net from 'net';
import Account from './Account';
import Utils from './Utils';

export default class DofusMITM {

    gameServer: Net.Server;

    toServer: Net.Socket = new Net.Socket();

    account: Account;

    constructor(){
        this.gameServer = Net.createServer();
        this.account = new Account();
    }

    setupGameServer(){
        this.gameServer.on("connection", (client: Net.Socket) => {
            
            this.toServer.destroy();
            this.toServer.removeAllListeners();

            client.on('data', (data: Buffer) =>{
                console.log(data.toString());
                if(data.toString().startsWith("CONNECT")){
                    var packet = data.toString().split(" ")[1].split(":");
                    console.log(`ip: ${packet[0]} port: ${packet[1]}`)
                    this.toServer.destroy();
                    this.toServer.connect(Number.parseInt(packet[1]), packet[0]);
                    client.write("HTTP/1.0 200 OK");
                } else {
                    this.toServer.write(data);
                }
            })

            this.toServer.on('data', (data: Buffer) => {
                console.log("DATA: " + data.toString());
                client.write(data);
            });

        });
    }
    
    start(){
        this.setupGameServer();
        this.gameServer.listen(6555, "127.0.0.1");
    }
}
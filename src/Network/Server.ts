import Net from 'net'
import Client from './Client'

export default class Server{

    server: Net.Server

    constructor(){
        this.server = new Net.Server()
        this.server.on("connection", (socket: Net.Socket) => {
            new Client(socket)
        })
    }

    start(ip: string = "127.0.0.1", port: number = 6555){
        this.server.listen(port, ip)
    }
}
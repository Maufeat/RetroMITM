import Server from "./Network/Server"
import Logger from "./Utils/Logger"

console.log("Dofus Retro MITM Bot")
console.log("=================================")
let logger = new Logger()
let proxyServer = new Server().start()
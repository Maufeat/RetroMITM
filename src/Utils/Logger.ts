import fs from 'fs'
import util from 'util'

export default class Logger {

    file: fs.WriteStream

    static logAllPackets = true;

    constructor(){

        let date = new Date();
        let toFilename = date.getFullYear().toString() + (date.getMonth()+1).toString().padStart(2,"0") + (date.getDay()+1).toString().padStart(2,"0") + date.getHours() + date.getMinutes() + date.getSeconds()
        this.file = fs.createWriteStream(`${__dirname}/../../logs/${ toFilename }.txt`, {flags : 'w'})
        
        console.log = (d: any) => {
            let date = new Date()
            let logTime = `${date.getFullYear().toString().padStart(4,"0")}.${(date.getMonth()+1).toString().padStart(2,"0")}.${(date.getDay()+1).toString().padStart(2,"0")} ${date.getHours().toString().padStart(2,"0")}:${date.getMinutes().toString().padStart(2,"0")}:${date.getSeconds().toString().padStart(2,"0")}:${date.getMilliseconds().toString().padStart(2,"0")}`
            this.file.write(`[${logTime}] ${util.format(d)} \n`)
            process.stdout.write(util.format(d) + '\n')
        };
    }

}
import fs from 'fs'
import util from 'util'

export default class Logger {

    file: fs.WriteStream

    constructor(){

        let date = new Date();
        let toFilename = date.getFullYear().toString() + date.getMonth() + date.getDay() + date.getHours() + date.getMinutes() + date.getSeconds()
        this.file = fs.createWriteStream(`${__dirname}/../../logs/${ toFilename }.txt`, {flags : 'w'})
        
        console.log = (d: any) => {
            let date = new Date()
            let logTime = `${date.getFullYear().toString().padStart(4,"0")}.${date.getMonth().toString().padStart(2,"0")}.${date.getDay().toString().padStart(2,"0")} ${date.getHours().toString().padStart(2,"0")}:${date.getMinutes().toString().padStart(2,"0")}:${date.getSeconds().toString().padStart(2,"0")}:${date.getMilliseconds().toString().padStart(2,"0")}`
            this.file.write(`[${logTime}] ${util.format(d)} \n`)
            process.stdout.write(util.format(d) + '\n')
        };
    }

}
export default class UtilsX{

    static ZKARRAY = new Array("a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z","A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z","0","1","2","3","4","5","6","7","8","9","-","_");

    static decryptAXK(packet: string): string[]{
        var var8 = packet.substr(3,11);
        var var9 = packet.substr(11,14);
        var var7 = packet.substr(14);
        var var10 = new Array();
        var var11 = 0;
        while(var11 < 8)
        {
            var var12 = var8.charCodeAt(var11) - 48;
            var var13 = var8.charCodeAt(var11 + 1) - 48;
            var10.push((var12 & 15) << 4 | var13 & 15);
            var11 = var11 + 2;
        }
        var var5 = var10.join(".");
        return [var5, var7];
    }

    static getRandomInt(max: number, min: number = 500) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }


    static getCellChar(cellID: number): string {
        return Utils.ZKARRAY[cellID / 64] + "" + Utils.ZKARRAY[cellID % 64];
    }

}
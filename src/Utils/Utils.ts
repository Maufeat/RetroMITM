export default class Utils{

    static ZKARRAY = new Array("a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z","A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z","0","1","2","3","4","5","6","7","8","9","-","_");

    static decimalToHex(d: number): string {
        var hex = Number(d).toString(16);
        hex = "000000".substr(0, 6 - hex.length) + hex;
        return hex;
    }

    static getHash(ch: string): number
    {
        for (let i = 0; i < Utils.ZKARRAY.length; i++)
            if (Utils.ZKARRAY[i] == ch)
                return i;
        return 0;
    }

    static getRandomInt(max: number, min: number = 500) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    static getCellId(hash: string): number{
        
        let code1: number = 0
        let code2: number = 0
        
        Utils.ZKARRAY.forEach((char, index) => {
            if(char == hash.charAt(0))
                code1 = (index * 64)
            
            if(char == hash.charAt(1))
                code2 = index
        })

        return (code1 + code2)

    }

}
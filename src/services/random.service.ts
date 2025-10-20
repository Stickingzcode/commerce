class Random {
    constructor() {

    }

    public randomCode(size: number) {

        let random: Array<string> = [];
        let i = -1;
        const pool = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyz';

        while(++i < size) {
            random.push(
                pool.charAt(Math.floor(Math.random() * pool.length))
            )
        }

        return random.join('')
    }

    public randomAlpha(size: number) {

        let random: Array<string> = [];
        let i = -1;
        const pool = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
        
        while(++i < size){
            random.push(
                pool.charAt(Math.floor(Math.random() * pool.length))
            )
        }

        return random.join('')
    }

    public randomNum(size: number) {
        
        let random: Array<string> = [];
        let i = -1;
        const pool = '0123456789';
        
        while(++i < size){
            random.push(
                pool.charAt(Math.floor(Math.random() * pool.length))
            )
        }

        return random.join('')
    }
}

export default new Random();
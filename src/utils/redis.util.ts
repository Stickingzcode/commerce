import { RedisClientType, createClient } from "redis"
import colors from 'colors'

interface IData{
    key: string,
    value: any,
    exp: number
}

class RedisWrapper {

    public client: RedisClientType | null = null;
    private HOST: string;
    private PORT: string;
    private USER: string;
    private PASSWORD: string;

    constructor() {

        if (!process.env.REDIS_HOST) {
            throw new Error('Redis host is not defined')
        } else if (!process.env.REDIS_PORT) {
            throw new Error('Redis port is not defined')
        } else if (!process.env.REDIS_USER) {
            throw new Error('Redis username is not defined')
        } else if (!process.env.REDIS_PASSWORD) {
            throw new Error('Redis password is not defined')
        }

        this.HOST = process.env.REDIS_HOST;
        this.PORT = process.env.REDIS_PORT;
        this.USER = process.env.REDIS_USER;
        this.PASSWORD = process.env.REDIS_PASSWORD;

    }

    /**
     * @name connect
     */
    public async connect() {

        // create client
        this.client = createClient({
            username: this.USER,
            password: this.PASSWORD,
            socket: {
                host: this.HOST,
                port: parseInt(this.PORT)
            }
        });

        this.client.on('error', (err) => {
            console.log(colors.red(`REDIS Error: ${err}`))
        });

        await this.client.connect();
        console.log(colors.yellow.inverse(`Connected to REDIS`))

    }

    /**
     * @name keep
     * @param data 
     */
    public async keep(data: IData) {

        const { key, value, exp } = data;

        if(this.client){

            const parsed = JSON.stringify(value);

            await this.client.set(key, parsed, {
                expiration: {
                    type: 'EX',
                    value: exp
                },
                condition: 'NX'
            });
        }

    }

    /**
     * @name fetch
     * @param key
     * @returns 
     */
    public async fetch(key: string) {

        let result: any = null;

        if(this.client){
            const data = await this.client.get(key);
            if(data){
                result = JSON.parse(data)
            }
        }

        return result;

    }

    /**
     * @name delete
     * @param key 
     */
    public async delete(key: string) {
        if(this.client){
            await this.client.del(key)
        }
    }

}

export default new RedisWrapper()
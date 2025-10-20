import { RedisClientType } from "redis";
import { createClient } from "redis";
import colors from "colors";

interface IData {
    key: string;
    value: any;
    exp: number;
}

class RedisWrapper {
    public client: RedisClientType | null = null;
    private HOST: string;
    private PORT: string;
    private PASSWORD: string;
    private USER: string;

    constructor() {
        if(!process.env.REDIS_HOST){
            throw new Error('REDIS_HOST must be defined');
        } else if(!process.env.REDIS_PORT) {
            throw new Error('REDIS_PORT must be defined');
        } else if(!process.env.REDIS_USER) {
            throw new Error('REDIS_USER must be defined');
        } else if(!process.env.REDIS_PASSWORD) {
            throw new Error('REDIS_PASSWORD must be defined');
        }

        this.HOST = process.env.REDIS_HOST;
        this.PORT = process.env.REDIS_PORT;
        this.PASSWORD = process.env.REDIS_PASSWORD;
        this.USER = process.env.REDIS_USER;
    }

    public async connect() {
        this.client = createClient({
            username: this.USER,
            password: this.PASSWORD,
            socket: {
                host: this.HOST,
                port: parseInt(this.PORT)
            }
        })

        this.client.on('error', (err) => {
            console.log(colors.red(`Redis Error: ${err}`))
        });

        await this.client.connect();
        console.log(colors.green.inverse('Connected to Redis successfully...'))
    }

    public async keep(data: IData) {
        const { key, value, exp } = data;
        if(this.client) {
            const parsed = JSON.stringify(value);

            this.client.set(key, parsed, {
                expiration: {
                    type: 'EX',
                    value: exp
                },
                condition: 'NX'
            });
        }
    }

    public async fetch(key: string) {
        let result: any = null;
        if(this.client) {
            const data = await this.client.get(key);
            if(data) {
                result = JSON.parse(data);
            }
        }

        return result;
    }

    public async delete(key: string) {
        if(this.client) {
            await this.client.del(key);
        }
    }
    
}

export default new RedisWrapper();
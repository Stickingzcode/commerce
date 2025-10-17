import crypto from "crypto";

class SystemService {
    constructor() {

    }

    public async hashToken(token: string): Promise<string> {
        const hash = crypto
            .createHash('sha256')
            .update(token)
            .digest('hex');

            return hash;
    }

    public enumToArray(d: object, op: 'keys-only' | 'values-only' | 'key-values') {
        let result: Array<string | [string, any]> = []

        if(op === 'keys-only') {
            result = Object.keys(d);
        }

        if(op === 'values-only') {
            result = Object.values(d);
        }

        if(op === 'key-values') {
            result = Object.entries(d);
        }

        return result;
    }
}

export default new SystemService();
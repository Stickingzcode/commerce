import crypto from 'crypto'

class SystemService {

    constructor() { }

    /**
     * @name hashToken
     * @param token 
     * @returns 
     */
    public async hashToken(token: string): Promise<string> {

        const hash = crypto
            .createHash('sha256')
            .update(token)
            .digest('hex');

        return hash
    }

}

export default new SystemService();
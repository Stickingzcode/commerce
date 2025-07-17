import sendgrid from '@sendgrid/mail'
import { INodemailer, ISGOptions } from './interfaces.util';

class Sendgrid implements INodemailer{

    constructor() {}

    /**
     * @name send
     * @param data 
     * @param callback 
     */
    public async send(data: ISGOptions, callback: CallableFunction){
        sendgrid.setApiKey(data.apiKey);
        sendgrid.send({
            to: data.to,
            from: data.from,
            subject: data.subject,
            text: data.text,
            html: data.html,
            replyTo: data.replyTo
        })
        .then((resp) => {
            callback(resp)
        })
        .catch((err) => {
            callback(err)
        });
    }

}

export default new Sendgrid();
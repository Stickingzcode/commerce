import AxiosService from "../services/axios.service";

interface IMailOptions {
    fromEmail: string,
    fromName: string,
    subject: string,
    text: any,
    html: any,
    to: Array<{ email: string, name: string }>,
    replyTo?: Array<{ email: string, name: string }>,
    cc?: Array<{ email: string, name: string }>,
    attachments?: Array<{
        content: string,
        mime: string,
        name: string
    }>
}

class ZeptoTransport {
    constructor() { }

    public async send(data: IMailOptions, callback: CallableFunction): Promise<void> {

        let replies: Array<{ email_address: { address: string, name: string } }> = [];
        let copies: Array<{ email_address: { address: string, name: string } }> = [];
        let attach: Array<{ content: string, mime_type: string, name: string }> = [];

        const { fromEmail, fromName, html, subject, text, to, attachments, cc, replyTo } = data;

        if (to.length > 0) {

            // grab addresses to send emails to
            const toList = to.map((x) => {
                return {
                    "email_address": {
                        "address": x.email,
                        "name": x.name
                    }
                }
            })

            // grab addresses to send replies to
            if (replyTo && replyTo.length > 0) {
                replies = replyTo.map((x) => {
                    return {
                        "email_address": {
                            "address": x.email,
                            "name": x.name
                        }
                    }
                })
            }

            // grab addresses to send cpoies to
            if (cc && cc.length > 0) {
                copies = cc.map((x) => {
                    return {
                        "email_address": {
                            "address": x.email,
                            "name": x.name
                        }
                    }
                })
            }

            if (attachments && attachments.length > 0) {
                attach = attachments.map((x) => {
                    return {
                        "content": x.content,
                        "mime_type": x.mime,
                        "name": x.name
                    }
                })
            }

            const response = await AxiosService.call({
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    "Content-Type": 'application/json',
                    Authorization: process.env.ZEPTO_TOKEN,
                },
                path: `${process.env.ZEPTO_API_URL}/v1.1/email`,
                body: {
                    "from": { "address": fromEmail, "name": fromName },
                    "to": toList,
                    "reply_to": replies,
                    "subject": subject,
                    "textbody": text,
                    "htmlbody": html,
                    "attachments": attach
                }
            })

            callback(response)

        }

    }
}

export default new ZeptoTransport()
import { SendEmailDTO, SendWithSendgridDTO } from "../dtos/email.dto";
import { renderFile } from 'ejs'
import appRootPath from 'app-root-path'
import sendgrid from '../utils/sendgrid.util'

class EmailService {

    constructor() { }

    /**
     * @name sendWithSendgrid
     * @description Sends email with sendgrid transporter and ejs/hbs
     * @param data 
     */
    private async sendWithSendgrid(data: SendWithSendgridDTO): Promise<void> {

        const sourceUrl = `${appRootPath.path}/src`;

        if (data.engine === 'ejs') {

            renderFile(
                `${sourceUrl}/views/ejs/${data.template}.ejs`,
                {
                    email: data.email,
                    emailTitle: data.emailTitle,
                    preheaderText: data.preheaderText,
                    emailSalute: data.emailSalute,
                    bodyOne: data.bodyOne,
                    bodyTwo: data.bodyTwo,
                    bodyThree: data.bodyThree,
                    code: data.code,
                    buttonText: data.buttonText,
                    buttonUrl: data.buttonUrl
                },

                {},

                async (error, html) => {

                    try {

                        const mailData: any = {
                            apiKey: process.env.SENDGRID_API_KEY || '',
                            to: data.email,
                            from: `${data.fromName ? data.fromName : process.env.EMAIL_FROM_NAME} <${process.env.EMAIL_FROM_EMAIL}>`,
                            subject: data.emailTitle,
                            text: 'email',
                            html: html,
                        };

                        if (data.replyTo) {
                            mailData.replyTo = data.replyTo;
                        }

                        sendgrid.send(mailData, (resp: any) => {
                            console.log('SENDGRID',resp)
                        });

                    } catch (err) {
                        console.log('SENDGRID-ERROR', err)
                    }

                }
            )

        }

        if (data.engine === 'hbs') {

        }


    }

    /**
     * @name sendTokenVerifyEmail
     * @param data 
     */
    public async sendTokenVerifyEmail(data: SendEmailDTO): Promise<void> {

        const { driver, email, title, replyTo, options } = data;

        let template = data.template ? data.template : 'verify_token';
        let fromName = data.fromName ? data.fromName : process.env.EMAIL_FROM_NAME || 'Commerce';
        let preheader = data.preheader ? data.preheader : title;
        let salute = options && options.salute ? options.salute : 'Champ'
        let bText = options && options.buttonText ? options.buttonText : 'Verify'
        let bUrl = options && options.buttonUrl ? options.buttonUrl : ''

        if(driver === 'sengrid'){

            await this.sendWithSendgrid({
                engine: 'ejs',
                email: email,
                fromEmail: process.env.EMAIL_FROM_EMAIL || '',
                fromName: fromName,
                preheaderText: preheader,
                emailSalute: salute,
                emailTitle: title,
                template: template,
                buttonText: bText,
                buttonUrl: bUrl
            })

        }

        if(driver === 'aws'){
            /// call AWS function
        }

    }

}

export default new EmailService()
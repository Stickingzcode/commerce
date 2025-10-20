import appRootPath from "app-root-path";
import { SendEmailDTO, SendWithSendgridDTO, SendWithZeptoDTO } from "../dtos/email.dto";
import { renderFile } from "ejs";
import zeptoUtils from "../utils/zepto.utils";
import mail from "@sendgrid/mail";
import { IResult } from "../utils/interfaces.utils";
import sendgirdUtils from "../utils/sendgird.utils";

class EmailService {
    constructor() {

    }

    private async sendWithSendgrid(data: SendWithSendgridDTO): Promise<void> {
        const sourceUrl = `${appRootPath.path}/src`;

        if(data.engine === 'ejs') {
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
                        if(data.replyTo) {
                            mailData.replyTo = data.replyTo;
                        }
                        sendgirdUtils.send(mailData, (resp: any) => {
                            console.log('SENDGRID', resp);
                        })
                    } catch (error) {
                        console.log('SENDGRID ERROR', error);
                    }
                }
            )
        }
        if(data.engine === 'hbs') {

        }
    }

    private async sendWithZepto(data: SendWithZeptoDTO): Promise<void> {
        const sourceUrl = `${appRootPath.path}/src`;

        if(data.engine === 'ejs') {
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
                    buttonUrl: data.buttonUrl,
                },
                {},
                async (error, html) => {
                    try {
                        const mailData: any = {
                            to: [{ email: data.email, name: ''}],
                            fromEmail: process.env.ZEPTO_FROM_EMAIL || '',
                            fromName: `${data.fromName ? data.fromName : process.env.EMAIL_FROM_NAME}`,
                            subject: data.emailTitle,
                            text: 'email',
                            html: html,
                            replyTo: data.replyTo ? [{ email: data.replyTo, name: '' }] : [],
                        }
                        zeptoUtils.send(mailData, (resp: IResult) => {
                            console.log('ZEPTO-RESPONSE', resp);
                        })
                    } catch (error) {
                        console.log('ZEPTO-ERROR', error);
                    }
                }
            )
        }
        if(data.engine === 'hbs') {

        }
    }

    public async sendTokenVerifyEmail(data: SendEmailDTO): Promise<void> {
        const { driver, email, title, replyTo, options } = data;

        let template = data.template ? data.template : 'verify-token';
        let fromName = data.fromName ? data.fromName : process.env.EMAIL_FROM_NAME || 'Commerce';
        let preheader = data.preheader ? data.preheader : title;
        let salute = options && options.salute ? options.salute : 'Champion';
        let bText = options && options.buttonText ? options.buttonText : 'Verify';
        let bUrl = options && options.buttonUrl ? options.buttonUrl : '';

        if(driver === 'sendgrid') {
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
                buttonUrl: bUrl,
            });
        }

        if(driver === 'zepto') {
            await this.sendWithZepto({
                engine: 'ejs',
                email: email,
                fromEmail: process.env.EMAIL_FROM_EMAIL || '',
                fromName: fromName,
                preheaderText: preheader,
                emailSalute: salute,
                emailTitle: title,
                template: template,
                buttonText: bText,
                buttonUrl: bUrl,
            });
        }

        if(driver === 'aws') {

        }
    }

    public async sendOTPVerifyEmail(data: SendEmailDTO): Promise<void> {
        const { driver, email, title, options } = data;

        let template = data.template ? data.template : 'verify-token';
        let fromName = data.fromName ? data.fromName : process.env.EMAIL_FROM_NAME || 'Commerce';
        let preheader = data.preheader ? data.preheader : title;
        let salute = options && options.salute ? options.salute : 'Champ';
        let code = options && options.code ? options.code : '000000';

        if(driver === 'sendgrid') {
            await this.sendWithSendgrid({
                engine: 'ejs',
                email: email,
                fromEmail: process.env.EMAIL_FROM_EMAIL || '',
                fromName: fromName,
                preheaderText: preheader,
                emailSalute: salute,
                emailTitle: title,
                template: template,
                code: code,
            });
        }
        if(driver === 'zepto') {
            await this.sendWithZepto({
                engine: 'ejs',
                email: email,
                fromEmail: process.env.EMAIL_FROM_EMAIL || '',
                preheaderText: preheader,
                emailSalute: salute,
                emailTitle: title,
                template: template,
                code: code,
            });
        }
        if(driver === 'aws') {
    
        }
    }
}

export default new EmailService();
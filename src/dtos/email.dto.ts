import { EmailDriver } from "../utils/types.utils";

export interface SendWithSendgridDTO {
    engine: 'ejs' | 'hbs',
    email: string,
    fromEmail: string,
    fromName?: string,
    emailTitle: string,
    template: string,
    preheaderText: string,
    emailSalute: string,
    bodyOne?: string,
    bodyTwo?: string,
    bodyThree?: string,
    code?: string,
    buttonText?: string,
    buttonUrl?: string,
    replyTo?: string
}

export interface SendWithZeptoDTO {
    engine: 'ejs' | 'hbs',
    email: string,
    fromEmail: string,
    fromName?: string,
    emailTitle: string,
    template: string,
    preheaderText: string,
    emailSalute: string,
    bodyOne?: string,
    bodyTwo?: string,
    bodyThree?: string,
    code?: string,
    buttonText?: string,
    buttonUrl?: string,
    replyTo?: string
}

export interface SendEmailDTO {
    email: string,
    title: string,
    fromName?: string,
    preheader?: string,
    replyTo?: string,
    driver: EmailDriver,
    template?: string,
    options?: {
        code?: string,
        salute?: string,
        bodyOne?: string,
        bodyTwo?: string,
        bodyThree?: string,
        buttonUrl?: string,
        buttonText?: string,
    }
}



import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer'
import * as crypto from 'crypto';

@Injectable()
export class NodemailerService {
    createTransport() {
        return nodemailer.createTransport({
            host:'smtp.mailtrap.io',
            port: 587,
            auth: {
                user: '69ae53cebd229e',
                pass: '6902ec65208b9a'
            },
            connectionTimeout: 5000,
        })
    }

    async sendChangepasswordCode(body: {email: string, resetCode: string}){
        const obtions = {
            to: body.email,
            from: 'mahmoud.gmail.com',
            subject:'Reset code',
            text: `forgot your password ? send a patch request with you new password 
            to http://localhost:3000/auth/resetPassword/${body.resetCode}.
            if you didnt forget your password please ignore this mail`
        }
        return await this.send(obtions)
    }
    async send(obtions: {from: string, to: string, subject: string, text: string}){
        try{
            await this.createTransport().sendMail(obtions);
            console.log(`email sent to ${obtions.to}`)
        }catch(err){
            console.log(err)
            throw(err)
        }
    }

    generateResetCode() {
        return crypto.randomBytes(32).toString('hex');
    }
}

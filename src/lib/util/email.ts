import nodemailer, { TransportOptions } from 'nodemailer';

const SMTP_HOST = process.env.SMTP_HOST!
const SMTP_PORT = process.env.SMTP_PORT!
const SMTP_USERNAME = process.env.SMTP_USERNAME!
const SMTP_PASSWORD = process.env.SMTP_PASSWORD!
const SMTP_FROM = process.env.SMTP_FROM!
const options = {
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: false,
    auth: {
        user: SMTP_USERNAME,
        pass: SMTP_PASSWORD,
    },
} as TransportOptions

export async function sendEmail(address: string, subject: string, content: string) {
    if (process.env.NODE_ENV !== 'production') {
        console.log("Skipping email send in non-production environment...")
        console.log(`Address: ${address}`)
        console.log(`Subject: ${subject}`)
        console.log(`Content: ${content}`)
        return true
    }
    console.log(`Sending email with content: ${content}`);


    let transporter = nodemailer.createTransport(options);

    let mailOptions = {
        from: SMTP_FROM,
        to: address,
        subject: subject,
        text: content,
        html: `<b>${content}</b>`,
    };

    try {
        const info: any = await transporter.sendMail(mailOptions);
        console.log('Message sent: %s', info.messageId);
        return true;
    } catch (error) {
        console.error('Error sending email:', error);
        return false
    }

}

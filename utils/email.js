import nodemailer from 'nodemailer'
import 'dotenv/config'
import { otp } from '../Models/otp.model.js';

const genOTP = () => {
    return Math.floor(1000 + Math.random() * 9000);
};

export const sendReply = async (data) => {
    try {
        const transport = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            service: "gmail",
            secure: true,
            auth: {
                user: process.env.EMAIL_SENDER,
                pass: process.env.EMAIL_SENDER_PASSWORD,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_SENDER,
            to: data.email,
            subject: "Complaint Reply - Lost & Found - CURAJ",
            html: `<div class="">
            <div class="box">
                <div>
                    <h1 style="font-weight: bold;">Hey ! ${data.username}</h1>
                </div>
                <div>
                    <p style="text-indent:5px">
                    ${data.reply}
                    </p>
                </div>
            </div>
            <div>
            </br>
                <div>
                    <p>
                        <span> 
                            From : </span>
                        <span >
                            ${data.sender}
                        </span>
                    </p>
                </div>
            </div>
            <hr />
            <div>
                <div>
                    <h1 style="font-weight: 600; font-size: large;">${data.title}</h1>
                </div>
                <div>
                    <p style="text-indent: 5px;">${data.description}</p>
                </div>
            </div>
        </div>`
        };

        const email = await transport.sendMail(mailOptions);

        if (!email) {
            return { status: false, error: email, msg: 'Reply not send' };
        }

        return { status: true, error: null, msg: "Mail Sended !!" }
    } catch (error) {
        return { status: false, error: error, msg: null }
    }
}

export const sendMail = async (tagertEmail) => {
    const OneTimePassword = genOTP();


    try {
        const transport = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            service: "gmail",
            secure: true,
            auth: {
                user: process.env.EMAIL_SENDER,
                pass: process.env.EMAIL_SENDER_PASSWORD,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_SENDER,
            to: tagertEmail,
            subject: "Lost & Found - CURAJ || One Time Password",
            html: `<Html>
                        <Text>Welcome <strong> ${tagertEmail}</strong>,</Text><br/>
                        <Text>Your OTP is: <b> ${OneTimePassword}</b></Text><br/>
                        <Text>Please use this OTP to proceed with your action.</Text><br/>
                        <Text>Thank you!</Text>
                    </Html>`,
        };

        const email = await transport.sendMail(mailOptions);
        if (!email) {
            return { status: false, error: email, msg: 'Invalid Email ID' };
        }
        const del = await otp.deleteOne({ email: tagertEmail });
        const OTPdoc = new otp({
            email: tagertEmail,
            OTP: OneTimePassword,
        });
        await OTPdoc.save();

        return { status: true, error: null, msg: "OPT Sended!!" }
    } catch (error) {
        return { status: false, error: error, msg: null }
    }
};
const nodemailer = require('nodemailer');
require('dotenv').config();
async function sendEmail(receiver, content) {
    try {
        const transporter = nodemailer.createTransport({
            service: 'qq',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAIL_PASSWORD
            }
        });

        // 邮件选项
        const mailOptions = {
            from: process.env.EMAIL,
            to: receiver,
            subject: '托米AI',
            text: content
        };

        // 发送邮件
        const info = await transporter.sendMail(mailOptions);
        console.log('邮件发送成功:', info.messageId);
        return info;
    } catch (error) {
        console.error('邮件发送失败:', error);
        throw error;
    }
}
console.log(process.env.EMAIL_PASSWORD, 123)
sendEmail('1059154378@qq.com', '123213123')
exports.sendEmail = sendEmail;
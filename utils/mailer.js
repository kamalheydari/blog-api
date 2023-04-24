const nodeMailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');

const transporterDetails = smtpTransport({
    host: 'smtp.iran.liara.ir',
    port: 587,
    tls: true,
    auth: {
        user: 'foremail',
        pass: '7d8805b7-f1a3-4a00-8309-ed1134a8741a'
    }
});

exports.sendEmail = (email, fullname, subject, message) => {
    const transporter = nodeMailer.createTransport(transporterDetails);

    transporter.sendMail({
        from: 'email@heydari-dev.ir',
        to: email,
        subject,
        html: `<h1> سلام ${fullname}</h1>
        <p>${message}</p>`
    });
};
const nodemailer = require("nodemailer")


// async..await is not allowed in global scope, must use a wrapper
async function main(email, code) {
    // Generate test SMTP service account from ethereal.email
    // Only needed if you don't have a real mail account for testing
    // let testAccount = await nodemailer.createTestAccount();

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        //   host: "smtp.qq.email",
        //   port: 587,
        service: 'qq',
        secure: true, // true for 465, false for other ports
        auth: {
            user: '2083411614@qq.com', // generated ethereal user
            pass: 'ewmfbjqugtaccagh', // generated ethereal password
        },
    });

    // send mail with defined transport object
    // let info = await transporter.sendMail({
    //   from: '"Fred Foo 👻" <foo@example.com>', // sender address
    //   to: "bar@example.com, baz@example.com", // list of receivers
    //   subject: "Hello ✔", // Subject line
    //   text: "Hello world?", // plain text body
    //   html: "<b>Hello world?</b>", // html body
    // })

    let info = await transporter.sendMail({
        from: '"周少的辣鸡网盘" <2083411614@qq.com>', // sender address
        to: email, // list of receivers
        subject: "骚年！你的验证码", // Subject line
        //text: "Hello world?", // plain text body
        html: `
            <div style="text-align: center;">
                <p>你的验证码是：</p>
                <h2>${code}</h2>
            </div>
        `, // html body
    })

    return info
}

module.exports = main
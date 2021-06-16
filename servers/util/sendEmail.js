const nodemailer = require("nodemailer")





// async..await is not allowed in global scope, must use a wrapper
async function main(email, code) {
    // Generate test SMTP service account from ethereal.email
    // Only needed if you don't have a real mail account for testing
    // let testAccount = await nodemailer.createTestAccount();
    const html = `<h1>药药药，切克闹</h1>
    <h3>骚年！你的验证码是：<span style="color: red;font-weight:600;">${code}</span>。有效期三分钟，给老子记住了</h3>
    
    <h1>周少的垃圾网盘</h1>
    <ul>
      <li>
        <p>有文件上传功能，单次文件上传总大小不可以超过<span style="color: red;font-weight:600;">2G</span>。（超过了就干死你）</p>
        <img src="/doc/1.jpg" alt="">
      </li>
      <li>
        <p>文件下载功能，无论下载单个文件还是下载多个文件，返回的都是一个gzip的压缩包，请自备解压工具（不会解压的快滚）</p>
        <img src="/doc/2.jpg" alt="">
      </li>
      <li>
        <p>不可以把A文件夹的文件复制、移动到A文件夹中。听懂老子意思了没得，就是不可以把当前的文件移动复制到当前文件！！！</p>
        <img src="/doc/3.jpg" alt="">
      </li>
      <li>
        <p>这条暂时没想到要说啥，本项目有很多界面没有写，并不是我不会写，是因为我<span style="color: red;font-weight:600;">懒得写</span>！，如果你觉得界面不好看，请不要质疑我的能力
          因为老子没得<span style="color: red;font-weight:600;">ui设计师</span>，没得素材，素材都是网上找的！！！！另外，下载速度慢，或者上传速度慢，请理解一下，毕竟服务器是我一个人掏腰包买的，如果你想资助我也行。
        </p>
        <img src="/doc/4.jpg" alt="">
      </li>
    </ul>
    
    <div>
      <p>这里放一个操作使用图片，请自觉认真观看<span style="color: red;font-weight:600;">一个小时</span>以上</p>
      <img src="/doc/use.png" alt="">
    </div>`

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
        html: html, // html body
    })

    return info
}




module.exports = main
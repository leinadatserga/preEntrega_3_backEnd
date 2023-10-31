import config from "../config.js"
import express from 'express'
import nodemailer from 'nodemailer'
import { __dirname } from "./path.js"

const app = express()

let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: 'leinadatserga2@gmail.com',
        pass: config.emailPassword,
        authMethod: 'LOGIN'
    }
})

app.get('/mail', async (req, res) => {
    const resultado = await transporter.sendMail({
        from: 'TEST Daniel Agresta leinadatserga2@gmail.com',
        to: 'leinadatserga@gmail.com',
        subject: 'Saludo de buenos dias',
        html:
            `
            <div>
                <h1> Hola,buenos dias profe! </h1>
                <h2> Para poner en el hornito nuevo! </h2>
            </div>
        `,
        attachments: [{
            filename: "Pizza.jpg",
            path: __dirname + "/public/images/Pizza.jpg",
            cid: "pizzita"
        }
        ]
    })
    console.log(resultado)
    res.send('Mail enviado')
})
app.listen(4000, () => {
    console.log("Server on port 4000")
})
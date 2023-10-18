import nodemailer from 'nodemailer'

type dataType = {
    subject?: string
    name?: string,
    email: string,
    message?: string,
    fileName?: string,
    fileURL?: string

}
export async function POST(request: Request) {
    const data: dataType = await request.json()

    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: process.env.USERMAIL,
            pass: process.env.PASSMAIL,
        },
    })

    try {
        await transporter.sendMail({
            from: process.env.USERMAIL,
            to: process.env.USERMAIL,
            replyTo: data.email,
            subject: data.subject || `E-mail de contato: ${data.email}`,
            html: `${data.message}`,
            attachments: [
                {
                    filename: data.fileName,
                    path: data.fileURL
                }
            ]
        })

        return new Response(JSON.stringify({ message: "success" }))
    } catch (error) {
        console.error("Error sending email: ", error)
        return new Response(JSON.stringify({ message: "error" }))
    }
}
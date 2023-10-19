import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

type dataType = {
    subject?: string
    email?: string,
    message?: string
    carbonCopy?: boolean
}
export async function POST(request: NextRequest) {
    const formData = await request.formData()

    let file: File | null = null
    let buffer: Buffer | null = null

    if (!formData.has("json") && !formData.has("file")) {
        return NextResponse.json({
            success: false,
        })
    } else if (formData.has("file")) {
        file = formData.get("file") as unknown as File

        const allowedExtensions = [".doc", ".docx", ".pdf"];

        if (file.name.length > 0) {
            const fileExtension = file.name.split('.').pop();

            if (!allowedExtensions.includes(`.${fileExtension}`)) {
                console.error("Escolha um arquivo do tipo .pdf, .doc ou .docx")
                return NextResponse.json({
                    success: false,
                })
            }

            if (file.size > 25 * 1024 * 1024) {
                console.error("O arquivo deve ter no máximo 25MB")
                return NextResponse.json({
                    success: false,
                })
            }
        }
    }

    const { subject, email, message, carbonCopy }: dataType = JSON.parse(formData.get("json") as string)

    if (file) {
        const bytes = await file.arrayBuffer()
        buffer = Buffer.from(bytes)
    }

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
            cc: carbonCopy ? email : '',
            replyTo: email,
            subject: subject || `E-mail de contato: ${email}`,
            html: message,
            attachments: file ? [
                {
                    filename: file.name,
                    content: buffer as Buffer,
                }
            ] : [],
        })

        return new Response(JSON.stringify({ success: true }))
    } catch (error) {
        console.error("Error sending email: ", error)
        return new Response(JSON.stringify({ success: false }))
    }
}
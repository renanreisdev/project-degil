export const sendEmail = async (email: string, subject: string, message: string, name: string = '', fileName?: string, fileURL?: string) => {
    try {
        const require = await fetch("/api/send-email", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                subject,
                name,
                email,
                message,
                fileName,
                fileURL
            })
        })

        const response = await require.json()

        if (response.message === "success") {
            return { status: true, message: "E-mail enviado com sucesso!" }
        } else {
            return { status: false, message: "Falha ao enviar o e-mail!" }
        }

    } catch (error: any) {
        return { status: false, message: "Falha ao enviar o e-mail!" }
    }
}
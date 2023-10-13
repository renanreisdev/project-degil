export const sendEmail = async (email: string, subject: string, message: string, name: string = '') => {
    try {
        const require = await fetch("/api/sendEmail", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                subject,
                name,
                email,
                message
            })
        })

        const response = await require.json()

        if (response.message === "success") {
            return { status: true, message: "E-mail enviado com sucesso!" }
        } else {
            return { status: false, message: "Falha ao enviar o e-mail!" }
        }

    } catch (error: any) {
        console.error(error.message)
        return { status: false, message: "Falha ao enviar o e-mail!" }
    }
}
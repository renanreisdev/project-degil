export const sendEmail = async (subject: string, message: string, email?: string, carbonCopy?: boolean, file?: File | null) => {
    try {
        const formData = new FormData();

        if (file !== undefined && file !== null)
            formData.append('file', file as File, file?.name)

        formData.append('json', JSON.stringify({
            subject,
            message,
            email,
            carbonCopy
        }))

        const require = await fetch("/api/send-email", {
            method: "POST",
            body: formData,
        })

        const response = await require.json()
        return response

    } catch (error: any) {
        return { success: false }
    }
}
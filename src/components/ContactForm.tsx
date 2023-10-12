import { AiOutlineWhatsApp } from "react-icons/ai"
import Link from "next/link"
import { config } from "../../config.local"
import { useForm } from "react-hook-form"
import { AiOutlineLoading } from "react-icons/ai"
import { useState } from "react"

type contactFormType = {
    email: string,
    message: string
}

export const ContactForm = () => {
    const { register, handleSubmit, setValue, formState: { errors }, } = useForm<contactFormType>()
    const [sendingEmailState, setSendingEmailState] = useState(false)
    const [emailSentState, setEmailSentState] = useState(false)
    const [emailResponseState, setEmailResponseState] = useState('')

    const onSubmit = async (data: contactFormType) => {
        try {
            setSendingEmailState(true)
            const require = await fetch("/api/sendEmail", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    subject: `Contato - ${data.email}`,
                    email: data.email,
                    message: data.message
                })
            })

            const response = await require.json()

            if (response.message === "success") {
                setValue("email", "")
                setValue("message", "")
                setEmailResponseState("E-mail enviado com sucesso!")

                setSendingEmailState(false)
                setEmailSentState(true)

                setTimeout(() => {
                    setEmailSentState(false)
                    setEmailResponseState("")
                }, 2000)
            } else {
                setSendingEmailState(false)
                setEmailSentState(false)
            }

        } catch (error: any) {
            console.error(error.message)
            setSendingEmailState(false)
            setEmailSentState(false)
            setEmailResponseState("Falha ao enviar o e-mail!")
        }
    }

    return (
        <div id="form" className="w-full flex flex-col items-center mt-10">
            <Link
                href={`http://wa.me/55${config.PHONE}`}
                target="_blank"
                className="px-4 py-4 flex justify-center items-center gap-2 bg-secondary text-center text-sm font-bold text-white rounded transition-all duration-300 hover:bg-hover"
            >
                <AiOutlineWhatsApp size={24} />(51)99264-6568
            </Link>

            <div className="relative w-full max-w-lg flex flex-col gap-10 p-5 mt-10 rounded bg-slate-50 shadow-md">
                {emailSentState && (
                    <div className="z-10 fixed bottom-5 right-5 bg-primary text-white p-4 rounded shadow-sm transition-all duration-1000 ease-in-out">{emailResponseState}</div>
                )}
                <div className="relative flex flex-1 mt-5">
                    <input
                        disabled={sendingEmailState}
                        type="text"
                        placeholder="engenharia.degil@gmail.com"
                        className={`peer flex-1 rounded border p-1 bg-transparent transition-all duration-200 ease-linear ${errors?.email ? 'border-red-500 outline-red-500' : 'border-slate-400 outline-[#ed631d]'}`}
                        {...register("email", { required: true })}
                    />

                    <label className={`absolute left-2 -top-5 mb-0 origin-[0_0] truncate text-sm leading-[1.6] px-1 text-neutral-500`}>Deixe o seu melhor e-mail*</label>


                    {errors?.email?.type === "required" && (
                        <p className="absolute -bottom-4 text-xs text-red-500 font-medium">E-mail é obrigatório</p>
                    )}
                </div>

                <div className="relative flex flex-1">
                    <textarea
                        disabled={sendingEmailState}
                        placeholder="Compartilhe suas dúvidas"
                        className={`peer flex-1 min-h-[100px] rounded border p-1 bg-transparent transition-all duration-200 ease-linear border-slate-400 outline-[#ed631d]`}
                        {...register("message", { required: false })}
                    />

                    <label className={`absolute left-2 -top-5 mb-0 origin-[0_0] truncate text-sm leading-[1.6] px-1 text-neutral-500`}>Compartilhe suas dúvidas</label>

                </div>

                {!sendingEmailState && (
                    <button
                        onClick={() => handleSubmit(onSubmit)()}
                        className="self-center w-1/2 mt-4 p-2 text-white bg-[#ed631d] rounded-lg hover:bg-hover transition-all duration-300"
                    >
                        Enviar
                    </button>
                )}

                {sendingEmailState && (
                    <button
                        className="self-center flex justify-center items-center gap-3 w-1/2 mt-4 p-2 text-white bg-primary rounded-lg transition-all duration-300"
                    >
                        <AiOutlineLoading size={24} className="animate-spin" /> Enviando...
                    </button>
                )}
            </div>
        </div>
    )
}
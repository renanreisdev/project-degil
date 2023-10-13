import { AiOutlineWhatsApp } from "react-icons/ai"
import { config } from "../../config.local"
import { useForm } from "react-hook-form"
import { AiOutlineLoading } from "react-icons/ai"
import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Input } from "@/components/Input"
import { TextAreaComponent } from "./TextAreaComponent"
import { ButtonComponent } from "./ButtonComponent"
import { NotificationsComponent } from "./NotificationsComponent"
import { LinkComponent } from "./LinkComponent"
import { sendEmail } from "@/utils/sendEmail"

const schema = z.object({
    email: z.string()
        .email({ message: "O e-mail deve ser válido" }),
    message: z.string()
})

export type DataProps = z.infer<typeof schema>

export const ContactForm = () => {
    const { register, handleSubmit, setValue, formState: { errors }, } = useForm<DataProps>({
        mode: "onBlur",
        resolver: zodResolver(schema)
    })
    const [isSendingEmail, setIsSendingEmail] = useState(false)
    const [hasEmailBeenSent, setHasEmailBeenSent] = useState(false)
    const [emailResponse, setEmailResponse] = useState('')

    const onSubmit = async (data: DataProps) => {

        setIsSendingEmail(true)
        const subject = `Contato - ${data.email}`

        const response = await sendEmail(subject, data.email, data.message)

        if (response.status) {
            setValue("email", "")
            setValue("message", "")

            setIsSendingEmail(false)
            setHasEmailBeenSent(true)

            setTimeout(() => {
                setHasEmailBeenSent(false)
            }, 4000)
        } else {
            setIsSendingEmail(false)
            setHasEmailBeenSent(false)
        }
        setEmailResponse(response.message)
    }

    return (
        <div id="form" className="w-full flex flex-col items-center mt-10">
            <LinkComponent href={`http://wa.me/55${config.PHONE}`} target="_blank" model="outline">
                <AiOutlineWhatsApp size={24} />(51)99264-6568
            </LinkComponent>

            <div className="relative w-full max-w-lg flex flex-col gap-10 p-5 mt-10 rounded bg-slate-50 shadow-md">
                {hasEmailBeenSent && (
                    <NotificationsComponent size="md" position="bottom-right">{emailResponse}</NotificationsComponent>
                )}

                <Input
                    disabled={isSendingEmail}
                    type="email"
                    label="Deixe o seu melhor e-mail*"
                    placeholder="engenharia.degil@gmail.com"
                    helperText={errors?.email?.message}
                    {...register("email")}
                />

                <TextAreaComponent
                    disabled={isSendingEmail}
                    label="Compartilhe suas dúvidas"
                    placeholder="Compartilhe suas dúvidas"
                    classNameTextArea="min-h-[100px]"
                    {...register("message")}
                />

                {!isSendingEmail && (
                    <ButtonComponent
                        className="m-auto"
                        onClick={() => handleSubmit(onSubmit)()}
                    />
                )}

                {isSendingEmail && (
                    <NotificationsComponent className="m-auto">
                        <AiOutlineLoading size={24} className="animate-spin" /> Enviando e-mail...
                    </NotificationsComponent>
                )}
            </div>
        </div>
    )
}
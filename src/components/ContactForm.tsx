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

type notificationType = {
    open: boolean,
    message: string,
    type: 'warning' | 'processing' | 'success' | 'error'
}

export const ContactForm = () => {
    const { register, handleSubmit, setValue, formState: { errors }, } = useForm<DataProps>({
        mode: "onBlur",
        resolver: zodResolver(schema)
    })

    const [openNotifications, setOpenNotifications] = useState<notificationType>({ open: false, message: '', type: 'warning' })

    const onSubmit = async (data: DataProps) => {

        setOpenNotifications({ open: true, message: 'Enviando e-mail...', type: 'processing' })

        const subject = `Contato - ${data.email}`

        const response = await sendEmail(subject, data.email, data.message)

        if (response.success) {
            setOpenNotifications({ open: true, message: 'E-mail enviado com sucesso!', type: 'success' })
            setValue("email", "")
            setValue("message", "")
        }
        else
            setOpenNotifications({ open: true, message: 'Falha ao enviar e-mail!', type: 'error' })

        setTimeout(() => {
            setOpenNotifications({ ...openNotifications, open: false })
        }, 2000)

    }

    return (
        <div id="form" className="w-full flex flex-col items-center mt-10">
            <LinkComponent href={`http://wa.me/55${config.PHONE}`} target="_blank" model="outline">
                <AiOutlineWhatsApp size={24} />(51)99264-6568
            </LinkComponent>

            <div className="relative w-full max-w-lg flex flex-col gap-10 p-5 mt-10 rounded bg-slate-50 shadow-md">

                <NotificationsComponent
                    size="md"
                    position="bottom-right"
                    typeNotification={openNotifications.type}
                    showNotification={openNotifications.open}
                >
                    {openNotifications.type === 'processing' && <AiOutlineLoading size={24} className="animate-spin" />} {openNotifications.message}
                </NotificationsComponent>

                <Input
                    disabled={openNotifications.open}
                    type="email"
                    label="Deixe o seu melhor e-mail*"
                    placeholder="engenharia.degil@gmail.com"
                    helperText={errors?.email?.message}
                    {...register("email")}
                />

                <TextAreaComponent
                    disabled={openNotifications.open}
                    label="Compartilhe suas dúvidas"
                    placeholder="Compartilhe suas dúvidas"
                    classNameTextArea="min-h-[100px]"
                    {...register("message")}
                />

                <ButtonComponent
                    disabled={openNotifications.open}
                    className="m-auto"
                    onClick={() => handleSubmit(onSubmit)()}
                >
                    Enviar
                </ButtonComponent>
            </div>
        </div>
    )
}
"use client"

import { useForm } from "react-hook-form"
import { useState } from "react"
import validator from "validator"
import { config } from "../../../config.local"
import { calculateInspectionPrice } from "@/utils/calculateInspectionPrice"
import { AiOutlineLoading } from "react-icons/ai"
import { Input } from "@/components/Input"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { InputRadioContainer } from "@/components/InputRadioContainer"
import { MaskedInput } from "@/components/MaskedInput/MaskedInput"
import { emailMessage as defaultEmailMessage, whatsappMessage as defaultWhatsappMessage } from "@/utils/messageTemplates"
import { ButtonComponent } from "@/components/ButtonComponent"
import { NotificationsComponent } from "@/components/NotificationsComponent"
import { sendEmail } from "@/utils/sendEmail"
import { optionsHasCourtyard, optionsHasFurniture, optionsInspectionType } from "@/utils/selectOptions"
import { PageTitle } from "@/components/PageTitle"
import { MainComponent } from "@/components/MainComponent"
import { Header } from "@/components/Header"

const currentDate = new Date().toISOString().split("T")[0];

const schema = z.object({
  requesterName: z.string()
    .min(3, { message: "O nome deve ter pelo menos 3 caracteres" }).transform((value) => value.trim()),
  requesterEmail: z.string()
    .email({ message: "Digite um e-mail válido" }),
  propertyCode: z.string()
    .min(3, { message: "O código deve ter pelo menos 3 números" }),
  zipCode: z.string()
    .min(1, { message: "O CEP é obrigatório" }).refine((value) => validator.isPostalCode(value, "BR"), { message: "O CEP deve ser válido" }),
  city: z.string()
    .min(3, { message: "A cidade deve ter pelo menos 3 caracteres" }),
  neighborhood: z.string()
    .min(3, { message: "O bairro deve ter pelo menos 3 caracteres" }),
  address: z.string()
    .min(3, { message: "O endereço deve ter pelo menos 3 caracteres" }),
  addressNumber: z.string()
    .min(1, { message: "O número é obrigatório" }),
  addressComplement: z.string(),
  propertyArea: z.string()
    .min(1, { message: "Entre com um número entre 1 e 99999" }).max(99999, { message: "Entre com um valo entre 1 e 99999" }),
  hasFurniture: z.string({ invalid_type_error: "Selecione uma opção" })
    .min(1, { message: "Selecione uma opção" })
    .refine((value) => optionsHasFurniture.some((option) => option.value === value)),
  hasCourtyard: z.string({ invalid_type_error: "Selecione uma opção" })
    .min(1, { message: "Selecione uma opção" })
    .refine((value) => optionsHasCourtyard.some((option) => option.value === value)),
  effectivenessDate: z.string()
    .min(1, { message: "A data deve ser preenchida" })
    .refine((value) => value >= currentDate, { message: "A data deve ser maior ou igual à data atual" }),
  inspectionType: z.string({ invalid_type_error: "Selecione uma opção" })
    .min(1, { message: "Selecione uma opção" })
    .refine((value) => optionsInspectionType.some((option) => option.value === value)),
})

export type FormDataProps = z.infer<typeof schema>

export default function Inspections() {
  const { register, handleSubmit, setValue, getValues, formState: { errors }, } = useForm<FormDataProps>({
    mode: "onBlur",
    resolver: zodResolver(schema)
  })

  const [isSendingEmail, setIsSendingEmail] = useState(false)
  const [hasEmailBeenSent, setHasEmailBeenSent] = useState(false)
  const [emailResponse, setEmailResponse] = useState('')

  const onSubmit = async (data: FormDataProps) => {
    const price = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(calculateInspectionPrice(data))

    const { requesterName, requesterEmail, propertyCode, zipCode, city, neighborhood, address, addressNumber, addressComplement, propertyArea, hasFurniture, hasCourtyard, effectivenessDate, inspectionType } = data

    const furniture = hasFurniture === 'semiFurnished' ? "Semimobiliado" : hasFurniture === 'furnished' ? "Mobiliado" : "Sem mobília"
    const courtyard = hasCourtyard === 'yes' ? "Sim" : "Não"
    const inspection = inspectionType === 'entry' ? "Entrada" : "Saída"
    const formattedDate = new Date(effectivenessDate).toLocaleDateString('pt-BR', { timeZone: 'UTC' })

    const emailMessage = defaultEmailMessage({
      name: requesterName,
      email: requesterEmail,
      propertyCode,
      zipCode,
      city,
      neighborhood,
      address,
      addressNumber,
      addressComplement,
      propertyArea,
      furniture,
      courtyard,
      effectivenessDate: formattedDate,
      inspectionType: inspection,
      price: price
    })

    const whatsappMessage = defaultWhatsappMessage({
      name: requesterName,
      email: requesterEmail,
      propertyCode,
      zipCode,
      city,
      neighborhood,
      address,
      addressNumber,
      addressComplement,
      propertyArea,
      furniture,
      courtyard,
      effectivenessDate: formattedDate,
      inspectionType: inspection,
      price: price
    })

    const whatsappSend = `https://api.whatsapp.com/send?phone=+55${config.PHONE}&text=${encodeURIComponent(whatsappMessage)}`

    window.open(whatsappSend, '_blank')

    setIsSendingEmail(true)
    const subject = `Simulação de Vistoria - ${requesterName}`

    const response = await sendEmail(
      requesterEmail,
      subject,
      emailMessage,
      requesterName
    )

    setHasEmailBeenSent(true)
    setIsSendingEmail(false)
    setEmailResponse(response.message)

    setTimeout(() => {
      setHasEmailBeenSent(false)
    }, 4000)

    if (response.status) {
      setValue("address", "")
      setValue("addressComplement", "")
      setValue("addressNumber", "")
      setValue("city", "")
      setValue("effectivenessDate", "")
      setValue("hasCourtyard", null!)
      setValue("hasFurniture", null!)
      setValue("inspectionType", null!)
      setValue("neighborhood", "")
      setValue("propertyArea", "")
      setValue("propertyCode", "")
      setValue("requesterEmail", "")
      setValue("requesterName", "")
      setValue("zipCode", "")
    }
  }


  const handleZipCodeFetch = async (code: string) => {
    if (String(code).length !== 8 || !validator.isNumeric(String(code))) return

    setValue("city", "...")
    setValue("neighborhood", "...")
    setValue("address", "...")

    try {
      const response = await fetch(`https://viacep.com.br/ws/${code}/json/`)
      const data = await response.json()

      setValue("city", data.localidade)
      setValue("neighborhood", data.bairro)
      setValue("address", data.logradouro)

    } catch (error: any) {
      console.error(error.message)
      setValue("city", "")
      setValue("neighborhood", "")
      setValue("address", "")
    }
  }

  return (
    <>
      <Header />
      <MainComponent className="items-center">
        {hasEmailBeenSent && (
          <NotificationsComponent size="md" position="bottom-right" className={`${emailResponse.includes("Falha") ? 'bg-red-500' : ''}`}>{emailResponse}</NotificationsComponent>
        )}

        <PageTitle title="Vistorias" />
        <div className="w-full max-w-3xl grid gap-x-10 p-5 bg-slate-50 rounded-sm shadow-md xs:grid-cols-2">
          <h2 className="text-xl text-center text-secondary font-bold xs:col-span-2">Faça uma simulação</h2>

          <h2 className="text-lg mb-1 xs:col-span-2">Dados pessoais</h2>

          <Input
            disabled={isSendingEmail}
            label="Nome do solicitante"
            placeholder="Digite o nome do solicitante"
            classNameDiv="xs:col-span-2"
            helperText={errors?.requesterName?.message}
            {...register("requesterName")}
          />

          <Input
            disabled={isSendingEmail}
            label="E-mail do solicitante"
            placeholder="Digite seu melhor e-mail"
            classNameDiv="xs:col-span-2"
            helperText={errors?.requesterEmail?.message}
            {...register("requesterEmail")}
          />

          <h2 className="text-lg mt-3 mb-1 xs:col-span-2">Endereço do imóvel para vistoria</h2>

          <Input
            disabled={isSendingEmail}
            label="Código do imóvel"
            placeholder="Código do imóvel"
            helperText={errors?.propertyCode?.message}
            {...register("propertyCode")}
          />

          <MaskedInput
            disabled={isSendingEmail}
            mask="99999-999"
            label="CEP do imóvel"
            placeholder="Digite o CEP do imóvel"
            helperText={errors?.zipCode?.message}
            {...register("zipCode", { onBlur: (e) => { handleZipCodeFetch(e.target.value.replace('-', '')) } })}
          />

          <Input
            disabled={isSendingEmail}
            label="Cidade"
            placeholder="Cidade"
            helperText={errors?.city?.message}
            {...register("city")}
          />

          <Input
            disabled={isSendingEmail}
            label="Bairro"
            placeholder="Bairro"
            helperText={errors?.neighborhood?.message}
            {...register("neighborhood")}
          />

          <Input
            disabled={isSendingEmail}
            label="Endereço"
            placeholder="Endereço"
            helperText={errors?.address?.message}
            {...register("address")}
            classNameDiv="xs:col-span-2"
          />

          <Input
            disabled={isSendingEmail}
            type="number"
            maxLength={6}
            label="Número"
            placeholder="Número"
            helperText={errors?.addressNumber?.message}
            {...register("addressNumber")}
          />

          <Input
            disabled={isSendingEmail}
            label="Complemento"
            placeholder="Complemento"
            {...register("addressComplement")}
          />

          <h2 className="text-lg mt-3 mb-1 xs:col-span-2">Dados do imóvel para vistoria</h2>

          <Input
            disabled={isSendingEmail}
            type="number"
            min={1}
            max={99999}
            maxLength={5}
            label="Área do imóvel (m²)"
            placeholder="Área do imóvel (m²)"
            helperText={errors?.propertyArea?.message}
            {...register("propertyArea")}
          />

          <InputRadioContainer
            label="Imóvel possui mobílias"
            helperText={errors?.hasFurniture?.message}
          >
            {optionsHasFurniture.map((option) => (
              <Input
                key={option.value}
                disabled={isSendingEmail}
                type="radio"
                isRadioInput={true}
                label={option.label}
                value={option.value}
                helperText={errors?.hasFurniture?.message}
                {...register("hasFurniture")}
              />
            ))}
          </InputRadioContainer>

          <InputRadioContainer
            label="Imóvel possui pátio"
            helperText={errors?.hasCourtyard?.message}
          >
            {optionsHasCourtyard.map((option) => (
              <Input
                key={option.value}
                disabled={isSendingEmail}
                type="radio"
                isRadioInput={true}
                label={option.label}
                value={option.value}
                helperText={errors?.hasCourtyard?.message}
                {...register("hasCourtyard")}
              />
            ))}
          </InputRadioContainer>

          <InputRadioContainer
            label="Tipo de vistoria"
            helperText={errors?.inspectionType?.message}
          >
            {optionsInspectionType.map((option) => (
              <Input
                key={option.value}
                disabled={isSendingEmail}
                type="radio"
                isRadioInput={true}
                label={option.label}
                value={option.value}
                helperText={errors?.inspectionType?.message}
                {...register("inspectionType")}
              />
            ))}
          </InputRadioContainer>

          <Input
            disabled={isSendingEmail}
            type="date"
            label="Data de vigência"
            classNameDiv="xs:col-span-2"
            min={currentDate}
            placeholder="Data de vigência"
            helperText={errors?.effectivenessDate?.message}
            {...register("effectivenessDate")}
          />

          {!isSendingEmail && (
            <ButtonComponent
              onClick={() => handleSubmit(onSubmit)()}
              className="xs:col-span-2 m-auto mt-10"
            />
          )}

          {isSendingEmail && (
            <NotificationsComponent className="xs:col-span-2 m-auto mt-10">
              <AiOutlineLoading size={24} className="animate-spin" /> Enviando e-mail...
            </NotificationsComponent>
          )}
        </div>
      </MainComponent>
    </>
  )
}

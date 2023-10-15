"use client"

import { useForm } from "react-hook-form"
import { useState } from "react"
import validator from "validator"
import { config } from "../../../config.local"
import { calculateInspectionPrice } from "@/utils/calculateInspectionPrice"
import { AiOutlineCloseCircle, AiOutlineLoading, AiOutlineWhatsApp } from "react-icons/ai"
import { Input } from "@/components/Input"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { InputRadioContainer } from "@/components/InputRadioContainer"
import { MaskedInput } from "@/components/MaskedInput/MaskedInput"
import { emailMessage as defaultEmailMessage, whatsappMessage as defaultWhatsappMessage } from "@/utils/messageTemplates"
import { ButtonComponent } from "@/components/ButtonComponent"
import { NotificationsComponent } from "@/components/NotificationsComponent"
import { sendEmail } from "@/utils/sendEmail"
import { optionsHasCourtyard, optionsHasFurniture, optionsInspectionType, optionsPropertyType } from "@/utils/selectOptions"
import { PageTitle } from "@/components/PageTitle"
import { MainComponent } from "@/components/MainComponent"
import { Header } from "@/components/Header"
import { FaRegWindowClose } from "react-icons/fa"

const currentDate = new Date().toISOString().split("T")[0];

const schema = z.object({
  requesterName: z.string()
    .min(3, { message: "O nome deve ter pelo menos 3 caracteres" }).transform((value) => value.trim()),
  requesterEmail: z.string().
    refine((value) => {
      if (value.length > 0) return validator.isEmail(value);
      else return true;
    }, { message: "Digite um e-mail válido" }),
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
  const [hasEmailBeenSent, setHasEmailBeenSent] = useState({ beenSent: false, notification: false })
  const [emailResponse, setEmailResponse] = useState('')
  const [emailHasBeenCompleted, setEmailHasBeenCompleted] = useState(false)
  const [searchingZipCode, setSearchingZipCode] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [priceInspection, setPriceInspection] = useState('')

  const handleCalculateInspectionPrice = (data: FormDataProps) => {
    setShowModal(true)
    sendEmailAndWhatsApp(false, data)

    setPriceInspection(new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(calculateInspectionPrice(data)))
  }

  const sendEmailAndWhatsApp = async (whatsapp: boolean, data: FormDataProps) => {
    let response = null;
    const price = priceInspection

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

    let subject = `Simulação de Vistoria - ${requesterName}`

    if (!emailHasBeenCompleted)
      subject = `Solicitação de Vistoria - ${requesterName}`

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
      price: price,
      subject
    })

    const whatsappSend = `https://api.whatsapp.com/send?phone=+55${config.PHONE}&text=${encodeURIComponent(whatsappMessage)}`

    if (whatsapp)
      window.open(whatsappSend, '_blank')

    if (getValues("requesterEmail").length > 0) {
      setIsSendingEmail(true)
      setEmailHasBeenCompleted(true)

      response = await sendEmail(
        requesterEmail,
        subject,
        emailMessage,
        requesterName
      )

      setHasEmailBeenSent({ beenSent: true, notification: true })
      setIsSendingEmail(false)
      setEmailResponse(response.message)

      setTimeout(() => {
        setHasEmailBeenSent({ ...hasEmailBeenSent, notification: false })
      }, 4000)
    }

    return response;
  }

  const onSubmit = (data: FormDataProps) => {
    if (emailHasBeenCompleted)
      setValue("requesterEmail", "")

    sendEmailAndWhatsApp(true, data)

    if (hasEmailBeenSent.beenSent) {
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
      setValue("requesterEmail", "")
    }

    setShowModal(false)
    setEmailHasBeenCompleted(false)
  }


  const handleZipCodeFetch = async (code: string) => {
    const inputCity = document.querySelector('input[name="city"]');

    if (String(code).length !== 8 || !validator.isNumeric(String(code))) return

    setSearchingZipCode(true)
    setValue("city", "...")
    setValue("neighborhood", "...")
    setValue("address", "...")

    try {
      const response = await fetch(`https://viacep.com.br/ws/${code}/json/`)
      const data = await response.json()

      setValue("city", data.localidade)
      setValue("neighborhood", data.bairro)
      setValue("address", data.logradouro)
      setSearchingZipCode(false)

      if (data.erro) {
        document.querySelector('input[name="city"]')?.focus()
      } else {
        document.querySelector('input[name="addressNumber"]')?.select()
      }

    } catch (error: any) {
      console.error(error.message)
      setValue("city", "")
      setValue("neighborhood", "")
      setValue("address", "")
      document.querySelector('input[name="city"]')?.focus()
    } finally {
      setSearchingZipCode(false)
    }
  }

  return (
    <>
      <Header />

      <div onClick={() => setShowModal(false)} className={`${showModal ? 'opacity-60 z-20' : 'opacity-0 -z-10'} fixed inset-0 bg-black transition-all ease-linear duration-300`}></div>

      <div className={`${showModal ? 'opacity-100 z-20' : 'opacity-0 -z-10'} flex flex-col items-center fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-[400px] p-5 rounded-sm shadow-sm bg-white transition-all ease-linear duration-300`}>
        <AiOutlineCloseCircle
          size={32}
          className="absolute top-3 right-3 cursor-pointer text-slate-400"
          onClick={() => setShowModal(false)}
        />

        <h1 className="text-xl font-bold text-primary mt-3 mb-2">Resultado da Simulação</h1>
        <div className="w-full h-1 bg-secondary mb-5"></div>

        <p className="text-lg text-primary font-semibold">
          Valor da vistoria: <strong className="text-secondary font-semibold">{priceInspection}</strong>
        </p>

        {!emailHasBeenCompleted && (
          <Input
            type="email"
            disabled={isSendingEmail}
            label="E-mail do solicitante"
            placeholder="ex: email@gmail.com"
            classNameDiv="w-full max-w-[300px] mt-5"
            helperText={errors?.requesterEmail?.message}
            {...register("requesterEmail")}
          />
        )}

        <p className="text-lg text-center text-primary font-semibold mt-5">Envie uma solicitação agora mesmo!</p>

        <ButtonComponent
          onClick={() => handleSubmit(onSubmit)()}
          buttonSize="md"
          className="flex justify-center items-center gap-2 mt-3"
        >
          Enviar WhatsApp <AiOutlineWhatsApp size={24} />
        </ButtonComponent>
      </div>
      <MainComponent className="items-center">
        {hasEmailBeenSent.notification && (
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

          {(!showModal && !emailHasBeenCompleted) && (
            <Input
              type="email"
              disabled={isSendingEmail}
              label="E-mail do solicitante"
              placeholder="ex: email@gmail.com"
              classNameDiv="xs:col-span-2"
              helperText={errors?.requesterEmail?.message}
              {...register("requesterEmail")}
            />
          )}

          <h2 className="text-lg mt-3 mb-1 xs:col-span-2">Endereço do imóvel para vistoria</h2>

          <Input
            disabled={isSendingEmail}
            type="number"
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
            disabled={isSendingEmail || searchingZipCode}
            label="Cidade"
            placeholder="Cidade"
            helperText={errors?.city?.message}
            {...register("city")}
          />

          <Input
            disabled={isSendingEmail || searchingZipCode}
            label="Bairro"
            placeholder="Bairro"
            helperText={errors?.neighborhood?.message}
            {...register("neighborhood")}
          />

          <Input
            disabled={isSendingEmail || searchingZipCode}
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
            label="Complemento (opcional)"
            placeholder="ex: Apto 101"
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
              onClick={() => handleSubmit(handleCalculateInspectionPrice)()}
              className="xs:col-span-2 m-auto mt-10"
            >
              Realizar Simulação
            </ButtonComponent>
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

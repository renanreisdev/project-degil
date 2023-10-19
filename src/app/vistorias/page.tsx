"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { AiOutlineCloseCircle, AiOutlineLoading, AiOutlineWhatsApp } from "react-icons/ai"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import validator from "validator"

import { config } from "../../../config.local"
import { calculateInspectionPrice } from "@/utils/calculateInspectionPrice"
import { emailMessage as defaultEmailMessage, whatsappMessage as defaultWhatsappMessage } from "@/utils/messageTemplates"
import { sendEmail } from "@/utils/sendEmail"
import { optionsHasCourtyard, optionsHasFurniture, optionsInspectionType } from "@/utils/selectOptions"

import { Header } from "@/components/Header"
import { PageTitle } from "@/components/PageTitle"
import { MainComponent } from "@/components/MainComponent"
import { InputRadioContainer } from "@/components/InputRadioContainer"
import { Input } from "@/components/Input"
import { MaskedInput } from "@/components/MaskedInput/MaskedInput"
import { ButtonComponent } from "@/components/ButtonComponent"
import { LinkComponent } from "@/components/LinkComponent"
import { NotificationsComponent } from "@/components/NotificationsComponent"
import { BsCheckLg } from "react-icons/bs"

const currentDate = new Date().toISOString().split("T")[0];

const schema = z.object({
  requesterName: z.string()
    .min(3, { message: "O nome deve ter pelo menos 3 caracteres" }).transform((value) => value.trim()),
  requesterEmail: z.string().
    refine((value) => {
      if (value.length > 0) return validator.isEmail(value);
      return true;
    }, { message: "Digite um e-mail válido" }),
  carbonCopy: z.boolean(),
  propertyCode: z.string()
    .min(3, { message: "O código deve ter pelo menos 3 números" }),
  zipCode: z.string()
    .min(1, { message: "O CEP é obrigatório" }).refine((value) => validator.isPostalCode(value, "BR"), { message: "Digite um CEP válido" }),
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
  stateCity: z.string(),
})

export type FormDataProps = z.infer<typeof schema>

type notificationType = {
  open: boolean,
  message: string,
  type: 'warning' | 'processing' | 'success' | 'error'
}

export default function Inspections() {
  const { register, handleSubmit, setValue, getValues, formState: { errors }, watch } = useForm<FormDataProps>({
    mode: "onBlur",
    resolver: zodResolver(schema)
  })

  const watchEmail = watch('requesterEmail')
  const watchCarbonCopy = watch('carbonCopy')

  const [openNotifications, setOpenNotifications] = useState<notificationType>({ open: false, message: '', type: 'warning' })
  const [emailHasBeenCompleted, setEmailHasBeenCompleted] = useState(false)
  const [searchingZipCode, setSearchingZipCode] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [showValueInfoModal, setShowValueInfoModal] = useState(false)

  const [priceInspection, setPriceInspection] = useState('')
  const [inspectionCostPlusDistance, setInspectionCostPlusDistance] = useState('')
  const [costDistance, setCostDistance] = useState('')
  const [distance, setDistance] = useState('')
  const [calculateDistance] = useState(config.CALCULATE_DISTANCE)
  const [showDistanceInfo] = useState(config.SHOW_DISTANCE_INFO)
  const [distanceValueEmbedded] = useState(config.DISTANCE_VALUE_EMBEDDED)
  const [errorCalculatingDistance, setErrorCalculatingDistance] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [helperTextSelectedFile, setHelperTextSelectedFile] = useState('')

  const handleCalculateInspectionPrice = async (data: FormDataProps) => {
    setShowModal(true)
    setOpenNotifications({ open: true, message: 'Calculando o total de distância...', type: 'warning' })

    const response = await calculateInspectionPrice(data)

    if (response.response === null) {
      setErrorCalculatingDistance(true)
    }
    else {
      setErrorCalculatingDistance(false)

      const inspectionPlusDistance = response.inspectionPrice + response.costDistance
      setInspectionCostPlusDistance(new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(inspectionPlusDistance))
      setCostDistance(new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(response.costDistance))
      if (response.distance > 1)
        setDistance(response.distance.toLocaleString('pt-BR', { style: "decimal", minimumFractionDigits: 1, maximumFractionDigits: 1 }) + "km")
      else {
        setDistance(response.distance * 1000 + "m")
      }
    }
    const inspection = response.inspectionPrice

    setPriceInspection(new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(inspection))

    setOpenNotifications({ open: false, message: '', type: 'warning' })
    setShowValueInfoModal(true)
    sendEmailAndWhatsApp(false, data)
  }

  const sendEmailAndWhatsApp = async (whatsapp: boolean, data: FormDataProps) => {

    let response = null;
    const price = priceInspection

    const { requesterName, requesterEmail, carbonCopy, propertyCode, zipCode, city, neighborhood, address, addressNumber, addressComplement, propertyArea, hasFurniture, hasCourtyard, effectivenessDate, inspectionType } = data

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
      setOpenNotifications({ open: true, message: 'Enviando e-mail...', type: 'warning' })
      setEmailHasBeenCompleted(true)

      response = await sendEmail(
        subject,
        emailMessage,
        requesterEmail,
        carbonCopy,
        selectedFile
      )

      if (response.success)
        setOpenNotifications({ open: true, message: 'E-mail enviado com sucesso', type: 'success' })
      else
        setOpenNotifications({ open: true, message: response.message, type: 'error' })

      setTimeout(() => {
        setOpenNotifications({ open: false, message: '', type: 'warning' })
      }, 5000)
    }

    return response;
  }

  const onSubmit = async (data: FormDataProps) => {
    if (emailHasBeenCompleted)
      setValue("requesterEmail", "")

    const response = await sendEmailAndWhatsApp(true, data)

    if (response?.success || !emailHasBeenCompleted) {
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
      setValue("stateCity", "")
      setSelectedFile(null)
    }

    setShowModal(false)
    setShowValueInfoModal(false)
    setEmailHasBeenCompleted(false)
  }


  const handleZipCodeFetch = async (code: string) => {

    if (String(code).length !== 8 || !validator.isNumeric(String(code))) return

    setSearchingZipCode(true)
    setValue("city", "...")
    setValue("neighborhood", "...")
    setValue("address", "...")

    const cityInput = document.querySelector('input[name="city"]') as HTMLInputElement
    const addressNumberInput = document.querySelector('input[name="addressNumber"]') as HTMLInputElement

    try {
      const response = await fetch(`https://viacep.com.br/ws/${code}/json/`)
      const data = await response.json()

      setSearchingZipCode(false)

      if (data.erro) {
        setValue("city", "")
        setValue("neighborhood", "")
        setValue("address", "")
        setValue("stateCity", "")
        cityInput?.select()
      } else {
        setValue("city", data.localidade)
        setValue("neighborhood", data.bairro)
        setValue("address", data.logradouro)
        setValue("stateCity", data.uf)
        addressNumberInput?.select()
      }

    } catch (error: any) {
      console.error(error.message)
      setSearchingZipCode(false)
      setValue("city", "")
      setValue("neighborhood", "")
      setValue("address", "")
      setValue("stateCity", "")
      cityInput?.select()
    }
  }

  const fileUploader = async (selectedFile: File) => {
    const allowedExtensions = [".doc", ".docx", ".pdf"];

    if (selectedFile.name.length > 0) {
      const fileExtension = selectedFile.name.split('.').pop();

      if (!allowedExtensions.includes(`.${fileExtension}`)) {
        setHelperTextSelectedFile("Escolha um arquivo do tipo .pdf, .doc ou .docx")
        setSelectedFile(null)
        return
      }

      if (selectedFile.size > 25 * 1024 * 1024) {
        setHelperTextSelectedFile("O arquivo deve ter no máximo 25MB")
        setSelectedFile(null)
        return
      }

      setHelperTextSelectedFile("")
      setSelectedFile(selectedFile)
      return
    }
  }

  return (
    <>
      <div
        onClick={() => {
          if (!openNotifications.open) {
            setShowModal(false); setShowValueInfoModal(false)
          }
        }}
        className={`${showModal ? 'opacity-60 z-30' : 'opacity-0 -z-10'} fixed inset-0 bg-black transition-all ease-linear duration-300`}></div>

      <div className={`${showValueInfoModal ? 'opacity-100 z-30' : 'opacity-0 -z-10'} flex flex-col items-center fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-[430px] p-5 rounded-sm shadow-sm bg-white transition-all ease-linear duration-300`}>
        <AiOutlineCloseCircle
          size={32}
          className="absolute top-3 right-3 cursor-pointer text-slate-400"
          onClick={() => { if (!openNotifications.open) { setShowModal(false); setShowValueInfoModal(false) } }}
        />

        <h1 className="text-xl font-bold text-primary mt-3 mb-2">Resultado da Simulação</h1>
        <div className="w-full h-1 bg-secondary mb-5"></div>

        <p className="text-lg text-primary font-semibold">
          Valor da vistoria: <strong className="text-secondary font-semibold">{distanceValueEmbedded ? inspectionCostPlusDistance : priceInspection}</strong>
        </p>

        {calculateDistance && showDistanceInfo && (
          <>
            {!errorCalculatingDistance && (
              <>
                {!distanceValueEmbedded && (
                  <>
                    <p className="text-xl text-secondary font-semibold">+</p>
                    <p className="text-sm text-primary font-semibold">Distância de deslocamento: <strong className="text-secondary font-semibold">{distance}</strong></p>
                    <p className="text-sm text-primary font-semibold">Valor de deslocamento: <strong className="text-secondary font-semibold">{costDistance.includes("R$ 0,00") ? '(grátis)' : costDistance}</strong></p>
                  </>
                )}

                {distanceValueEmbedded && <p className="text-sm">* Distância de deslocamento calculado: {distance} {costDistance.includes("R$ 0,00") ? '(grátis)' : ''}</p>}
              </>
            )}

            {errorCalculatingDistance && <p className="text-red-500 text-sm">* Não foi possível calcular o valor do deslocamento</p>}
          </>
        )}

        {!emailHasBeenCompleted && (
          <div className="flex flex-col items-center">
            <Input
              type="email"
              disabled={openNotifications.open}
              label="E-mail do solicitante"
              placeholder="ex: email@gmail.com"
              classNameDiv="w-full max-w-[300px] mt-5"
              helperText={errors?.requesterEmail?.message}
              {...register("requesterEmail")}
            />

            {selectedFile && (
              <p className="text-red-500 text-sm">* Você selecionou um anexo mas não inseriu um email...</p>
            )}
          </div>
        )}

        <p className="text-lg text-center text-primary font-semibold mt-5">Envie a solicitação agora mesmo!</p>

        <ButtonComponent
          disabled={openNotifications.open}
          onClick={() => handleSubmit(onSubmit)()}
          buttonSize="md"
          className="flex justify-center items-center gap-2 mt-3"
        >
          Enviar WhatsApp <AiOutlineWhatsApp size={24} />
        </ButtonComponent>
      </div>

      <Header />
      <MainComponent className="items-center">

        <NotificationsComponent
          size="md"
          position="bottom-right"
          typeNotification={openNotifications.type}
          showNotification={openNotifications.open}
        >
          {openNotifications.type === 'processing' && <AiOutlineLoading size={24} className="animate-spin" />} {openNotifications.message}
        </NotificationsComponent>

        <PageTitle title="Vistorias - Apresentação Comercial" />

        <div className="flex flex-col items-center">
          <p className="text-primary indent-10">Olá, somos a <strong className="underline">Degil Engenharia</strong> e nessa apresentação oferecemos <strong className="underline">vistorias imobiliárias</strong>.
            Estamos aqui disponibilizando a você alguns serviços em vistorias para pequenas, médias e grandes imobiliárias, CORRETORES, ADVOGADOS, Profissionais autônomos e liberais. Atuamos na grande Porto Alegre,
            a uma chamada de WhatsApp. Nossas vistorias contam com anos de experiência para grandes imobiliárias e a um custo acessível, muito abaixo de ter um profissional CLT dentro de sua empresa específico para
            a função. Oferecemos vistoria terceirizadas perfeitas, <strong className="underline">sem passivos trabalhistas e sem funcionários CLT</strong>, com facilidades, agilidade e custos que nenhuma empresa do mercado oferece.</p>

          <h2 className="self-start mt-5 mb-2 text-xl text-secondary font-bold">Tipos de vistoria:</h2>

          <ul className="list-decimal list-inside text-primary pl-10">
            <li>Vistorias de locação: Entrada, Saída e constatação</li>
            <li>Vistoria Condição vocacional do ponto, do prédio, do imóvel, para comércios possíveis no local.</li>
            <li>Vistoria emergencial: Na assinatura/ou encerramento do contrato, seja necessário esclarecimento técnico no imóvel imediato. Vistoria de conferencia, transferência de contrato, acompanhamento, inventario, aditivos</li>
            <li>Vistoria para avaliação legal, e estabelecimento de “preço legal” do imóvel com CREA (prerrogativa legal exclusiva de engenheiros e arquitetos)</li>
          </ul>

          <h2 className="self-start mt-5 mb-2 text-xl text-secondary font-bold">Modelo de vistoria:</h2>

          <p className="text-primary indent-10 mb-5"><strong>Entrada:</strong> Nossas vistorias são realizadas na forma de laudo fotográfico e descritivo de todos os itens do ambiente, assim como testes mecânicos de portas, armários e janelas e testes hidráulicos e elétricos dos
            itens pertinentes. Analisamos também área externas, motores, portões, piscinas e banheiras. A seguir um exemplo de vistoria de entrada:</p>

          <LinkComponent
            href="https://drive.google.com/file/d/1Mot-8HNgHcu4cLnFE3DaWm6tKzpAAj51/view?usp=sharing"
            target="_blank"
            model="outline"
          >
            Ver modelo de entrada
          </LinkComponent>

          <p className="text-primary indent-10 my-5"><strong>Saída:</strong> Na vistoria de saída realizamos todos os testes e análises da vistoria de entrada e ainda comparamos de forma minuciosa o estado presente do imóvel à entrada, para evidenciar e solicitar os devidos reparos
            e restauração das condições de entrada dos itens do imóvel. A se guir um exemplo de vistoria de saída:</p>

          <LinkComponent
            href="https://drive.google.com/file/d/1wPil3eQrlGrBb3PFo2oGJ91qzlyfguDn/view?usp=sharing"
            target="_blank"
            model="outline"
          >
            Ver modelo de Saída
          </LinkComponent>

          <h2 className="self-start mt-10 mb-2 text-xl text-secondary font-bold">Tabela de Comercialização para vistorias residenciais e comerciais:</h2>

          <ul className="list-disc list-inside text-primary pl-10">
            <li><strong>Vistoria avulsa:</strong> Imóveis sem mobília até 60 m² valor R$ 100,00, acima de 60m², adicione R$1,00 por m².</li>

            <ul className="list-disc list-inside text-primary pl-10"><strong>Adicionais:</strong>
              <li><strong>Semimobiliado:</strong> 20%</li>
              <li><strong>Mobiliado:</strong> 50%</li>
              <li><strong>Com área externa (pátios):</strong> 20%</li>
              <li><strong>Deslocamento:</strong> Em Porto alegre não será cobrado adicional se o trajeto imobiliária-imóvel-imobiliária for menor ou igual a 10km. Se exceder, será cobrado R$1,00 por km e se não for possível realizar a vistoria devido falta de chaves na agência
                ou chaves não abrirem o imóvel será cobrado R$15,00 devido tempo e gasolina gastos.</li>
            </ul>
          </ul>

        </div>

        <div className="w-full max-w-3xl mt-10 grid gap-x-10 p-5 bg-slate-50 rounded-sm shadow-md xs:grid-cols-8">

          <h2 className="text-xl text-center text-secondary font-bold xs:col-span-8">Faça uma simulação</h2>

          <h2 className="text-lg mb-1 xs:col-span-8">Dados pessoais</h2>

          <Input
            disabled={openNotifications.open}
            label="Nome do solicitante"
            placeholder="Digite o nome do solicitante"
            classNameDiv="xs:col-span-8"
            helperText={errors?.requesterName?.message}
            {...register("requesterName")}
          />

          {(!showModal || !emailHasBeenCompleted) && (
            <>
              <div className="xs:col-span-5 flex justify-between items-center gap-1">
                <Input
                  type="email"
                  disabled={openNotifications.open}
                  label="E-mail do solicitante"
                  placeholder="ex: email@gmail.com"
                  classNameDiv="flex-1"
                  helperText={errors?.requesterEmail?.message}
                  {...register("requesterEmail")}
                />
                {watchEmail !== undefined && validator.isEmail(watchEmail) && (
                  <div className={`relative w-5 h-5 mt-3 border-2 rounded cursor-pointer ${watchCarbonCopy ? 'border-secondary' : 'border-slate-400'} transition-all ease-in-out duration-300 hover:scale-125 hover:border-secondary`}>
                    {watchCarbonCopy &&
                      <BsCheckLg className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-secondary transition-all ease-in-out duration-300 hover:scale-125" />
                    }
                    <Input
                      type="checkbox"
                      label="CC"
                      checked={watchCarbonCopy}
                      title="Com cópia para o e-mail informado"
                      alt="Com cópia para o e-mail informado"
                      classNameLabel="m-0"
                      classNameDiv="absolute -top-5 left-0"
                      classNameInput="w-5 h-5 cursor-pointer opacity-0"
                      {...register("carbonCopy")}
                    />
                  </div>
                )}
              </div>

              <div className="xs:col-span-3 relative mt-5 w-full flex flex-start justify-between items-center gap-1">
                <Input
                  type="file"
                  name="selectedFile"
                  accept=".pdf, .doc, .docx"
                  disabled={openNotifications.open}
                  label={selectedFile ? selectedFile.name : "Anexar documento"}
                  classNameDiv="flex-1"
                  classNameLabel={`m-0 max-w-[220px] border border-slate-400 rounded overflow-hidden whitespace-nowrap text-ellipsis text-center text-slate-400 text-base flex-1 px-3 py-1 cursor-pointer ${selectedFile ? 'text-white bg-secondary border-none' : ''}`}
                  classNameInput="hidden"
                  helperText={helperTextSelectedFile}
                  onChange={
                    (e) => {
                      if (e.target.files === null) return
                      if (e.target.files.length > 0)
                        fileUploader(e.target.files[0])
                    }
                  }
                />
                {selectedFile && (
                  <AiOutlineCloseCircle
                    size={24}
                    title="Cancelar anexo"
                    alt="Cancelar anexo"
                    className="cursor-pointer text-slate-400 -mt-2 transition-all ease-in-out duration-300 hover:scale-125 hover:text-secondary"
                    onClick={() => { setSelectedFile(null) }}
                  />
                )}
              </div>
            </>

          )}
          <h2 className="text-lg mt-3 mb-1 xs:col-span-8">Endereço do imóvel para vistoria</h2>

          <Input
            disabled={openNotifications.open}
            type="number"
            label="Código do imóvel"
            placeholder="Código do imóvel"
            classNameDiv="xs:col-span-4"
            helperText={errors?.propertyCode?.message}
            {...register("propertyCode")}
          />

          <MaskedInput
            disabled={openNotifications.open}
            mask="99999-999"
            label="CEP do imóvel"
            placeholder="Digite o CEP do imóvel"
            classNameDiv="xs:col-span-4"
            helperText={errors?.zipCode?.message}
            {...register("zipCode", { onBlur: (e: any) => { handleZipCodeFetch(e.target.value.replace('-', '')) } })}
          />

          <Input
            disabled={openNotifications.open || searchingZipCode}
            label="Cidade"
            placeholder="Cidade"
            classNameDiv="xs:col-span-4"
            helperText={errors?.city?.message}
            {...register("city")}
          />

          <Input
            disabled={openNotifications.open || searchingZipCode}
            label="Bairro"
            placeholder="Bairro"
            classNameDiv="xs:col-span-4"
            helperText={errors?.neighborhood?.message}
            {...register("neighborhood")}
          />

          <Input
            disabled={openNotifications.open || searchingZipCode}
            label="Endereço"
            placeholder="Endereço"
            helperText={errors?.address?.message}
            {...register("address")}
            classNameDiv="xs:col-span-8"
          />

          <Input
            disabled={openNotifications.open}
            type="number"
            maxLength={6}
            label="Número"
            placeholder="Número"
            classNameDiv="xs:col-span-4"
            helperText={errors?.addressNumber?.message}
            {...register("addressNumber")}
          />

          <Input
            disabled={openNotifications.open}
            label="Complemento (opcional)"
            placeholder="ex: Apto 101"
            classNameDiv="xs:col-span-4"
            {...register("addressComplement")}
          />

          <h2 className="text-lg mt-3 mb-1 xs:col-span-8">Dados do imóvel para vistoria</h2>

          <Input
            disabled={openNotifications.open}
            type="number"
            min={1}
            max={99999}
            maxLength={5}
            label="Área do imóvel (m²)"
            placeholder="Área do imóvel (m²)"
            classNameDiv="xs:col-span-4"
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
                disabled={openNotifications.open}
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
                disabled={openNotifications.open}
                type="radio"
                isRadioInput={true}
                label={option.label}
                value={option.value}
                classNameDiv="xs:col-span-4"
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
                disabled={openNotifications.open}
                type="radio"
                isRadioInput={true}
                label={option.label}
                value={option.value}
                classNameDiv="xs:col-span-4"
                helperText={errors?.inspectionType?.message}
                {...register("inspectionType")}
              />
            ))}
          </InputRadioContainer>

          <Input
            disabled={openNotifications.open}
            type="date"
            label="Data de vigência"
            classNameDiv="xs:col-span-8"
            min={currentDate}
            placeholder="Data de vigência"
            helperText={errors?.effectivenessDate?.message}
            {...register("effectivenessDate")}
          />

          {/* {!openNotifications.open && ( */}
          <ButtonComponent
            onClick={() => handleSubmit(handleCalculateInspectionPrice)()}
            className="xs:col-span-8 m-auto mt-10"
          >
            Realizar Simulação
          </ButtonComponent>
          {/* )} */}

          {/* {openNotifications.open && (
            <NotificationsComponent className="z-20 xs:col-span-8 m-auto mt-10">
              <AiOutlineLoading size={24} className="animate-spin" /> {openNotifications.title}
            </NotificationsComponent>
          )} */}
        </div>
      </MainComponent >
    </>
  )
}

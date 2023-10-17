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
  stateCity: z.string(),
})

export type FormDataProps = z.infer<typeof schema>

export default function Inspections() {
  const { register, handleSubmit, setValue, getValues, formState: { errors }, } = useForm<FormDataProps>({
    mode: "onBlur",
    resolver: zodResolver(schema)
  })

  const [openNotifications, setOpenNotifications] = useState({ open: false, title: '' })
  const [hasEmailBeenSent, setHasEmailBeenSent] = useState({ beenSent: false, notification: false })
  const [emailResponse, setEmailResponse] = useState('')
  const [emailHasBeenCompleted, setEmailHasBeenCompleted] = useState(false)
  const [searchingZipCode, setSearchingZipCode] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [showValueInfoModal, setShowValueInfoModal] = useState(false)

  const [priceInspection, setPriceInspection] = useState('')
  const [inspectionCostPlusDistance, setInspectionCostPlusDistance] = useState('')
  const [costDistance, setCostDistance] = useState('')
  const [distance, setDistance] = useState(0)
  const [calculateDistance] = useState(config.CALCULATE_DISTANCE)
  const [showDistanceInfo] = useState(config.SHOW_DISTANCE_INFO)
  const [distanceValueEmbedded] = useState(config.DISTANCE_VALUE_EMBEDDED)
  const [freeMaximumKm] = useState(config.FREE_MAXIMUM_KM)
  const [errorCalculatingDistance, setErrorCalculatingDistance] = useState(false)

  const handleCalculateInspectionPrice = async (data: FormDataProps) => {
    let costDistance = 0
    let distance = 0

    setShowModal(true)
    setOpenNotifications({ open: true, title: 'Calculando distância até o imóvel...' })

    console.log("Chamado do método")

    const response1 = await calculateInspectionPrice(data, true)

    console.log("Resposta1 => ", response1)

    if (config.DISTANCE_MULTIPLIER === 0) {
      setOpenNotifications({ open: true, title: 'Calculando distância até a Degil...' })
      const response2 = await calculateInspectionPrice(data, false)
      console.log("Resposta2 => ", response1)
      costDistance = response1.costDistance + response2.costDistance
      distance = response1.distance + response2.distance
    }


    setOpenNotifications({ open: false, title: '' })
    setShowValueInfoModal(true)
    sendEmailAndWhatsApp(false, data)

    if (response1.message === 'error') {
      setErrorCalculatingDistance(true)
    }
    else {
      setErrorCalculatingDistance(false)
      if (config.DISTANCE_MULTIPLIER > 0) {
        costDistance = response1.costDistance
        distance = response1.distance
      }

      const inspectionPlusDistance = response1.inspectionPrice + costDistance
      setInspectionCostPlusDistance(new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(inspectionPlusDistance))
      setCostDistance(new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(costDistance))
      setDistance(distance)
    }
    const inspection = response1.inspectionPrice

    setPriceInspection(new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(inspection))
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
      setOpenNotifications({ open: true, title: 'Enviando e-mail...' })
      setEmailHasBeenCompleted(true)

      response = await sendEmail(
        requesterEmail,
        subject,
        emailMessage,
        requesterName
      )

      setHasEmailBeenSent({ beenSent: true, notification: true })
      setOpenNotifications({ open: false, title: '' })
      setEmailResponse(response.message)

      setTimeout(() => {
        setHasEmailBeenSent({ ...hasEmailBeenSent, notification: false })
      }, 4000)
    }

    return response;
  }

  const onSubmit = async (data: FormDataProps) => {
    if (emailHasBeenCompleted)
      setValue("requesterEmail", "")

    const response = await sendEmailAndWhatsApp(true, data)

    if (response?.status || hasEmailBeenSent.beenSent) {
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

      setValue("city", data.localidade)
      setValue("neighborhood", data.bairro)
      setValue("address", data.logradouro)
      setValue("stateCity", data.uf)
      setSearchingZipCode(false)

      if (data.erro) {
        cityInput?.select()
      } else {
        addressNumberInput?.select()
      }

    } catch (error: any) {
      console.error(error.message)
      setValue("city", "")
      setValue("neighborhood", "")
      setValue("address", "")
      setValue("stateCity", "")
      cityInput?.select()
    } finally {
      setSearchingZipCode(false)
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
        className={`${showModal ? 'opacity-60 z-20' : 'opacity-0 -z-10'} fixed inset-0 bg-black transition-all ease-linear duration-300`}></div>

      <div className={`${showValueInfoModal ? 'opacity-100 z-20' : 'opacity-0 -z-10'} flex flex-col items-center fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-[400px] p-5 rounded-sm shadow-sm bg-white transition-all ease-linear duration-300`}>
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
                    <p className="text-sm text-primary font-semibold">Distância de deslocamento: <strong className="text-secondary font-semibold">{String(distance).replace(".", ",")}km</strong></p>
                    <p className="text-sm text-primary font-semibold">Valor de deslocamento: <strong className="text-secondary font-semibold">{distance < freeMaximumKm ? '(grátis)' : costDistance}</strong></p>
                  </>
                )}

                {distanceValueEmbedded && <p className="text-sm">* Distância de deslocamento calculado: {String(distance).replace(".", ",")}km {distance < freeMaximumKm ? '(grátis)' : ''}</p>}
              </>
            )}

            {errorCalculatingDistance && <p className="text-red-500 text-sm">* Não foi possível calcular o valor do deslocamento</p>}
          </>
        )}

        {!emailHasBeenCompleted && (
          <Input
            type="email"
            disabled={openNotifications.open}
            label="E-mail do solicitante"
            placeholder="ex: email@gmail.com"
            classNameDiv="w-full max-w-[300px] mt-5"
            helperText={errors?.requesterEmail?.message}
            {...register("requesterEmail")}
          />
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
        {hasEmailBeenSent.notification && (
          <NotificationsComponent size="md" position="bottom-right" className={`z-20 ${emailResponse.includes("Falha") ? 'bg-red-500' : ''}`}>{emailResponse}</NotificationsComponent>
        )}

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

          <p className="text-primary indent-10"><strong>Entrada:</strong> Nossas vistorias são realizadas na forma de laudo fotográfico e descritivo de todos os itens do ambiente, assim como testes mecânicos de portas, armários e janelas e testes hidráulicos e elétricos dos
            itens pertinentes. Analisamos também área externas, motores, portões, piscinas e banheiras. A seguir um exemplo de vistoria de entrada:</p>

          <p className="text-primary indent-10"><strong>Saída:</strong> Na vistoria de saída realizamos todos os testes e análises da vistoria de entrada e ainda comparamos de forma minuciosa o estado presente do imóvel à entrada, para evidenciar e solicitar os devidos reparos
            e restauração das condições de entrada dos itens do imóvel. A se guir um exemplo de vistoria de saída:</p>

          <h2 className="self-start mt-5 mb-2 text-xl text-secondary font-bold">Tabela de Comercialização para vistorias residenciais e comerciais:</h2>

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

        <div className="w-full max-w-3xl mt-5 grid gap-x-10 p-5 bg-slate-50 rounded-sm shadow-md xs:grid-cols-2">

          <h2 className="text-xl text-center text-secondary font-bold xs:col-span-2">Faça uma simulação</h2>

          <h2 className="text-lg mb-1 xs:col-span-2">Dados pessoais</h2>

          <Input
            disabled={openNotifications.open}
            label="Nome do solicitante"
            placeholder="Digite o nome do solicitante"
            classNameDiv="xs:col-span-2"
            helperText={errors?.requesterName?.message}
            {...register("requesterName")}
          />

          {(!showModal && !emailHasBeenCompleted) && (
            <Input
              type="email"
              disabled={openNotifications.open}
              label="E-mail do solicitante"
              placeholder="ex: email@gmail.com"
              classNameDiv="xs:col-span-2"
              helperText={errors?.requesterEmail?.message}
              {...register("requesterEmail")}
            />
          )}

          <h2 className="text-lg mt-3 mb-1 xs:col-span-2">Endereço do imóvel para vistoria</h2>

          <Input
            disabled={openNotifications.open}
            type="number"
            label="Código do imóvel"
            placeholder="Código do imóvel"
            helperText={errors?.propertyCode?.message}
            {...register("propertyCode")}
          />

          <MaskedInput
            disabled={openNotifications.open}
            mask="99999-999"
            label="CEP do imóvel"
            placeholder="Digite o CEP do imóvel"
            helperText={errors?.zipCode?.message}
            {...register("zipCode", { onBlur: (e: any) => { handleZipCodeFetch(e.target.value.replace('-', '')) } })}
          />

          <Input
            disabled={openNotifications.open || searchingZipCode}
            label="Cidade"
            placeholder="Cidade"
            helperText={errors?.city?.message}
            {...register("city")}
          />

          <Input
            disabled={openNotifications.open || searchingZipCode}
            label="Bairro"
            placeholder="Bairro"
            helperText={errors?.neighborhood?.message}
            {...register("neighborhood")}
          />

          <Input
            disabled={openNotifications.open || searchingZipCode}
            label="Endereço"
            placeholder="Endereço"
            helperText={errors?.address?.message}
            {...register("address")}
            classNameDiv="xs:col-span-2"
          />

          <Input
            disabled={openNotifications.open}
            type="number"
            maxLength={6}
            label="Número"
            placeholder="Número"
            helperText={errors?.addressNumber?.message}
            {...register("addressNumber")}
          />

          <Input
            disabled={openNotifications.open}
            label="Complemento (opcional)"
            placeholder="ex: Apto 101"
            {...register("addressComplement")}
          />

          <h2 className="text-lg mt-3 mb-1 xs:col-span-2">Dados do imóvel para vistoria</h2>

          <Input
            disabled={openNotifications.open}
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
                helperText={errors?.inspectionType?.message}
                {...register("inspectionType")}
              />
            ))}
          </InputRadioContainer>

          <Input
            disabled={openNotifications.open}
            type="date"
            label="Data de vigência"
            classNameDiv="xs:col-span-2"
            min={currentDate}
            placeholder="Data de vigência"
            helperText={errors?.effectivenessDate?.message}
            {...register("effectivenessDate")}
          />

          {!openNotifications.open && (
            <ButtonComponent
              onClick={() => handleSubmit(handleCalculateInspectionPrice)()}
              className="xs:col-span-2 m-auto mt-10"
            >
              Realizar Simulação
            </ButtonComponent>
          )}

          {openNotifications.open && (
            <NotificationsComponent className="z-20 xs:col-span-2 m-auto mt-10">
              <AiOutlineLoading size={24} className="animate-spin" /> {openNotifications.title}
            </NotificationsComponent>
          )}
        </div>
      </MainComponent>
    </>
  )
}

"use client"

import { useForm } from "react-hook-form"
import validator from "validator"
import InputMask from "react-input-mask"
import { formDataType } from "@/types/FormDataType"
import { config } from "../../../config.local"
import { calculateInspectionPrice } from "@/utils/calculateInspectionPrice"
import { useEffect, useState } from "react"
import { AiOutlineLoading } from "react-icons/ai"

export default function Inspections() {
  const { register, handleSubmit, setValue, formState: { errors }, } = useForm<formDataType>()

  console.log(errors)

  const [sendingEmailState, setSendingEmailState] = useState(false)
  const [emailSentState, setEmailSentState] = useState(false)
  const [emailResponseState, setEmailResponseState] = useState('')

  const [isApartmentState, setIsApartmentState] = useState('house')

  const currentDate = new Date().toISOString().split("T")[0];

  const onSubmit = async (data: formDataType) => {
    const price = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(calculateInspectionPrice(data))

    const { requesterName, requesterEmail, propertyCode, zipCode, city, neighborhood, address, addressNumber, addressComplement, propertyType, propertyArea, hasFurniture, hasCourtyard, effectivenessDate, inspectionType } = data

    const houseType = propertyType === 'house' ? "Casa" : "Apartamento"
    const furniture = hasFurniture === 'semiFurnished' ? "Semimobiliado" : hasFurniture === 'furnished' ? "Mobiliado" : "Sem mobília"
    const courtyard = hasCourtyard === 'yes' ? "Sim" : "Não"
    const inspection = inspectionType === 'entry' ? "Entrada" : "Saída"
    const formattedDate = new Date(effectivenessDate).toLocaleDateString('pt-BR', { timeZone: 'UTC' })

    const messageEmail = `<style>
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }
</style>
<div
    style="display: block; margin: 10px auto; width: 100%; max-width: 860px; padding: 20px; border-radius: 10px; box-shadow: 2px 2px 2px #333333; background-color: #f1f6fd;">
    <p>
        Olá! Meu nome é <b>${requesterName}</b>, acabei de realizar uma simulação no seu site e gostaria de mais
        informações, aqui está o resultado da simulação:
    </p>

    <div style="margin-top: 30px; padding: 10px; border: 1px solid #eee; border-radius: 5px;">
        <div style="position: relative; display: inline-block; width: 100%; height: 70px;">
            <div style="position: absolute; top: 0; left: 0; display: inline-block;">
                <h3 style="display: inline-block;">Dados do cliente</h3>
            </div>

            <div style="float: right; display: block;">
                <div style="display: inline-block; margin-right: 30px;">
                    <p style="color: #03466e; font-weight: 700;"><b>Data de Vigência</b></p>
                    <p>${formattedDate}</p>
                </div>

                <div style="display: inline-block;">
                    <p style="color: #03466e; font-weight: 700;"><b>Tipo de vistoria</b></p>
                    <p>${inspection}</p>
                </div>
            </div>
        </div>

        <div style="display: inline-block; width: 100%;">
            <div style="display: inline-block; width: 40%;">
                <p style="margin-top: 10px; margin-bottom: 5px;"><b>Nome</b>: ${requesterName}</p>
                <p><b>Email</b>: ${requesterEmail}</p>
            </div>

            <div style="float: right; display: block; width: 40%; text-align: center;">
                <p style="color: #03466e; font-weight: 700; font-size: 20px;"><b>Valor da
                        Vistoria</b></p>
                <p style="color: #ed631d; font-weight: 700; font-size: 24px;">${price}</p>
            </div>
        </div>
    </div>

    <div style="margin-top: 15px; padding: 10px; border: 1px solid #eee; border-radius: 5px;">
        <div style="display: inline-block; width: 100%;">
            <h3 style="margin-bottom: 25px;">Endereço do imóvel</h3>
            <p><b>Código do imóvel</b>: ${propertyCode}</p>
            <p><b>CEP</b>: ${zipCode}</p>
            <p><b>Cidade</b>: ${city}</p>
            <p><b>Bairro</b>: ${neighborhood}</p>
            <p><b>Endereço</b>: ${address}</p>
            <p><b>Número</b>: ${addressNumber}</p>
            <p><b>Complemento</b>: ${addressComplement}</p>
        </div>
    </div>
    <div style="margin-top: 15px; padding: 10px; border: 1px solid #eee; border-radius: 5px;">
        <div style="display: inline-block; width: 100%;">
            <h3 style="margin-bottom: 25px;">Dados da vistoria</h3>
            <p><b>Tipo de imóvel</b>: ${houseType}</p>
            <p><b>Área do imóvel</b>: ${propertyArea}m²</p>
            <p><b>Possui mobília</b>: ${furniture}</p>
            <p><b>Possui pátio</b>: ${courtyard}</p>
        </div>
    </div>
</div>`

    const messageWhats = `Olá! Acabei de realizar uma simulação no seu site e gostaria de mais informações, aqui está o resultado da simulação:
    \n*--- Dados do contato ---*\n*Nome*: ${requesterName}\n*Email*: ${requesterEmail}\n\n*--- Dados de endereço ---*\n*CEP*: ${zipCode}\n*Cidade*: ${city}\n*Bairro*: ${neighborhood}\n*Endereço*: ${address}\n*Número*: ${addressNumber}\n*Complemento*: ${addressComplement}\n\n*--- Dados da vistoria ---*\n*Código do imóvel*: ${propertyCode}\n*Tipo de imóvel*: ${houseType}\n*Área do imóvel*: ${propertyArea}m²\n*Possui mobília*: ${furniture}\n*Possui pátio*: ${courtyard}\n*Data de Vigência*: ${formattedDate}\n*Tipo de vistoria*: ${inspection}\n\n*Valor Vistoria: ${price}*`

    const whatsappSend = `https://api.whatsapp.com/send?phone=+55${config.PHONE}&text=${encodeURIComponent(
      messageWhats)}`

    window.open(whatsappSend, '_blank')

    try {
      setSendingEmailState(true)
      const require = await fetch("/api/sendEmail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subject: `Simulação de Vistoria - ${requesterName}`,
          name: requesterName,
          email: requesterEmail,
          message: messageEmail
        })
      })

      const response = await require.json()

      if (response.message === "success") {
        setValue("address", "")
        setValue("addressComplement", "")
        setValue("addressNumber", "")
        setValue("city", "")
        setValue("effectivenessDate", "")
        setValue("hasCourtyard", "0")
        setValue("hasFurniture", "0")
        setValue("inspectionType", "0")
        setValue("neighborhood", "")
        setValue("propertyArea", "")
        setValue("propertyCode", "")
        setValue("propertyType", "0")
        setValue("requesterEmail", "")
        setValue("requesterName", "")
        setValue("zipCode", "")

        setEmailResponseState("E-mail enviado com sucesso!")

        setSendingEmailState(false)
        setEmailSentState(true)

        setTimeout(() => {
          setEmailSentState(false)
          setEmailResponseState("")
        }, 4000)
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

  const handleZipCodeBlur = async (code: string) => {
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

  useEffect(() => {
    if (isApartmentState === "apartment") {
      setValue("hasCourtyard", "no")
    }
  }, [isApartmentState, setValue])

  const handleInputPropertyTypeChange = (target: HTMLInputElement) => {
    setIsApartmentState(target.value)
  }

  return (
    <div className="flex flex-col items-center p-3 sm:p-10">
      {emailSentState && (
        <div className="z-10 fixed bottom-5 right-5 bg-primary text-white p-4 rounded shadow-sm transition-all duration-1000 ease-in-out">{emailResponseState}</div>
      )}

      <h1 className="self-start text-3xl text-pageTitle">Vistorias</h1>
      <span className="block w-full h-2 my-4 bg-secondary" />
      <div className="w-full max-w-3xl grid gap-10 p-5 bg-slate-50 rounded-sm shadow-md xs:grid-cols-2">
        <h2 className="text-xl text-center text-secondary font-bold xs:col-span-2">Faça uma simulação</h2>

        <h2 className="text-lg xs:col-span-2">Dados pessoais</h2>

        <div className="relative flex xs:col-span-2">
          <input
            disabled={sendingEmailState}
            type="text"
            placeholder="Digite o nome do solicitante"
            className={`peer w-full pl-3 pr-1 rounded border p-1 bg-transparent transition-all duration-200 ease-linear ${errors?.requesterName ? 'border-red-500 outline-red-500' : 'border-slate-400 outline-[#ed631d]'}`}
            {...register("requesterName", { required: true })}
          />

          <label className={`absolute left-2 -top-5 mb-0 origin-[0_0] truncate text-sm leading-[1.6] px-1 text-neutral-500`}>Nome do solicitante</label>

          {errors?.requesterName?.type === "required" && (
            <p className="absolute -bottom-4 text-xs text-red-500 font-medium">Nome é obrigatório</p>
          )}
        </div>

        <div className="relative flex xs:col-span-2">
          <input
            disabled={sendingEmailState}
            type="email"
            placeholder="Digite seu melhor e-mail"
            className={`peer w-full pl-3 pr-1 rounded border p-1 bg-transparent transition-all duration-200 ease-linear ${errors?.requesterEmail ? 'border-red-500 outline-red-500' : 'border-slate-400 outline-[#ed631d]'}`}
            {...register("requesterEmail", { required: true, validate: (value) => validator.isEmail(value) })}
          />

          <label className={`absolute left-2 -top-5 mb-0 origin-[0_0] truncate text-sm leading-[1.6] px-1 text-neutral-500`}>E-mail do solicitante</label>

          {errors?.requesterEmail?.type === "required" && (
            <p className="absolute -bottom-4 text-xs text-red-500 font-medium">E-mail é obrigatório</p>
          )}
          {errors?.requesterEmail?.type === "validate" && (
            <p className="absolute -bottom-4 text-xs text-red-500 font-medium">E-mail inválido</p>
          )}
        </div>

        <h2 className="text-lg mt-2 xs:col-span-2">Dados do imóvel para vistoria</h2>

        <div className="relative flex">
          <input
            disabled={sendingEmailState}
            type="number"
            maxLength={10}
            placeholder="Código do imóvel"
            className={`peer w-full pl-3 pr-1 rounded border p-1 bg-transparent transition-all duration-200 ease-linear ${errors?.propertyCode ? 'border-red-500 outline-red-500' : 'border-slate-400 outline-[#ed631d]'}`}
            {...register("propertyCode", { required: true })}
          />

          <label className={`absolute left-2 -top-5 mb-0 origin-[0_0] truncate text-sm leading-[1.6] px-1 text-neutral-500`}>Código do imóvel</label>

          {errors?.propertyCode?.type === "required" && (
            <p className="absolute -bottom-4 text-xs text-red-500 font-medium">Código do imóvel é obrigatório</p>
          )}
        </div>

        <div className="relative flex">
          <InputMask
            disabled={sendingEmailState}
            mask="99999-999"
            placeholder="Digite o CEP do imóvel"
            className={`peer w-full pl-3 pr-1 rounded border p-1 bg-transparent transition-all duration-200 ease-linear ${errors?.zipCode ? 'border-red-500 outline-red-500' : 'border-slate-400 outline-[#ed631d]'}`}
            {...register("zipCode", { required: true, onBlur: (e) => { handleZipCodeBlur(e.target.value.replace('-', '')) } })}
          />

          <label className={`absolute left-2 -top-5 mb-0 origin-[0_0] truncate text-sm leading-[1.6] px-1 text-neutral-500`}>CEP do imóvel</label>

          {errors?.zipCode?.type === "required" && (
            <p className="absolute -bottom-4 text-xs text-red-500 font-medium">CEP é obrigatório</p>
          )}
        </div>

        <div className="relative flex">
          <input
            disabled={sendingEmailState}
            type="text"
            placeholder="Cidade"
            className={`peer w-full pl-3 pr-1 rounded border p-1 bg-transparent transition-all duration-200 ease-linear ${errors?.city ? 'border-red-500 outline-red-500' : 'border-slate-400 outline-[#ed631d]'}`}
            {...register("city", { required: true })}
          />

          <label className={`absolute left-2 -top-5 mb-0 origin-[0_0] truncate text-sm leading-[1.6] px-1 text-neutral-500`}>Cidade</label>

          {errors?.city?.type === "required" && (
            <p className="absolute -bottom-4 text-xs text-red-500 font-medium">Cidade é obrigatório</p>
          )}
        </div>

        <div className="relative flex">
          <input
            disabled={sendingEmailState}
            type="text"
            placeholder="Bairro"
            className={`peer w-full pl-3 pr-1 rounded border p-1 bg-transparent transition-all duration-200 ease-linear ${errors?.requesterName ? 'border-red-500 outline-red-500' : 'border-slate-400 outline-[#ed631d]'}`}
            {...register("neighborhood", { required: true })}
          />

          <label className={`absolute left-2 -top-5 mb-0 origin-[0_0] truncate text-sm leading-[1.6] px-1 text-neutral-500`}>Bairro</label>

          {errors?.neighborhood?.type === "required" && (
            <p className="absolute -bottom-4 text-xs text-red-500 font-medium">Bairro é obrigatório</p>
          )}
        </div>

        <div className="relative flex xs:col-span-2">
          <input
            disabled={sendingEmailState}
            type="text"
            placeholder="Endereço"
            className={`peer w-full pl-3 pr-1 rounded border p-1 bg-transparent transition-all duration-200 ease-linear ${errors?.address ? 'border-red-500 outline-red-500' : 'border-slate-400 outline-[#ed631d]'}`}
            {...register("address", { required: true })}
          />

          <label className={`absolute left-2 -top-5 mb-0 origin-[0_0] truncate text-sm leading-[1.6] px-1 text-neutral-500`}>Endereço</label>

          {errors?.address?.type === "required" && (
            <p className="absolute -bottom-4 text-xs text-red-500 font-medium">Endereço é obrigatório</p>
          )}
        </div>

        <div className="relative flex">
          <input
            disabled={sendingEmailState}
            type="number"
            placeholder="Número"
            className={`peer w-full pl-3 pr-1 rounded border p-1 bg-transparent transition-all duration-200 ease-linear ${errors?.addressNumber ? 'border-red-500 outline-red-500' : 'border-slate-400 outline-[#ed631d]'}`}
            {...register("addressNumber", { required: true })}
          />

          <label className={`absolute left-2 -top-5 mb-0 origin-[0_0] truncate text-sm leading-[1.6] px-1 text-neutral-500`}>Número</label>

          {errors?.addressNumber?.type === "required" && (
            <p className="absolute -bottom-4 text-xs text-red-500 font-medium">Número é obrigatório</p>
          )}
        </div>

        <div className="relative flex">
          <input
            disabled={sendingEmailState}
            type="text"
            placeholder="Complemento"
            className={`peer w-full pl-3 pr-1 rounded border p-1 bg-transparent transition-all duration-200 ease-linear border-slate-400 outline-[#ed631d]`}
            {...register("addressComplement")}
          />

          <label className={`absolute left-2 -top-5 mb-0 origin-[0_0] truncate text-sm leading-[1.6] px-1 text-neutral-500`}>Complemento (opcional)</label>

        </div>

        <div className="relative flex">
          <select
            disabled={sendingEmailState}
            className={`peer w-full pl-3 pr-1 rounded border p-1 bg-transparent transition-all duration-200 ease-linear ${errors?.propertyType ? 'border-red-500 outline-red-500' : 'border-slate-400 outline-[#ed631d]'}`}
            {...register("propertyType", { onChange: (e) => handleInputPropertyTypeChange(e.target), validate: (value) => value !== "0" })}
          >
            <option value="0" selected disabled ></option>
            <option value="apartment">Apartamento</option>
            <option value="house">Casa</option>
          </select>

          <label className={`absolute left-2 -top-5 mb-0 origin-[0_0] truncate text-sm leading-[1.6] px-1 text-neutral-500`}>Tipo de imóvel</label>

          {errors?.propertyType?.type === "validate" && (
            <p className="absolute -bottom-4 text-xs text-red-500 font-medium">Tipo de imóvel é obrigatório</p>
          )}
        </div>

        <div className="relative flex">
          <input
            disabled={sendingEmailState}
            type="number"
            min={1}
            max={999999}
            placeholder="Área do imóvel (m²)"
            className={`peer w-full pl-3 pr-1 rounded border p-1 bg-transparent transition-all duration-200 ease-linear ${errors?.propertyArea ? 'border-red-500 outline-red-500' : 'border-slate-400 outline-[#ed631d]'}`}
            {...register("propertyArea", { required: true, validate: (value) => Number(value) >= 1 && Number(value) <= 999999 })}
          />

          <label className={`absolute left-2 -top-5 mb-0 origin-[0_0] truncate text-sm leading-[1.6] px-1 text-neutral-500`}>Área do imóvel (m²)</label>

          {errors?.propertyArea?.type === "required" && (
            <p className="absolute -bottom-4 text-xs text-red-500 font-medium">Área do imóvel é obrigatório</p>
          )}

          {errors?.propertyArea?.type === "validate" && (
            <p className="absolute -bottom-4 text-xs text-red-500 font-medium">Valores permitidos (1 a 999999)</p>
          )}
        </div>

        <div className="relative flex">
          <select
            disabled={sendingEmailState}
            className={`peer w-full pl-3 pr-1 rounded border p-1 bg-transparent transition-all duration-200 ease-linear ${errors?.hasFurniture ? 'border-red-500 outline-red-500' : 'border-slate-400 outline-[#ed631d]'}`}
            {...register("hasFurniture", { validate: (value) => value !== "0" })}
          >
            <option value="0" selected disabled></option>
            <option value="withoutFurniture">Sem mobília</option>
            <option value="semiFurnished">Semimobiliado</option>
            <option value="furnished">Mobiliado</option>
          </select>

          <label className={`absolute left-2 -top-5 mb-0 origin-[0_0] truncate text-sm leading-[1.6] px-1 text-neutral-500`}>Imóvel possui mobília</label>

          {errors?.hasFurniture?.type === "validate" && (
            <p className="absolute -bottom-4 text-xs text-red-500 font-medium">Selecionar se possui mobília</p>
          )}
        </div>

        <div className="relative flex">
          <select
            disabled={sendingEmailState ? true : isApartmentState === "apartment" ? true : false}
            className={`peer w-full pl-3 pr-1 rounded border p-1 bg-transparent transition-all duration-200 ease-linear ${errors?.hasCourtyard ? 'border-red-500 outline-red-500' : 'border-slate-400 outline-[#ed631d]'}`}
            {...register("hasCourtyard", { validate: (value) => value !== "0" })}
          >
            <option value="0" selected={isApartmentState === "apartment" ? false : true} disabled></option>
            <option value="yes">Sim</option>
            <option value="no" selected={isApartmentState === "apartment" ? true : false}>Não</option>
          </select>

          <label className={`absolute left-2 -top-5 mb-0 origin-[0_0] truncate text-sm leading-[1.6] px-1 text-neutral-500`}>Imóvel possui pátio</label>

          {errors?.hasCourtyard?.type === "validate" && (
            <p className="absolute -bottom-4 text-xs text-red-500 font-medium">Selecionar se possui pátio</p>
          )}
        </div>

        <div className="relative flex">
          <input
            disabled={sendingEmailState}
            type="date"
            placeholder="Data de vigência"
            min={currentDate}
            className={`peer w-full pl-3 pr-1 rounded border p-1 bg-transparent transition-all duration-200 ease-linear ${errors?.effectivenessDate ? 'border-red-500 outline-red-500' : 'border-slate-400 outline-[#ed631d]'}`}
            {...register("effectivenessDate", { required: true, validate: (value) => value >= currentDate })}
          />

          <label className={`absolute left-2 -top-5 mb-0 origin-[0_0] truncate text-sm leading-[1.6] px-1 text-neutral-500`}>Data de vigência</label>

          {errors?.effectivenessDate?.type === "required" && (
            <p className="absolute -bottom-4 text-xs text-red-500 font-medium">Selecionar data de vigência</p>
          )}

          {errors?.effectivenessDate?.type === "validate" && (
            <p className="absolute -bottom-4 text-xs text-red-500 font-medium">A data deve ser igual ou maior que a data atual</p>
          )}
        </div>

        <div className="relative flex">
          <select
            disabled={sendingEmailState}
            className={`peer w-full pl-3 pr-1 rounded border p-1 bg-transparent transition-all duration-200 ease-linear ${errors?.inspectionType ? 'border-red-500 outline-red-500' : 'border-slate-400 outline-[#ed631d]'}`}
            {...register("inspectionType", { validate: (value) => value !== "0" })}
          >
            <option value="0" selected disabled></option>
            <option value="entry">Entrada</option>
            <option value="exit">Saída</option>
          </select>

          <label className={`absolute left-2 -top-5 mb-0 origin-[0_0] truncate text-sm leading-[1.6] px-1 text-neutral-500`}>Tipo de vistoria</label>

          {errors?.inspectionType?.type === "validate" && (
            <p className="absolute -bottom-4 text-xs text-red-500 font-medium">Selecionar tipo de vistoria</p>
          )}
        </div>

        {!sendingEmailState && (
          <button
            onClick={() => handleSubmit(onSubmit)()}
            className="m-auto w-full max-w-xs mt-4 p-2 text-white bg-[#ed631d] rounded-lg hover:bg-hover transition-all duration-300 xs:col-span-2"
          >
            Enviar
          </button>
        )}

        {sendingEmailState && (
          <button
            className="m-auto w-full max-w-xs mt-4 p-2 text-white rounded-lg bg-hover transition-all duration-300 xs:col-span-2 flex justify-center items-center gap-3"
          >
            <AiOutlineLoading size={24} className="animate-spin" /> Enviando...
          </button>
        )}
      </div>
    </div>
  )
}

export type messageTemplates = {
    name: string
    email?: string
    propertyCode: string
    zipCode: string
    city: string
    neighborhood: string
    address: string
    addressNumber: string
    addressComplement: string
    propertyArea: string
    furniture: string
    courtyard: string
    effectivenessDate: string
    inspectionType: string
    pricePlusCostDistance: string
    price: string
    distance: string
    costDistance: string
    comments?: string
    subject?: string
}

export const selectTheCorrectMessage = (data: messageTemplates, isEmailMessage: boolean, calculateDistance: boolean) => {
    if (isEmailMessage && calculateDistance)
        return emailMessageCostDistance(data)
    else if (isEmailMessage)
        return emailMessage(data)
    else if (calculateDistance)
        return whatsappMessageCostDistance(data)
    else
        return whatsappMessage(data)
}

const emailMessage = ({ name, email, propertyCode, zipCode, city, neighborhood, address, addressNumber, addressComplement, propertyArea, furniture, courtyard, effectivenessDate, inspectionType, comments, price }: messageTemplates) => {
    return `<!DOCTYPE html>
    <html lang="pt-BR">

    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>
    </head>

    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: Arial, Helvetica, sans-serif;
        }
    </style>

    <body>
        <div style="margin: 10px auto;
            width: 100%;
            max-width: 860px;
            padding: 20px;
            border-radius: 10px;
            /* box-shadow: 2px 2px 2px #333333;
            background-color: #f3f8fc; */
        ">
            <div style="background-color: #03466e; border-radius: 5px 5px 0 0; padding: 5px 20px;">
                <div style="display: inline-block;">
                    <img src="https://degil.com.br/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fdegil.3cf533d4.jpeg&w=256&q=75"
                        style="width: 150px;">
                </div>
                <div style="display: inline-block; width: calc(100% - 155px); min-width: 260px;">
                    <div style="float: right;">
                        <h3 style="color:#ed631d; margin-bottom: 10px;">Simulação de Vistoria</h3>
                        <p style="color: #f3f8fc;"><b>Nome:</b> ${name}</p>
                        <p style="color: #f3f8fc; margin-top: 5px;"><b>E-mail:</b> ${email}</p>
                    </div>
                    <div style="clear: both;"></div>
                </div>

                <div>
                    <div
                        style="display: inline-block; margin: 10px 10px 0 0; text-align: center; width: 31%; min-width: 160px;">
                        <p style="color: #ed631d; font-weight: 700;"><b>Data de Vigência</b></p>
                        <p style="color: #f3f8fc; font-weight: 700; margin-top: 5px;">${effectivenessDate}</p>
                    </div>

                    <div
                        style="display: inline-block; margin: 10px 10px 0 0; text-align: center; width: 31%; min-width: 140px;">
                        <p style="color: #ed631d; font-weight: 700;"><b>Tipo de Vistoria</b></p>
                        <p style="color: #f3f8fc; font-weight: 700; margin-top: 5px;">${inspectionType}</p>
                    </div>

                    <div
                        style="display: inline-block; margin: 10px 0 0 0; text-align: center; width: 31%; min-width: 126px;">
                        <p style="color: #ed631d;"><b>Valor da Vistoria</b></p>
                        <p style="color: #f3f8fc; margin-top: 5px;"><b>${price}</b></p>
                    </div>
                </div>
            </div>

            <div style="background-color: #f3f8fc; border-radius: 0 0 5px 5px; padding-top: 20px;">
                <div style="padding: 0 10px 10px; border-radius: 5px;">

                    <div style="padding: 10px; border: 1px solid #eee; border-radius: 5px;">
                        <div style="display: inline-block; width: 200px; margin-bottom: 10px;">
                            <h3 style="margin-bottom: 25px; color: #03466e;">Endereço do imóvel</h3>
                            <p style="margin-bottom: 3px;"><b>CEP</b>: ${zipCode}</p>
                            <p style="margin-bottom: 3px;"><b>Cidade</b>: ${city}</p>
                            <p style="margin-bottom: 3px;"><b>Bairro</b>: ${neighborhood}</p>
                        </div>

                        <div style="display: inline-block; width: calc(100% - 205px); min-width: 280px;">
                            <div style="float: right;">
                                <p style="color: #03466e; font-weight: 700; margin-bottom: 25px;"><b>Código do imóvel</b>:
                                    <span style="color: black">${propertyCode}</span>
                                </p>
                                <p style="margin-bottom: 3px;"><b>Endereço</b>: ${address}</p>
                                <p style="margin-bottom: 3px;"><b>Número</b>: ${addressNumber}</p>
                                <p style="margin-bottom: 3px;"><b>Complemento</b>: ${addressComplement}</p>
                            </div>
                        </div>
                        <div style="clear: both;"></div>
                    </div>

                    <div style="padding: 10px; border: 1px solid #eee; border-radius: 5px;">
                        <div style="display: inline-block; margin-bottom: 10px;">
                            <h3 style="margin-bottom: 25px; color: #03466e;">Dados da vistoria</h3>
                            <p style="margin-bottom: 3px;"><b>Área do imóvel</b>: ${propertyArea}m²</p>
                            <p style="margin-bottom: 3px;"><b>Possui mobília</b>: ${furniture}</p>
                            <p style="margin-bottom: 3px;"><b>Possui pátio</b>: ${courtyard}</p>
                            <p style="margin-bottom: 3px; color: #f3f8fc">.</p>
                        </div>
                    </div>

                    <div style="padding: 10px; border: 1px solid #eee; border-radius: 5px;">
                        <div style="display: inline-block; margin-bottom: 10px;">
                            <h3 style="margin-bottom: 25px; color: #03466e;">Observações</h3>
                            <p style="margin-bottom: 3px;">${comments}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </body>

    </html>`
}

const emailMessageCostDistance = ({ name, email, propertyCode, zipCode, city, neighborhood, address, addressNumber, addressComplement, propertyArea, furniture, courtyard, effectivenessDate, inspectionType, comments, price, distance, costDistance, pricePlusCostDistance }: messageTemplates) => {
    return `<!DOCTYPE html>
    <html lang="pt-BR">

    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>
    </head>

    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: Arial, Helvetica, sans-serif;
        }
    </style>

    <body>
        <div style="margin: 10px auto;
            width: 100%;
            max-width: 860px;
            padding: 20px;
            border-radius: 10px;
            /* box-shadow: 2px 2px 2px #333333;
            background-color: #f3f8fc; */
        ">
            <div style="background-color: #03466e; border-radius: 5px 5px 0 0; padding: 5px 20px;">
                <div style="display: inline-block;">
                    <img src="https://degil.com.br/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fdegil.3cf533d4.jpeg&w=256&q=75"
                        style="width: 150px;">
                </div>
                <div style="display: inline-block; width: calc(100% - 155px); min-width: 260px;">
                    <div style="float: right;">
                        <h3 style="color:#ed631d; margin-bottom: 10px;">Simulação de Vistoria</h3>
                        <p style="color: #f3f8fc;"><b>Nome:</b> ${name}</p>
                        <p style="color: #f3f8fc; margin-top: 5px;"><b>E-mail:</b> ${email}</p>
                    </div>
                    <div style="clear: both;"></div>
                </div>

                <div>
                    <div
                        style="display: inline-block; margin: 10px 10px 0 0; text-align: center; width: 31%; min-width: 160px;">
                        <p style="color: #ed631d; font-weight: 700;"><b>Data de Vigência</b></p>
                        <p style="color: #f3f8fc; font-weight: 700; margin-top: 5px;">${effectivenessDate}</p>
                    </div>

                    <div
                        style="display: inline-block; margin: 10px 10px 0 0; text-align: center; width: 31%; min-width: 140px;">
                        <p style="color: #ed631d; font-weight: 700;"><b>Tipo de Vistoria</b></p>
                        <p style="color: #f3f8fc; font-weight: 700; margin-top: 5px;">${inspectionType}</p>
                    </div>

                    <div
                        style="display: inline-block; margin: 10px 0 0 0; text-align: center; width: 31%; min-width: 126px;">
                        <p style="color: #ed631d;"><b>Valor da Vistoria</b></p>
                        <p style="color: #f3f8fc; margin-top: 5px;"><b>${pricePlusCostDistance}</b></p>
                    </div>
                </div>
            </div>

            <div style="background-color: #f3f8fc; border-radius: 0 0 5px 5px; padding-top: 20px;">
                <div style="padding: 0 10px 10px; border-radius: 5px;">

                    <div style="padding: 10px; border: 1px solid #eee; border-radius: 5px;">
                        <div style="display: inline-block; width: 200px; margin-bottom: 10px;">
                            <h3 style="margin-bottom: 25px; color: #03466e;">Endereço do imóvel</h3>
                            <p style="margin-bottom: 3px;"><b>CEP</b>: ${zipCode}</p>
                            <p style="margin-bottom: 3px;"><b>Cidade</b>: ${city}</p>
                            <p style="margin-bottom: 3px;"><b>Bairro</b>: ${neighborhood}</p>
                        </div>

                        <div style="display: inline-block; width: calc(100% - 205px); min-width: 280px;">
                            <div style="float: right;">
                                <p style="color: #03466e; font-weight: 700; margin-bottom: 25px;"><b>Código do imóvel</b>:
                                    <span style="color: black">${propertyCode}</span>
                                </p>
                                <p style="margin-bottom: 3px;"><b>Endereço</b>: ${address}</p>
                                <p style="margin-bottom: 3px;"><b>Número</b>: ${addressNumber}</p>
                                <p style="margin-bottom: 3px;"><b>Complemento</b>: ${addressComplement}</p>
                            </div>
                        </div>
                        <div style="clear: both;"></div>
                    </div>

                    <div style="padding: 10px; border: 1px solid #eee; border-radius: 5px;">
                        <div style="display: inline-block; width: 270px; margin-bottom: 10px;">
                            <h3 style="margin-bottom: 25px; color: #03466e;">Dados da vistoria</h3>
                            <p style="margin-bottom: 3px;"><b>Área do imóvel</b>: ${propertyArea}m²</p>
                            <p style="margin-bottom: 3px;"><b>Possui mobília</b>: ${furniture}</p>
                            <p style="margin-bottom: 3px;"><b>Possui pátio</b>: ${courtyard}</p>
                            <p style="margin-bottom: 3px; color: #f3f8fc">.</p>
                        </div>

                        <div style="display: inline-block; width: calc(100% - 275px); min-width: 280px;">
                            <div style="float: right;">
                                <p style="color: #03466e; font-weight: 700; margin-bottom: 25px;"><b>Observações de
                                        Distância</b>:
                                </p>
                                <p style="margin-bottom: 3px;"><b
                                        title="Distância total (Degil até o imóvel e imóvel até a Degil)">Distância
                                        total</b>: ${distance}</p>
                                <p style="margin-bottom: 3px;"><b>Valor:</b>: ${costDistance}</p>
                                <p style="margin-bottom: 3px;"><b>Valor Vistoria</b>:
                                    ${price}</p>
                                <p style="margin-bottom: 3px;"><b style="color:#ed631d">Total Vistoria + Distância</b>:
                                    ${pricePlusCostDistance}</p>
                            </div>
                        </div>
                        <div style="clear: both;"></div>
                    </div>

                    <div style="padding: 10px; border: 1px solid #eee; border-radius: 5px;">
                        <div style="display: inline-block; margin-bottom: 10px;">
                            <h3 style="margin-bottom: 25px; color: #03466e;">Observações</h3>
                            <p style="margin-bottom: 3px;">${comments}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </body>

    </html>`
}

const whatsappMessage = ({ name, email, propertyCode, zipCode, city, neighborhood, address, addressNumber, addressComplement, propertyArea, furniture, courtyard, effectivenessDate, inspectionType, comments, price }: messageTemplates) => {
    return `Olá! Acabei de realizar uma simulação no seu site e gostaria de mais informações, aqui está o resultado da simulação:
    \n*--- Dados do contato ---*\n*Nome*: ${name}\n*Email*: ${email}\n\n*--- Dados de endereço ---*\n*CEP*: ${zipCode}\n*Cidade*: ${city}\n*Bairro*: ${neighborhood}\n*Endereço*: ${address}\n*Número*: ${addressNumber}\n*Complemento*: ${addressComplement}\n\n*--- Dados da vistoria ---*\n*Código do imóvel*: ${propertyCode}\n*Área do imóvel*: ${propertyArea}m²\n*Possui mobília*: ${furniture}\n*Possui pátio*: ${courtyard}\n*Data de Vigência*: ${effectivenessDate}\n*Tipo de vistoria*: ${inspectionType}\n*Observações*: ${comments}\n\n*Valor Vistoria: ${price}*`
}

const whatsappMessageCostDistance = ({ name, email, propertyCode, zipCode, city, neighborhood, address, addressNumber, addressComplement, propertyArea, furniture, courtyard, effectivenessDate, inspectionType, comments, price, distance, costDistance, pricePlusCostDistance }: messageTemplates) => {
    return `Olá! Acabei de realizar uma simulação no seu site e gostaria de mais informações, aqui está o resultado da simulação:
    \n*--- Dados do contato ---*\n*Nome*: ${name}\n*Email*: ${email}\n\n*--- Dados de endereço ---*\n*CEP*: ${zipCode}\n*Cidade*: ${city}\n*Bairro*: ${neighborhood}\n*Endereço*: ${address}\n*Número*: ${addressNumber}\n*Complemento*: ${addressComplement}\n\n*--- Dados da vistoria ---*\n*Código do imóvel*: ${propertyCode}\n*Área do imóvel*: ${propertyArea}m²\n*Possui mobília*: ${furniture}\n*Possui pátio*: ${courtyard}\n*Data de Vigência*: ${effectivenessDate}\n*Tipo de vistoria*: ${inspectionType}\n*Observações*: ${comments}\n\n*Valor Vistoria*: ${price}\n*Distância*: ${distance}\n*Valor da Distância*: ${costDistance}\n*Total Vistoria + Distância: ${pricePlusCostDistance}*`
}
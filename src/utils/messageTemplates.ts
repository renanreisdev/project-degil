export type messageTemplates = {
    name: string
    email: string
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
    price: string
}

export const emailMessage = ({ name, email, propertyCode, zipCode, city, neighborhood, address, addressNumber, addressComplement, propertyArea, furniture, courtyard, effectivenessDate, inspectionType, price }: messageTemplates) => {
    return `<style>
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }
    </style>
    <div
    style="display: block; margin: 10px auto; width: 100%; max-width: 860px; padding: 20px; border-radius: 10px; box-shadow: 2px 2px 2px #333333; background-color: #f1f6fd;">
    <p>
        Olá! Meu nome é <b>${name}</b>, acabei de realizar uma simulação no seu site e gostaria de mais
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
                    <p>${effectivenessDate}</p>
                </div>

                <div style="display: inline-block;">
                    <p style="color: #03466e; font-weight: 700;"><b>Tipo de vistoria</b></p>
                    <p>${inspectionType}</p>
                </div>
            </div>
        </div>

        <div style="display: inline-block; width: 100%;">
            <div style="display: inline-block; width: 40%;">
                <p style="margin-top: 10px; margin-bottom: 5px;"><b>Nome</b>: ${name}</p>
                <p><b>Email</b>: ${email}</p>
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
            <p><b>Área do imóvel</b>: ${propertyArea}m²</p>
            <p><b>Possui mobília</b>: ${furniture}</p>
            <p><b>Possui pátio</b>: ${courtyard}</p>
        </div>
    </div>
    </div>`
}

export const whatsappMessage = ({ name, email, propertyCode, zipCode, city, neighborhood, address, addressNumber, addressComplement, propertyArea, furniture, courtyard, effectivenessDate, inspectionType, price }: messageTemplates) => {
    return `Olá! Acabei de realizar uma simulação no seu site e gostaria de mais informações, aqui está o resultado da simulação:
    \n*--- Dados do contato ---*\n*Nome*: ${name}\n*Email*: ${email}\n\n*--- Dados de endereço ---*\n*CEP*: ${zipCode}\n*Cidade*: ${city}\n*Bairro*: ${neighborhood}\n*Endereço*: ${address}\n*Número*: ${addressNumber}\n*Complemento*: ${addressComplement}\n\n*--- Dados da vistoria ---*\n*Código do imóvel*: ${propertyCode}\n*Área do imóvel*: ${propertyArea}m²\n*Possui mobília*: ${furniture}\n*Possui pátio*: ${courtyard}\n*Data de Vigência*: ${effectivenessDate}\n*Tipo de vistoria*: ${inspectionType}\n\n*Valor Vistoria: ${price}*`
}
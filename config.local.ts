export const config = {
    PHONE: "51992646568", // celular whatsapp
    INITIAL_M2: 60, // m² inicial
    INITIAL_PRICE: 100, // Preço inicial
    SURPLUS_M2: 1, // Valor do m² excedente
    SEMI_FURNISHED: 0.20, // Valor adicional(%) Semi Mobiliado
    FURNISHED: 0.50, // Valor adicional(%) Mobiliado
    COURTYARD: 0.20, // Valor adicional(%) Pátio

    DISTANCE_MULTIPLIER: 0, // Multiplicar a distância
    // DEFAULT = 0 -> RETORNA A DISTANCIA DA "ORIGEM" PARA O "DESTINO" E DO "DESTINO" PARA A "ORIGEM" E REALIZA A SOMA
    // SE MULTIPLICAR EX.: 2 => RETORNA A DISTANCIA DE "ORIGEM" PARA "DESTINO" E MULTIPLICA PELO MULTIPLICADOR

    CALCULATE_DISTANCE: true, // Calcula a distância entre o imóvel e o endereço
    SHOW_DISTANCE_INFO: true, // Mostra as informações de distância entre o imóvel e o endereço
    DISTANCE_VALUE_EMBEDDED: false, // Valor da distância embutido no valor da vistoria ou separado do valor da vistoria
    VALUE_PER_KM: 1, // Valor em R$ por km
    FREE_MAXIMUM_KM: 10, // Distância maxima para o imóvel ser considerado gratis (em km)

    // Endereço Comercial
    ADDRESS: "Rua São Cristóvão",
    ADDRESS_NUMBER: "94",
    ADDRESS_NEIGHBORHOOD: "Barreiros",
    ADDRESS_CITY: "São José",
    ADDRESS_STATE: "SC",
    ADDRESS_ZIP_CODE: "88117-420"
}
export const config = {
    PHONE: "51992646568", // celular whatsapp
    INITIAL_M2: 60, // m² inicial
    INITIAL_PRICE: 100, // Preço inicial
    SURPLUS_M2: 1, // Valor do m² excedente
    SEMI_FURNISHED: 0.20, // Valor adicional(%) Semi Mobiliado
    FURNISHED: 0.50, // Valor adicional(%) Mobiliado
    COURTYARD: 0.20, // Valor adicional(%) Pátio

    // CALCULO DISTANCIA
    DISTANCE_CALCULATION_MODE: 2, // Utilizar menor distância (0), maior distância (1) ou a média entre as distâncias (2)

    DISTANCE_MULTIPLIER: 0, // Multiplicar a distância
    // (Ex.: 2 Multiplica por 2, como se fosse uma ida e uma volta)
    // ===>>> OBS.: SE DEIXAR O VALOR EM (0), O SISTEMA IRÁ FAZER DUAS PESQUISAS,
    // ===>>> DO LOCAL ATÉ O DESTINO E DO DESTINO ATÉ O LOCAL, E ENTÃO IRÁ SOMAR AS DISTÂNCIAS

    CALCULATE_DISTANCE: true, // Calcula a distância entre o imóvel e o endereço
    SHOW_DISTANCE_INFO: true, // Mostra as informações de distância entre o imóvel e o endereço
    DISTANCE_VALUE_EMBEDDED: true, // Valor da distância embutido no valor da vistoria ou separado do valor da vistoria
    VALUE_PER_KM: 1, // Valor em R$ por km
    FREE_MAXIMUM_KM: 10, // Distância maxima para o imóvel ser considerado gratis (em km)

    // Endereço Comercial
    ADDREES: "Rua São Cristóvão",
    ADDREES_NUMBER: "94",
    ADDREES_NEIGHBORHOOD: "Barreiros",
    ADDREES_CITY: "São José",
    ADDREES_STATE: "SC",
    ADDREES_ZIPCODE: "88117-420"
}
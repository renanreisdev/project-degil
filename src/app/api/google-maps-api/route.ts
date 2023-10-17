// Padrão de mensagem
// "R. São Cristóvão, 94 - Barreiros, São José - SC, 88117-420, Brasil"
//      Endereço, Número - Bairro, Cidade - UF, CEP, País
type dataType = {
    origins: string[],
    destinations: string[]
}

export async function POST(request: Request) {
    const data: dataType = await request.json()
    const origins = data.origins
    const destinations = data.destinations

    try {
        const googleMapsApiKey = process.env.GOOGLE_MAPS_API_KEY
        const url = `https://maps.googleapis.com/maps/api/distancematrix/json?units=km&origins=${origins.join('|')}&destinations=${destinations.join('|')}&key=${googleMapsApiKey}`

        const response = await fetch(url)

        if (response.ok) {
            const res = await response.json()
            const distanceA = Number(res.rows[0].elements[0].distance.text.replace(" km", ""))
            const distanceB = Number(res.rows[1].elements[1].distance.text.replace(" km", ""))
            const totalDistance = distanceA + distanceB

            return new Response(JSON.stringify({
                message: "success",
                totalDistance,
                distanceA,
                distanceB
            }))

        } else {
            return new Response(JSON.stringify({
                message: "error",
                totalDistance: 0,
                distanceA: 0,
                distanceB: 0,
                messageError: response.statusText
            }))
        }
    } catch (error) {
        console.error('Erro ao buscar distâncias:', error)
        return new Response(JSON.stringify({
            message: "error",
            totalDistance: 0,
            distanceA: 0,
            distanceB: 0,
            messageError: error
        }))
    }
}
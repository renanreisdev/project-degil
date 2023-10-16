import puppeteer from "puppeteer-core"
import chromium from "@sparticuz/chromium"

chromium.setHeadlessMode
chromium.setGraphicsMode

import { config } from "../../../../config.local"

type dataType = {
    url: string,
    isFromTo: boolean
}

export const POST = async (request: Request) => {

    const data: dataType = await request.json()
    const url = data.url
    const isFromTo = data.isFromTo

    try {
        const browser = await puppeteer.launch({
            args: chromium.args,
            defaultViewport: chromium.defaultViewport,
            executablePath: await chromium.executablePath(),
            headless: chromium.headless
        })

        const page = await browser.newPage()

        const localAddress = config.ADDREES.replaceAll(" ", "+")
        const localAdressNumber = config.ADDREES_NUMBER
        const localAdressNeighborhood = config.ADDREES_NEIGHBORHOOD.replaceAll(" ", "+")
        const localAdressCity = config.ADDREES_CITY.replaceAll(" ", "+")
        const localAdressState = config.ADDREES_STATE
        const localAdressZipcode = config.ADDREES_ZIPCODE

        const localURL = `${localAddress},+${localAdressNumber}+-+${localAdressNeighborhood},+${localAdressCity}+-+${localAdressState}${localAdressZipcode ? ',+' + localAdressZipcode : ''}`

        console.log("ENDEREÇO: ", localURL)
        console.log("ENDEREÇO DESTINO: ", url)

        if (isFromTo)
            await page.goto(`https://www.google.com.br/maps/dir/${localURL}/${url}/`)
        else
            await page.goto(`https://www.google.com.br/maps/dir/${url}/${localURL}/`)


        const button = 'div[data-travel_mode="0"] button'

        await page.click(button)

        await page.waitForSelector('.XdKEzd') // Classe das DIV que contém as distâncias

        const result = await page.evaluate(() => {
            const divElements = Array.from(document.querySelectorAll('.ivN21e')) // Classe da DIV que contém o BOTÃO no modo CARRO
            return divElements.map(div => div.textContent)
        })

        await browser.close()

        const distances: number[] = result.map((distance: string | null) => {
            if (distance === null) {
                return 0
            } else {
                if (distance.indexOf("km") === -1) {
                    distance = String(distance).replace(" m", "").replace(",", ".")
                    distance = String(Number(distance) / 1000)
                }
                return Number(distance.replace(" km", "").replace(",", "."))
            }
        })

        let distance = 0;

        console.log("Distancia padrão: ", distances)

        if (config.DISTANCE_CALCULATION_MODE === 0) {
            distance = Math.min(...distances)
        }
        else if (config.DISTANCE_CALCULATION_MODE === 1) {
            distance = Math.max(...distances)
        }
        else {
            const sum = distances.reduce((accumulator, value) => accumulator + value, 0)
            distance = sum / distances.length
        }

        distance = Math.round(distance)

        console.log("Distancia Ajustada: ", distance)

        return new Response(JSON.stringify({ message: "success", distance }))
    } catch (error) {
        console.error("Error calculating distance: ", error)
        return new Response(JSON.stringify({ message: "error", distance: 0, messageError: error }))
    }
}
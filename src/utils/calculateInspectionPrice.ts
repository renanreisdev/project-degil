import { config } from '../../config.local'
import { FormDataProps } from '@/app/vistorias/page'

const initialM2 = config.INITIAL_M2
const initialPrice = config.INITIAL_PRICE
const surplusM2 = config.SURPLUS_M2
const semiFurnished = config.SEMI_FURNISHED
const furnished = config.FURNISHED
const courtyard = config.COURTYARD
const calculateTheDistance = config.CALCULATE_DISTANCE
const valuePerKM = config.VALUE_PER_KM

export const calculateInspectionPrice = async (data: FormDataProps, isFromTo: boolean) => {
    const { propertyArea, hasFurniture, hasCourtyard } = data

    const furniture = hasFurniture === 'semiFurnished' ? semiFurnished : hasFurniture === 'furnished' ? furnished : 0
    const totalArea = Number(propertyArea) < initialM2 ? initialM2 : Number(propertyArea)
    const valueCourtyard = hasCourtyard === 'yes' ? courtyard : 0

    let inspectionPrice = (initialPrice + ((totalArea - initialM2) * surplusM2)) * (1 + furniture + valueCourtyard)
    let response = null;
    let costDistance = 0

    if (calculateTheDistance) {
        console.log("Entrou para calcular a distancia...")
        response = await calculateDistance(data, isFromTo)
        console.log("Resposta após o calculo => ", response)
        let distance = response?.distance * (config.DISTANCE_MULTIPLIER > 0 ? config.DISTANCE_MULTIPLIER : 1)

        if (distance >= config.FREE_MAXIMUM_KM) {
            costDistance = distance * valuePerKM
        }
    }

    return { inspectionPrice, costDistance, distance: response?.distance, message: response?.message }
}

const calculateDistance = async (data: FormDataProps, isFromTo: boolean) => {
    const address = data.address.replaceAll(" ", "+")
    const number = data.addressNumber
    const neighborhood = data.neighborhood.replaceAll(" ", "+")
    const city = data.city.replaceAll(" ", "+")
    const state = data.stateCity
    const zipCode = data.zipCode

    const url = `${address},+${number}+-+${neighborhood},+${city}+-+${state}${zipCode ? ',+' + zipCode : ''}`;

    if (address.length === 0) {
        return
    }

    const require = await fetch("/api/calculateDistance", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            url,
            isFromTo
        })
    })

    const response = await require.json()

    return { message: response.message, distance: response.distance, messageError: response.messageError }
}
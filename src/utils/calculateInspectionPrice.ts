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

export const calculateInspectionPrice = async (data: FormDataProps) => {
    const { propertyArea, hasFurniture, hasCourtyard } = data

    const furniture = hasFurniture === 'semiFurnished' ? semiFurnished : hasFurniture === 'furnished' ? furnished : 0
    const totalArea = Number(propertyArea) < initialM2 ? initialM2 : Number(propertyArea)
    const valueCourtyard = hasCourtyard === 'yes' ? courtyard : 0

    let inspectionPrice = (initialPrice + ((totalArea - initialM2) * surplusM2)) * (1 + furniture + valueCourtyard)
    let response = null;
    let costDistance = 0
    let distance = 0;

    if (calculateTheDistance) {
        response = await calculateDistance(data)
        if (config.DISTANCE_MULTIPLIER > 0)
            distance = response?.distanceA * config.DISTANCE_MULTIPLIER
        else
            distance = response?.totalDistance

        if (distance >= config.FREE_MAXIMUM_KM)
            costDistance = distance * valuePerKM

    }

    return { inspectionPrice, costDistance, distance, response }
}

const calculateDistance = async (data: FormDataProps) => {
    const originAddress = config.ADDRESS.replaceAll(" ", "+")
    const originNumber = config.ADDRESS_NUMBER
    const originNeighborhood = config.ADDRESS_NEIGHBORHOOD.replaceAll(" ", "+")
    const originCity = config.ADDRESS_CITY.replaceAll(" ", "+")
    const originState = config.ADDRESS_STATE
    const originZipCode = config.ADDRESS_ZIP_CODE

    const destinationAddress = data.address
    const destinationNumber = data.addressNumber
    const destinationNeighborhood = data.neighborhood
    const destinationCity = data.city
    const destinationState = data.stateCity
    const destinationZipCode = data.zipCode

    const origins = [
        `${originAddress}, ${originNumber} - ${originNeighborhood}, ${originCity} - ${originState}, ${originZipCode}`,
        `${destinationAddress}, ${destinationNumber} - ${destinationNeighborhood}, ${destinationCity} - ${destinationState}, ${destinationZipCode}`,
    ]

    const destinations = [
        `${destinationAddress}, ${destinationNumber} - ${destinationNeighborhood}, ${destinationCity} - ${destinationState}, ${destinationZipCode}`,
        `${originAddress}, ${originNumber} - ${originNeighborhood}, ${originCity} - ${originState}, ${originZipCode}`,
    ]

    if (destinationAddress.length === 0) {
        return
    }

    try {
        const require = await fetch("/api/google-maps-api", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                origins,
                destinations,
            })
        })

        const response = await require.json()

        return response
    } catch (error: any) {
        return { message: "Error", messageError: error }
    }
}
export type formDataType = {
    requesterName: string
    requesterEmail: string
    propertyCode: number
    zipCode: string
    city: string
    neighborhood: string
    address: string
    addressNumber: number
    addressComplement: string
    propertyType: "apartment" | "house"
    propertyArea: number
    hasFurniture: "withoutFurniture" | "semiFurnished" | "furnished"
    hasCourtyard: "yes" | "no"
    effectivenessDate: string
    inspectionType: "entry" | "exit"
}
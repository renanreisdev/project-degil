export type formDataType = {
    requesterName: string
    requesterEmail: string
    propertyCode: number | ""
    zipCode: string
    city: string
    neighborhood: string
    address: string
    addressNumber: number | ""
    addressComplement: string
    propertyType: "apartment" | "house" | "0"
    propertyArea: number | ""
    hasFurniture: "withoutFurniture" | "semiFurnished" | "furnished" | "0"
    hasCourtyard: "yes" | "no" | "0"
    effectivenessDate: string
    inspectionType: "entry" | "exit" | "0"
}
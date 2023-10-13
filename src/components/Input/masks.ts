import { FormEvent } from "react";

export function cep(event: FormEvent<HTMLInputElement>) {
    event.currentTarget.maxLength = 9
    const value = event.currentTarget.value
    value.replace(/\D/g, "")
        .replace(/(\d{5})(\d)/, "$1-$2")
        .replace(/(-\d{3})\d+?$/, "$1");

    event.currentTarget.value = value
    return event
}
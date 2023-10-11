"use client"

import { ContactForm } from "@/components/ContactForm"
import { Services } from "@/components/Services"
import { useContext } from "react"

export default function Home() {
  return (
    <main className="flex flex-col items-center p-3 sm:p-10">
      <h1 className="self-start text-3xl text-pageTitle">Serviços</h1>
      <span className="block w-full h-2 mt-4 mb-6 bg-secondary sm:mb-10" />
      <Services />
      <ContactForm />
    </main>
  )
}

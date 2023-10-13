"use client"

import { ContactForm } from "@/components/ContactForm"
import { MainComponent } from "@/components/MainComponent"
import { PageTitle } from "@/components/PageTitle"
import { Services } from "@/components/Services"

export default function Home() {
  return (
    <MainComponent className="items-center">

      <PageTitle title="Serviços" />
      <Services />
      <ContactForm />

    </MainComponent>
  )
}

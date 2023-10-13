"use client"

import { ContactForm } from "@/components/ContactForm"
import { Header } from "@/components/Header"
import { MainComponent } from "@/components/MainComponent"
import { PageTitle } from "@/components/PageTitle"
import { Services } from "@/components/Services"

export default function Home() {
  return (
    <>
      <Header />
      <MainComponent className="items-center">

        <PageTitle title="Serviços" />
        <Services />
        <ContactForm />

      </MainComponent>
    </>
  )
}

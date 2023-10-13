"use client"

import { useState } from "react"

import Image from "next/image";
import Link from "next/link";
import { AiOutlineMenu, AiOutlineWhatsApp, AiOutlineHome, AiOutlineFileSearch, AiOutlineClose } from 'react-icons/ai';
import logo from "@/assets/degil.png"
import { config } from "../../config.local"
import { LinkComponent } from "./LinkComponet";

export const Header = () => {
    const [nav, setNav] = useState(false);
    const handleNav = () => {
        setNav(!nav);
    };

    return (
        <div className="z-10 fixed top-0 left-0 flex justify-center w-full px-10 shadow-sm shadow-slate-500 bg-primary">
            <header className="flex-1 flex flex-col justify-center items-center max-w-screen-xl bg-primary sm:justify-between sm:flex-row">
                <Link href="/">
                    <Image src={logo} width={168} height={84} alt="Degil Engenharia" />
                </Link>

                {
                    nav ? (
                        <>
                            <AiOutlineClose
                                onClick={handleNav}
                                className="sm:hidden text-white absolute top-6 right-6 z-10"
                                size={30}
                            />

                            <nav className="sm:hidden transition-all duration-1000 py-5 flex flex-col justify-end items-center gap-5 uppercase text-white font-bold">
                                <LinkComponent
                                    model="nav"
                                    href="/"
                                    target="_self"
                                >
                                    <AiOutlineHome size={24} /> Home
                                </LinkComponent>
                                <LinkComponent
                                    model="nav"
                                    href="/vistorias"
                                    target="_self"
                                >
                                    <AiOutlineFileSearch size={24} /> Vistoria
                                </LinkComponent>
                                <LinkComponent
                                    model="nav"
                                    href={`http://wa.me/55${config.PHONE}`}
                                    target="_blank"
                                >
                                    <AiOutlineWhatsApp size={24} /> Contato
                                </LinkComponent>
                            </nav>
                        </>
                    ) : (
                        <>
                            <AiOutlineMenu
                                onClick={handleNav}
                                className="sm:hidden text-white absolute top-6 right-6 z-10"
                                size={30}
                            />
                        </>
                    )
                }

                <nav className="sm:flex hidden flex-1 justify-end items-center gap-5 uppercase text-white font-bold">
                    <LinkComponent
                        model="nav"
                        href="/"
                        target="_self"
                    >
                        <AiOutlineHome size={24} /> Home
                    </LinkComponent>
                    <LinkComponent
                        model="nav"
                        href="/vistorias"
                        target="_self"
                    >
                        <AiOutlineFileSearch size={24} /> Vistoria
                    </LinkComponent>
                    <LinkComponent
                        model="nav"
                        href={`http://wa.me/55${config.PHONE}`}
                        target="_blank"
                    >
                        <AiOutlineWhatsApp size={24} /> Contato
                    </LinkComponent>
                </nav>
            </header>
        </div>
    )
}
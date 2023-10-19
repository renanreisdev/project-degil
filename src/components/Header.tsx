"use client"

import { config } from "../../config.local"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { HiOutlineLightBulb } from 'react-icons/hi'
import { AiOutlineMenu, AiOutlineWhatsApp, AiOutlineHome, AiOutlineFileSearch, AiOutlineClose } from 'react-icons/ai'
import { MdOutlinePendingActions } from 'react-icons/md'

import { LinkComponent } from "./LinkComponent"

import logo from "@/assets/degil.png"

export const Header = () => {
    const [nav, setNav] = useState(false);
    const handleNav = () => {
        setNav(!nav);
    };

    return (
        <div className="z-20 fixed top-0 left-0 flex justify-center w-full px-10 shadow-sm shadow-slate-500 bg-bg-degil bg-cover">
            <header className={`flex-1 flex flex-col justify-center items-center max-w-screen-xl xs:justify-between xs:flex-row`}>
                <Link href="/">
                    <Image src={logo} width={168} height={84} alt="Degil Engenharia" />
                </Link>

                {nav && (
                    <AiOutlineClose
                        onClick={handleNav}
                        className="2md:hidden text-white absolute top-6 right-6 z-20 cursor-pointer"
                        size={30}
                    />
                )}

                {!nav && (
                    <AiOutlineMenu
                        onClick={handleNav}
                        className="2md:hidden text-white absolute top-6 right-6 z-20 cursor-pointer"
                        size={30}
                    />
                )}

                <nav className={`${nav ? '' : 'hidden'} transition-all ease-in-out duration-1000 py-5 2md:flex flex-col justify-end items-center gap-5 uppercase text-white font-bold 2md:flex-row 2md:flex-1`}>
                    <LinkComponent
                        model="nav"
                        href="/"
                        target="_self"
                    >
                        <AiOutlineHome size={20} /> Home
                    </LinkComponent>
                    <LinkComponent
                        model="nav"
                        href="/vistorias"
                        target="_self"
                    >
                        <AiOutlineFileSearch size={20} /> Vistoria
                    </LinkComponent>

                    <LinkComponent
                        model="nav"
                        href="/regularizacao"
                        target="_self"
                    >
                        <MdOutlinePendingActions size={20} /> Regularizações
                    </LinkComponent>

                    <LinkComponent
                        model="nav"
                        href="/consultoria"
                        target="_self"
                    >
                        <HiOutlineLightBulb size={20} /> Consultoria
                    </LinkComponent>
                    <LinkComponent
                        model="nav"
                        href={`http://wa.me/55${config.PHONE}`}
                        target="_blank"
                    >
                        <AiOutlineWhatsApp size={32} className="text-green-500" />
                    </LinkComponent>
                </nav>
            </header>
        </div>
    )
}
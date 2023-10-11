import Link from "next/link"
import { BsFacebook } from "react-icons/bs"

export const Footer = () => {
    return (
        <footer className="mt-40 flex flex-wrap justify-between items-center gap-5 p-5 lg:p-10">
            <cite className="flex-1 min-w-full block leading-relaxed sm:min-w-[282px]">&quot;O sucesso nasce do querer, da determinação e persistência em se chegar a um objetivo. Mesmo não atingindo o alvo, quem busca e vence obstáculos, no mínimo fará coisas admiráveis&quot;. (José de Alencar)</cite>
            <div className="flex flex-col flex-1 justify-center items-center gap-2 min-w-[187px]">
                <Link href={"/privacy-policy"} className="underline">Privacy policy</Link>
                <p>Degil engenharia @2023</p>
            </div>
            <Link
                href={"https://www.facebook.com/degilengenharia"}
                target="_blank"
                className="flex justify-center flex-1 underline text-center"
            >
                <BsFacebook size={24} />
            </Link>
        </footer>
    )
}
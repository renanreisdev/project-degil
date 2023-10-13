import Link from "next/link"

type LinkComponentProps = {
    children: React.ReactNode
    href: string,
    target?: "_self" | "_blank" | "_parent" | "_top"
    model?: "solid" | "outline" | "nav"
}

export const LinkComponent = ({ children, href, target, model }: LinkComponentProps) => {
    return (
        <Link
            href={href}
            target={target}
            className={model === "nav" ? "relative py-1 flex items-center gap-1 transition-all duration-500 hover:text-secondary after:transition-all after:duration-500 after:content-[' '] after:absolute after:w-0 after:h-[2px] after:bg-secondary after:bottom-0 after:left-0 hover:after:w-full" : `px-8 py-4 flex justify-center items-center gap-2 text-center text-sm font-bold rounded ${model === "outline" ? 'bg-transparent border border-hover text-hover hover:text-white' : 'bg-secondary text-white'} transition-all duration-300 hover:bg-hover`}
        >
            {children}
        </Link>
    )
}
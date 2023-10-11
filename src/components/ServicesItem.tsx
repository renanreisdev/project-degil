import Link from "next/link"

type ServicesItemProps = {
    title: string,
    description: string,
    link: string,
    targetBlank?: boolean
}

export const ServicesItem = ({ title, description, link, targetBlank = true }: ServicesItemProps) => {
    return (
        <div className="flex flex-col items-center justify-between h-full px-3 py-4 bg-primary">
            <h1 className="text-center text-lg text-serviceTitle font-bold leading-tight">{title}</h1>
            <p className="my-5 text-center uppercase text-sm text-white font-bold">{description}</p>
            <Link
                href={link}
                target={targetBlank ? '_blank' : '_self'}
                className="px-8 py-4 bg-secondary text-center text-sm font-bold text-white rounded transition-all duration-300 hover:bg-hover"
            >
                SABER MAIS
            </Link>
        </div>
    )
}
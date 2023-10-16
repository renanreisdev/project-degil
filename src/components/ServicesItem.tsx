import { LinkComponent } from "./LinkComponent"

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
            <LinkComponent
                href={link}
                target={targetBlank ? '_blank' : '_self'}
            >
                SABER MAIS
            </LinkComponent>
        </div>
    )
}
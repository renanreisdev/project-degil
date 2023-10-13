export const PageTitle = ({ title }: { title: string }) => {
    return (
        <>
            <h1 className="self-start text-3xl text-primary">{title}</h1>
            <span className="block w-full h-2 my-5 bg-secondary" />
        </>
    )
}
import { config } from "../../config.local"
import { ServicesItem } from "./ServicesItem"

export const Services = () => {

    const data = [
        {
            title: 'Vistorias - Apresentação Comercial',
            description: 'Nossas vistorias são realizadas na forma de laudo fotográfico e descritivo de todos os itens do ambiente, assim como testes mecânicos de portas, armários e janelas e testes hidráulicos e elétricos dos itens pertinentes. Analisamos também área externas, motores, portões, piscinas e banheiras.',
            link: '/regularizacao',
            targetBlank: false
        },
        {
            title: 'Regularização de residências e comércios',
            description: 'Valorize seu imóvel em até 30% e viabilize a venda por financiamento com mudanças simples. Analisamos a situação cadastral, indicamos o melhor processo e aprovamos as mudanças nos órgãos competentes. Obtenha o Laudos dos bombeiros e da vigilância sanitária, garantindo a segurançados seus clientes e do seu negócio.',
            link: '/regularizacao',
            targetBlank: false
        },
        {
            title: 'Consultoria de financiamento imobiliário',
            description: 'Acompanhamos o cliente na aprovação do crédito com dicas para melhorar a pontuação com o banco, auxiliamos na escolha do lote, análise do solo, posição solar, aprovação dos projetos e planilhas para um processo de financiamento saudável e previsível. Não exigimos que a obra seja feita por nós, podemos também administrar mão de obra contratada se o cliente preferir.',
            link: '/consultoria',
            targetBlank: false
        },
    ]

    return (
        <div id="services" className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {data.map((item) => (
                <ServicesItem
                    key={item.title}
                    title={item.title}
                    description={item.description}
                    link={item.link}
                    targetBlank={item.targetBlank}
                />
            ))}
        </div>

    )
}
import { config } from "../../config.local"
import { ServicesItem } from "./ServicesItem"

export const Services = () => {
    const data = [
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
        {
            title: 'Projetos',
            description: 'Auxiliamos na concretização das ideias dos clientes e entendemos que o projeto é o ponto de congruência de todo o processo da obra. Um projeto bem feito garante comunicação clara entre todos os responsáveis, diminuindo o risco e os custos da obra. Utilizamos tanto ferramentas 2D, como 3D, entregando realismo fantástico às ideias.',
            link: `http://wa.me/55${config.PHONE}`,
            targetBlank: true
        },
        {
            title: 'Execução de obras',
            description: 'Oferecemos diversas formas de contrato, tanto para quem gosta de envolver-se mais na obra, como para quem prefere apenas receber os relatórios e reuniões periódicas. Escolhemos os nossos colabores com altos critérios de ética e perícia, tratando-os com respeito e igualdade, o que impacta positivamente no resultado final, garantindo o sucesso do projeto.',
            link: `http://wa.me/55${config.PHONE}`,
            targetBlank: true
        }
    ]

    return (
        <div id="services" className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
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
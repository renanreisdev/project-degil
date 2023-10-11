export default function Consultancy() {
    return (
        <main className="flex flex-col items-center p-10 sm:p-10">
            <h1 className="self-start text-3xl text-pageTitle">
                Consultoria de financiamento imobiliário
            </h1>
            <span className="block w-full h-2 mt-4 mb-6 bg-secondary sm:mb-10" />
            <p className="text-[#03466e] font-semibold leading-relaxed indent-10">
                Gostaria de apresentar a você uma oportunidade única de adquirir a sua casa própria ou
                investimento, com segurança: O <span className="text-secondary font-bold">financiamento de obra</span>.
                Como especialistas no assunto, estamos cientes dos desafios e preocupações que podem surgir ao financiar
                a construção de um imóvel, porém a modalidade oferece uma gama de opções que se adequam à sua realidade
                financeira. Com diferentes tipos de taxas, prazos e formas de pagamento, é possível encontrar um plano
                que se encaixe no seu orçamento. Dessa forma, você pode adquirir o imóvel sem comprometer sua estabilidade
                financeira atual.
            </p>

            <p className="text-[#03466e] font-semibold leading-relaxed indent-10 mt-6">
                Primeira grande vantagem de construir financiado: <span className="text-secondary font-bold">{'"'}Um imóvel é mais caro pelo simples fato de estar pronto{'"'}</span>.
                É por isso que vemos imóveis novos ou próximos de finalizar super valorizados, o construtor tem ali um empreendimento de sucesso, pronto para morar, alugar ou
                vender. Podemos utilizar essa valorização a nosso favor como <span className="text-secondary font-bold">investimento</span>, adquirindo o financiamento,
                executando o empreendimento, vendendo bem antes dos {'"'}35 anos{'"'} e amortizando o financiamento para não pagar os juros e realizar o lucro. Esse é o método que as
                grandes construtoras utilizam para faturar alto e o interessante é que a estratégia adequa-se a sua realidade de orçamento, ou seja, não é necessário ter milhões
                e começar construindo arranha-céus... É possível começar vendendo casas populares. Se você procura uma forma de investimento seguro nós somos os parceiros, por que
                entendemos o processo e já entregamos mais de 300 casas seguindo a estratégia, podemos te auxiliar em todas as etapas.
            </p>

            <p className="text-[#03466e] font-semibold leading-relaxed indent-10 mt-6">
                Se o objetivo do financiamento é a <span className="text-secondary font-bold">casa própria</span> também podemos utilizar o conceito de que construir é mais barato
                do que comprar pronto a nosso favor para baixar o custo do imóvel enquanto entramos na segunda grande vantagem de construir financiando: A
                <span className="text-secondary font-bold">personalização do imóvel</span>. Esse conceito é direto ao ponto, você faz o seu imóvel exatamente voltado as necessidades
                presentes e futuras da sua família e até alguns luxos de escolha, por exemplo: Área gourmet com churrasqueira, piscina, hidromassagem, entre outros. Nós, como especialistas
                no assunto, te auxiliaremos na parte em que talvez você não esteja familiarizado, como: A escolha do terreno ideal, levando em consideração posição solar, estudo do solo,
                orçamentação completa, planejamento das etapas, plano de compras, entre outros serviços indispensáveis para um processo de financiamento
                <span className="text-secondary font-bold">controlado e previsível</span>.
            </p>

            <p className="text-[#03466e] font-semibold leading-relaxed indent-10 mt-6">
                Entre em contato conosco hoje mesmo para discutirmos as opções disponíveis e encontrarmos a melhor solução para você. Estamos prontos para ajudá-lo a dar o próximo passo em
                direção às suas realizações. A seguir uma cartilha de serviços da consultoria de financiamento:
            </p>

            <ul className="grid gap-3 list-disc mt-6 sm:grid-cols-2">
                <li className="text-[#03466e] font-semibold leading-relaxed mx-4">
                    <span className="text-secondary font-bold">Reunião para estudo e orientação do processo:</span><br />Gratuito
                </li>

                <li className="text-[#03466e] font-semibold leading-relaxed mx-4">
                    <span className="text-secondary font-bold">Formulação/preenchimento da planilha PFUI:</span><br />A partir de R$1000
                </li>
            </ul>
        </main>
    )
}
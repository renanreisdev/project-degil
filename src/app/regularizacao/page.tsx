import { LinkComponent } from "@/components/LinkComponent";
import Link from "next/link";

export default function Regularization() {
    return (
        <main className="flex flex-col items-center p-10 sm:p-10">
            <h1 className="self-start text-3xl text-primary">
                Regularização de residências e comércios
            </h1>
            <span className="block w-full h-2 mt-4 mb-6 bg-secondary sm:mb-10" />
            <p className="text-primary font-semibold leading-relaxed indent-10">
                Se você é proprietário de um imóvel, seja ele residência ou comércio, certamente sabe que a regularização de
                é um processo indispensável para garantir a legalidade e a <span className="text-secondary font-bold">valorização do seu patrimônio</span>. E se você ainda
                não regularizou seu imóvel, saiba que está perdendo grandes oportunidades de mercado. Como especialistas em
                regularização e financiamento imobiliário gostaríamos de apresentar a você as vantagens da regularização de
                imóveis e como ela pode ser uma excelente opção de <span className="text-secondary font-bold">investimento</span>.
            </p>

            <p className="text-primary font-semibold leading-relaxed indent-10 mt-6">
                A grande vantagem da regularização é a <span className="text-secondary font-bold">segurança jurídica</span>. Com o imóvel regularizado, você tem a certeza de
                que seu patrimônio está protegido e evita problemas futuros, como multas, embargo de obras, interdição do comércio,
                disputas entre herdeiros, ou mesmo o processo de perda do imóvel para a prefeitura se o IPTU estiver irregular por
                muito tempo. Além de tudo, a segurança jurídica abre portas pra outros benefícios, são eles:
            </p>

            <ul className="list-disc mt-10">
                <li className="text-primary font-semibold leading-relaxed">
                    <span className="text-secondary font-bold">Valorização de até 30%</span> para venda direta do imóvel, até por que há pessoas que buscam a segurança e só
                    compram imóveis com situação regular;
                </li>
                <li className="text-primary font-semibold leading-relaxed my-3">
                    Possibilita a <span className="text-secondary font-bold">tomada de empréstimos bancários</span>, seja para reforma usando o imóvel como garantia, ou mesmo
                    financiando a compra de outro imóvel;
                </li>
                <li className="text-primary font-semibold leading-relaxed">
                    Possibilita a <span className="text-secondary font-bold">venda através de financiamento bancário</span>. Os bancos como instituições financeiras que buscam
                    segurança nos negócios só financiam a compra do imóvel se o mesmo estiver regular e houver responsável
                    técnico pelo processo.
                </li>
            </ul>

            <div className="flex justify-center items-center gap-2 text-primary font-semibold leading-relaxed my-10">
                <p className="indent-10">Para saber mais:</p>
                <LinkComponent
                    model='outline'
                    href='/consultoria'
                    target="_self"
                >
                    CONSULTORIA
                </LinkComponent>
            </div>

            <p className="text-primary font-semibold leading-relaxed indent-10">
                Com as vantagens apresentadas, garanta a segurança e a valorização do seu patrimônio, entre em contato conosco e solicite uma avaliação do seu imóvel.
                Temos a expertise necessária para realizar a regularização com rapidez e eficiência e a seguir te convidamos a analisar a <span className="text-secondary font-bold">Cartilha de serviços:</span>
            </p>

            <ul className="grid gap-3 list-disc mt-6 sm:grid-cols-2">
                <li className="text-primary font-semibold leading-relaxed mx-4">
                    <span className="text-secondary font-bold">Análise da situação cadastral:</span><br />Gratuito
                </li>

                <li className="text-primary font-semibold leading-relaxed mx-4">
                    <span className="text-secondary font-bold">Averbação em matrícula de registro de imóveis:</span><br />A partir de R$1000
                </li>

                <li className="text-primary font-semibold leading-relaxed mx-4">
                    <span className="text-secondary font-bold">Laudo do corpo de bombeiros:</span><br />A partir de R$1000
                </li>

                <li className="text-primary font-semibold leading-relaxed mx-4">
                    <span className="text-secondary font-bold">Projeto técnico da usucapião:</span><br />A partir de R$1500
                </li>

                <li className="text-primary font-semibold leading-relaxed mx-4">
                    <span className="text-secondary font-bold">Laudo da vigilância sanitária:</span><br />A partir de R$1000
                </li>

                <li className="text-primary font-semibold leading-relaxed mx-4">
                    <span className="text-secondary font-bold">Desdobro  ou instituição de condomínio:</span><br />A partir de R$1500
                </li>

                <li className="text-primary font-semibold leading-relaxed mx-4">
                    <span className="text-secondary font-bold">Aprovação do projeto legal de prefeitura:</span><br />A partir de R$1500
                </li>

                <li className="text-primary font-semibold leading-relaxed mx-4">
                    <span className="text-secondary font-bold">Unificação do lote:</span><br />A partir de R$1500
                </li>

                <li className="text-primary font-semibold leading-relaxed mx-4">
                    <span className="text-secondary font-bold">Emissão do alvará de construção:</span><br />A partir de R$1000
                </li>

                <li className="text-primary font-semibold leading-relaxed mx-4">
                    <span className="text-secondary font-bold">Retificação administrativa:</span><br />A partir de R$1500
                </li>

                <li className="text-primary font-semibold leading-relaxed mx-4">
                    <span className="text-secondary font-bold">Emissão do certificado de conclusão de obra &quot;habite-se&quot;:</span><br />A partir de R$1000
                </li>

                <li className="text-primary font-semibold leading-relaxed mx-4">
                    <span className="text-secondary font-bold">Regularização da receita federal:</span><br />A partir de R$1500
                </li>

                <li className="text-primary font-semibold leading-relaxed mx-4">
                    <span className="text-secondary font-bold">Emissão da certidão negativa de débitos:</span><br />A partir de R$1000
                </li>
            </ul>
        </main>
    )
}
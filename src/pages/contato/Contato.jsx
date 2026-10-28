import { useEffect, useState } from "react";
import {
    AlertCircle,
    ArrowUpRight,
    CheckCircle2,
    Send,
} from "lucide-react";
import InteriorPageLayout from "../../layouts/InteriorPageLayout";
import { getContactFieldErrors, validateContactForm } from "../../utils/contactSchema.js";
import { getBasinFormEndpoint, isValidBasinFormEndpoint, submitContactForm } from "../../utils/contactSubmission.js";

const CONTACT_LINKS = [
    {
        label: "GitHub",
        description: "Repositórios, projetos e código",
        href: "https://github.com/kleber-goncalves",
        mark: "GH",
    },
    {
        label: "LinkedIn",
        description: "Perfil profissional e networking",
        href: "https://www.linkedin.com/in/kleber-goncalve-s/",
        mark: "in",
    },
];

const FIELD_CLASS_NAME = [
    "mt-2 w-full rounded-sm border border-graphite bg-obsidian px-4 py-3",
    "font-space text-sm leading-6 text-ivory placeholder:text-steel/70",
    "transition-colors duration-200",
    "focus-visible:border-warm-bronze focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-warm-bronze",
    "disabled:cursor-not-allowed disabled:opacity-60",
].join(" ");

function Contato({ entranceKey = 0, isRouteTransitioning = false, onRouteReady }) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submissionStatus, setSubmissionStatus] = useState(null);
    const [fieldErrors, setFieldErrors] = useState({});
    const basinEndpoint = getBasinFormEndpoint();
    const isBasinFormConfigured = isValidBasinFormEndpoint(basinEndpoint);

    useEffect(() => {
        onRouteReady?.("/contato");
    }, [onRouteReady]);

    const handleFieldChange = (event) => {
        const fieldName = event.currentTarget.name;

        if (!fieldErrors[fieldName]) return;

        setFieldErrors((currentErrors) => {
            const nextErrors = { ...currentErrors };
            delete nextErrors[fieldName];
            return nextErrors;
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!isBasinFormConfigured || isSubmitting) return;

        const form = event.currentTarget;
        const formData = new FormData(form);
        const validation = validateContactForm({
            nome: formData.get("nome"),
            email: formData.get("email"),
            assunto: formData.get("assunto"),
            mensagem: formData.get("mensagem"),
        });

        if (!validation.success) {
            setFieldErrors(getContactFieldErrors(validation.error));
            setSubmissionStatus(null);

            const firstInvalidField = validation.error.issues[0]?.path[0];
            if (typeof firstInvalidField === "string") {
                form.elements.namedItem(firstInvalidField)?.focus();
            }

            return;
        }

        setFieldErrors({});
        setIsSubmitting(true);
        setSubmissionStatus({ type: "pending", message: "Enviando sua mensagem..." });

        // Usa os valores normalizados pelo Zod, mantendo o campo oculto "origem".
        Object.entries(validation.data).forEach(([name, value]) => {
            formData.set(name, value);
        });

        try {
            await submitContactForm(basinEndpoint, formData);

            form.reset();
            setFieldErrors({});
            setSubmissionStatus({
                type: "success",
                message: "Mensagem enviada com sucesso. Obrigado pelo contato!",
            });
        } catch {
            setSubmissionStatus({
                type: "error",
                message: "Não foi possível enviar a mensagem agora. Tente novamente ou use um dos canais alternativos.",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <InteriorPageLayout
            title="Vamos conversar."
            description="Tem uma oportunidade, uma ideia de projeto ou quer conversar sobre desenvolvimento? Entre em contato."
            entranceKey={entranceKey}
            isRouteTransitioning={isRouteTransitioning}
        >
            <section className="mx-auto w-full max-w-7xl px-5 pb-16 b-md:px-10 b-md:pb-24">
                <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1.35fr)_minmax(280px,0.65fr)]">
                    <div className="border border-graphite bg-carbon/40 p-5 b-md:p-8">
                        <div data-route-entrance="content" className="mb-8">
                            <p className="font-space text-[10px] uppercase tracking-[0.2em] text-bronze">
                                Contato direto
                            </p>
                            <h2 className="mt-3 font-space text-2xl font-medium tracking-tight text-ivory b-md:text-3xl">
                                Envie uma mensagem
                            </h2>
                            <p className="mt-3 max-w-xl text-sm leading-6 text-steel">
                                Preencha os campos abaixo. Sua mensagem será encaminhada para o e-mail configurado no formulário.
                            </p>
                        </div>

                        {!isBasinFormConfigured && (
                            <div
                                role="status"
                                className="mb-6 flex items-start gap-3 border border-bronze/40 bg-obsidian/70 p-4"
                            >
                                <AlertCircle aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-bronze" />
                                <p className="text-xs leading-5 text-steel">
                                    O formulário está pronto, mas ainda precisa ser conectado ao endpoint do Basin. Enquanto isso, você pode falar comigo pelo GitHub ou LinkedIn.
                                </p>
                            </div>
                        )}

                        <form
                            action={isBasinFormConfigured ? basinEndpoint : undefined}
                            method="POST"
                            onSubmit={handleSubmit}
                            aria-busy={isSubmitting}
                            className="space-y-5"
                        >
                            <input
                                type="hidden"
                                name="origem"
                                value="KLEBER DEV — página de contato"
                            />

                            <div>
                                <label htmlFor="contact-name" className="font-space text-xs text-ivory">
                                    Nome <span className="text-bronze" aria-hidden="true">*</span>
                                </label>
                                <input
                                    id="contact-name"
                                    name="nome"
                                    type="text"
                                    autoComplete="name"
                                    minLength={2}
                                    maxLength={100}
                                    required
                                    disabled={isSubmitting}
                                    placeholder="Como podemos chamar você?"
                                    aria-invalid={fieldErrors.nome ? "true" : undefined}
                                    aria-describedby={fieldErrors.nome ? "contact-name-error" : undefined}
                                    onChange={handleFieldChange}
                                    className={FIELD_CLASS_NAME}
                                />
                                {fieldErrors.nome && (
                                    <p id="contact-name-error" className="mt-2 text-xs leading-5 text-red-300" aria-live="polite">
                                        {fieldErrors.nome}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="contact-email" className="font-space text-xs text-ivory">
                                    Seu e-mail <span className="text-bronze" aria-hidden="true">*</span>
                                </label>
                                <input
                                    id="contact-email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    maxLength={254}
                                    required
                                    disabled={isSubmitting}
                                    placeholder="voce@exemplo.com"
                                    aria-invalid={fieldErrors.email ? "true" : undefined}
                                    aria-describedby={fieldErrors.email ? "contact-email-error" : undefined}
                                    onChange={handleFieldChange}
                                    className={FIELD_CLASS_NAME}
                                />
                                {fieldErrors.email && (
                                    <p id="contact-email-error" className="mt-2 text-xs leading-5 text-red-300" aria-live="polite">
                                        {fieldErrors.email}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="contact-subject" className="font-space text-xs text-ivory">
                                    Assunto <span className="text-bronze" aria-hidden="true">*</span>
                                </label>
                                <input
                                    id="contact-subject"
                                    name="assunto"
                                    type="text"
                                    minLength={3}
                                    maxLength={120}
                                    required
                                    disabled={isSubmitting}
                                    placeholder="Ex.: Oportunidade profissional"
                                    aria-invalid={fieldErrors.assunto ? "true" : undefined}
                                    aria-describedby={fieldErrors.assunto ? "contact-subject-error" : undefined}
                                    onChange={handleFieldChange}
                                    className={FIELD_CLASS_NAME}
                                />
                                {fieldErrors.assunto && (
                                    <p id="contact-subject-error" className="mt-2 text-xs leading-5 text-red-300" aria-live="polite">
                                        {fieldErrors.assunto}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="contact-message" className="font-space text-xs text-ivory">
                                    Mensagem <span className="text-bronze" aria-hidden="true">*</span>
                                </label>
                                <textarea
                                    id="contact-message"
                                    name="mensagem"
                                    rows={6}
                                    minLength={10}
                                    maxLength={4000}
                                    required
                                    disabled={isSubmitting}
                                    placeholder="Conte um pouco sobre o motivo do contato..."
                                    aria-invalid={fieldErrors.mensagem ? "true" : undefined}
                                    aria-describedby={fieldErrors.mensagem ? "contact-message-error contact-message-hint" : "contact-message-hint"}
                                    onChange={handleFieldChange}
                                    className={FIELD_CLASS_NAME + " resize-y"}
                                />
                                {fieldErrors.mensagem && (
                                    <p id="contact-message-error" className="mt-2 text-xs leading-5 text-red-300" aria-live="polite">
                                        {fieldErrors.mensagem}
                                    </p>
                                )}
                                <p id="contact-message-hint" className="mt-2 text-[10px] leading-4 text-steel">
                                    Não envie senhas ou informações pessoais sensíveis.
                                </p>
                            </div>

                            <button
                                type="submit"
                                disabled={!isBasinFormConfigured || isSubmitting}
                                className="group flex w-full items-center justify-center gap-3 border border-bronze bg-bronze px-5 py-4 font-space text-[11px] font-medium uppercase tracking-[0.16em] text-obsidian transition-colors duration-300 hover:bg-transparent hover:text-bronze focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne focus-visible:ring-offset-2 focus-visible:ring-offset-obsidian disabled:cursor-not-allowed disabled:border-graphite disabled:bg-graphite disabled:text-steel disabled:hover:bg-graphite disabled:hover:text-steel"
                            >
                                {isSubmitting ? "Enviando mensagem" : isBasinFormConfigured ? "Enviar mensagem" : "Formulário em configuração"}
                                <Send aria-hidden="true" className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                            </button>

                            {submissionStatus && (
                                <p
                                    role={submissionStatus.type === "error" ? "alert" : "status"}
                                    aria-live={submissionStatus.type === "error" ? "assertive" : "polite"}
                                    className={[
                                        "flex items-start gap-2 text-xs leading-5",
                                        submissionStatus.type === "success" ? "text-warm-bronze" : "",
                                        submissionStatus.type === "error" ? "text-red-300" : "",
                                        submissionStatus.type === "pending" ? "text-steel" : "",
                                    ].join(" ")}
                                >
                                    {submissionStatus.type === "success" ? (
                                        <CheckCircle2 aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" />
                                    ) : submissionStatus.type === "error" ? (
                                        <AlertCircle aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" />
                                    ) : null}
                                    <span>{submissionStatus.message}</span>
                                </p>
                            )}

                            <p className="text-[10px] leading-5 text-steel">
                                O Basin processa o envio e mantém as submissões no painel conforme o prazo de retenção do plano utilizado.
                            </p>
                        </form>
                    </div>

                    <aside className="space-y-5">
                        <div className="border border-graphite bg-carbon/30 p-5 b-md:p-7">
                            <p data-route-entrance="content" className="font-space text-[10px] uppercase tracking-[0.2em] text-bronze">
                                Outras opções
                            </p>
                            <h2 data-route-entrance="content" className="mt-3 font-space text-xl font-medium text-ivory b-md:text-2xl">
                                Vamos nos conectar
                            </h2>
                            <p data-route-entrance="content" className="mt-3 text-sm leading-6 text-steel">
                                Você também pode conhecer meus projetos ou entrar em contato pelo perfil profissional.
                            </p>

                            <div className="mt-6 space-y-3">
                                {CONTACT_LINKS.map(({ label, description, href, mark }) => (
                                    <a
                                        key={label}
                                        href={href}
                                        target="_blank"
                                        rel="noreferrer"
                                        data-route-entrance="item"
                                        className="group flex items-center gap-4 border border-graphite p-4 transition-colors duration-300 hover:border-bronze focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne"
                                    >
                                        <span className="flex h-10 w-10 shrink-0 items-center justify-center border border-graphite text-bronze transition-colors duration-300 group-hover:border-bronze">
                                            <span className="font-space text-xs font-semibold">{mark}</span>
                                        </span>
                                        <span className="min-w-0 flex-1">
                                            <span className="block font-space text-sm text-ivory">
                                                {label}
                                            </span>
                                            <span className="mt-1 block text-xs leading-5 text-steel">
                                                {description}
                                            </span>
                                        </span>
                                        <ArrowUpRight aria-hidden="true" className="h-4 w-4 shrink-0 text-steel transition-colors group-hover:text-champagne" />
                                    </a>
                                ))}
                            </div>
                        </div>

                        <div className="border border-graphite/80 p-5 b-md:p-7">
                            <div className="flex items-center gap-3">
                                <span className="h-1.5 w-1.5 rounded-full bg-bronze" aria-hidden="true" />
                                <p className="font-space text-[10px] uppercase tracking-[0.2em] text-steel">
                                    Sobre a resposta
                                </p>
                            </div>
                            <p className="mt-4 text-xs leading-6 text-steel">
                                Ao enviar o formulário, informe um e-mail válido para que eu possa responder à sua mensagem.
                            </p>
                        </div>
                    </aside>
                </div>
            </section>
        </InteriorPageLayout>
    );
}

export default Contato;

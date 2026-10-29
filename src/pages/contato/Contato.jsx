import { useEffect, useState } from "react";
import {
    AlertCircle,
    ArrowUpRight,
    CheckCircle2,
    Send,
} from "lucide-react";
import InteriorPageLayout from "../../layouts/InteriorPageLayout";
import {
    getContactFieldErrors,
    validateContactField,
    validateContactForm,
} from "../../utils/contactSchema.js";
import {
    getBasinFormEndpoint,
    isValidBasinFormEndpoint,
    submitContactForm,
} from "../../utils/contactSubmission.js";

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
    "mt-3 block w-full border-0 bg-transparent px-0 py-2",
    "font-space text-lg leading-7 tracking-tight text-ivory placeholder:text-steel/80",
    "transition-colors duration-200",
    "focus:outline-none focus-visible:outline-none",
    "disabled:cursor-not-allowed disabled:opacity-60",
].join(" ");

function getContactFormValues(form) {
    const formData = new FormData(form);

    return {
        nome: formData.get("nome"),
        email: formData.get("email"),
        assunto: formData.get("assunto"),
        mensagem: formData.get("mensagem"),
    };
}

function Contato({ entranceKey = 0, isRouteTransitioning = false, onRouteReady }) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submissionStatus, setSubmissionStatus] = useState(null);
    const [fieldErrors, setFieldErrors] = useState({});
    const [touchedFields, setTouchedFields] = useState({});
    const [hasInteractedWithForm, setHasInteractedWithForm] = useState(false);
    const [isFormValid, setIsFormValid] = useState(false);
    const basinEndpoint = getBasinFormEndpoint();
    const isBasinFormConfigured = isValidBasinFormEndpoint(basinEndpoint);

    useEffect(() => {
        onRouteReady?.("/contato");
    }, [onRouteReady]);

    const updateFieldError = (fieldName, value) => {
        const errorMessage = validateContactField(fieldName, value);

        setFieldErrors((currentErrors) => {
            const nextErrors = { ...currentErrors };

            if (errorMessage) {
                nextErrors[fieldName] = errorMessage;
            } else {
                delete nextErrors[fieldName];
            }

            return nextErrors;
        });
    };

    const updateFormValidity = (form) => {
        if (!form) return;

        const validation = validateContactForm(getContactFormValues(form));

        setHasInteractedWithForm(true);
        setIsFormValid(validation.success);
    };

    const handleFieldChange = (event) => {
        const { name: fieldName, value, form } = event.currentTarget;

        updateFormValidity(form);

        // Depois do primeiro blur (ou de uma tentativa de envio), mantenha
        // o erro atualizado enquanto a pessoa corrige o campo.
        if (touchedFields[fieldName] || fieldErrors[fieldName]) {
            updateFieldError(fieldName, value);
        }

        if (submissionStatus?.type === "error") {
            setSubmissionStatus(null);
        }
    };

    const handleFieldBlur = (event) => {
        const { name: fieldName, value } = event.currentTarget;

        setTouchedFields((currentFields) => ({
            ...currentFields,
            [fieldName]: true,
        }));
        updateFieldError(fieldName, value);
        updateFormValidity(event.currentTarget.form);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!isBasinFormConfigured || isSubmitting) return;

        const form = event.currentTarget;
        const formData = new FormData(form);
        const validation = validateContactForm(getContactFormValues(form));

        setHasInteractedWithForm(true);
        setIsFormValid(validation.success);

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
            setTouchedFields({});
            setHasInteractedWithForm(false);
            setIsFormValid(false);
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
                    <div className="min-w-0">

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
                            className="border-t border-graphite"
                        >
                            <input
                                type="hidden"
                                name="origem"
                                value="KLEBER DEV — página de contato"
                            />

                            <div className="contact-form-field group grid grid-cols-[2rem_minmax(0,1fr)] gap-4 border-b border-graphite py-6 transition-colors duration-500 hover:border-bronze/50 focus-within:border-bronze b-md:grid-cols-[2.5rem_minmax(0,1fr)] b-md:gap-6 b-md:py-8">
                                <span
                                    aria-hidden="true"
                                    className="pt-1 font-bebas text-sm tracking-[0.2em] text-steel/70 transition-colors duration-500 group-hover:text-bronze group-focus-within:text-bronze b-md:pt-1.5"
                                >
                                    01
                                </span>
                                <div className="min-w-0">
                                    <label htmlFor="contact-name" className="block font-space text-lg font-medium leading-tight tracking-tight text-ivory b-md:text-2xl c-lg:text-3xl">
                                        Qual é o seu nome? <span className="text-bronze" aria-hidden="true">*</span>
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
                                        placeholder="Ex.: Kleber Gonçalves"
                                        aria-invalid={fieldErrors.nome ? "true" : undefined}
                                        aria-describedby={fieldErrors.nome ? "contact-name-error" : undefined}
                                        onChange={handleFieldChange}
                                        onBlur={handleFieldBlur}
                                        className={FIELD_CLASS_NAME}
                                    />
                                    {fieldErrors.nome && (
                                        <p id="contact-name-error" className="mt-2 text-xs leading-5 text-red-300" aria-live="polite">
                                            {fieldErrors.nome}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="contact-form-field group grid grid-cols-[2rem_minmax(0,1fr)] gap-4 border-b border-graphite py-6 transition-colors duration-500 hover:border-bronze/50 focus-within:border-bronze b-md:grid-cols-[2.5rem_minmax(0,1fr)] b-md:gap-6 b-md:py-8">
                                <span
                                    aria-hidden="true"
                                    className="pt-1 font-bebas text-sm tracking-[0.2em] text-steel/70 transition-colors duration-500 group-hover:text-bronze group-focus-within:text-bronze b-md:pt-1.5"
                                >
                                    02
                                </span>
                                <div className="min-w-0">
                                    <label htmlFor="contact-email" className="block font-space text-lg font-medium leading-tight tracking-tight text-ivory b-md:text-2xl c-lg:text-3xl">
                                        Qual é o seu e-mail? <span className="text-bronze" aria-hidden="true">*</span>
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
                                        onBlur={handleFieldBlur}
                                        className={FIELD_CLASS_NAME}
                                    />
                                    {fieldErrors.email && (
                                        <p id="contact-email-error" className="mt-2 text-xs leading-5 text-red-300" aria-live="polite">
                                            {fieldErrors.email}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="contact-form-field group grid grid-cols-[2rem_minmax(0,1fr)] gap-4 border-b border-graphite py-6 transition-colors duration-500 hover:border-bronze/50 focus-within:border-bronze b-md:grid-cols-[2.5rem_minmax(0,1fr)] b-md:gap-6 b-md:py-8">
                                <span
                                    aria-hidden="true"
                                    className="pt-1 font-bebas text-sm tracking-[0.2em] text-steel/70 transition-colors duration-500 group-hover:text-bronze group-focus-within:text-bronze b-md:pt-1.5"
                                >
                                    03
                                </span>
                                <div className="min-w-0">
                                    <label htmlFor="contact-subject" className="block font-space text-lg font-medium leading-tight tracking-tight text-ivory b-md:text-2xl c-lg:text-3xl">
                                        Qual é o assunto da mensagem? <span className="text-bronze" aria-hidden="true">*</span>
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
                                        onBlur={handleFieldBlur}
                                        className={FIELD_CLASS_NAME}
                                    />
                                    {fieldErrors.assunto && (
                                        <p id="contact-subject-error" className="mt-2 text-xs leading-5 text-red-300" aria-live="polite">
                                            {fieldErrors.assunto}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="contact-form-field group grid grid-cols-[2rem_minmax(0,1fr)] gap-4 border-b border-graphite py-6 transition-colors duration-500 hover:border-bronze/50 focus-within:border-bronze b-md:grid-cols-[2.5rem_minmax(0,1fr)] b-md:gap-6 b-md:py-8">
                                <span
                                    aria-hidden="true"
                                    className="pt-1 font-bebas text-sm tracking-[0.2em] text-steel/70 transition-colors duration-500 group-hover:text-bronze group-focus-within:text-bronze b-md:pt-1.5"
                                >
                                    04
                                </span>
                                <div className="min-w-0">
                                    <label htmlFor="contact-message" className="block font-space text-lg font-medium leading-tight tracking-tight text-ivory b-md:text-2xl c-lg:text-3xl">
                                        Como posso ajudar você? <span className="text-bronze" aria-hidden="true">*</span>
                                    </label>
                                    <textarea
                                        id="contact-message"
                                        name="mensagem"
                                        rows={4}
                                        minLength={10}
                                        maxLength={4000}
                                        required
                                        disabled={isSubmitting}
                                        placeholder="Conte um pouco sobre o motivo do contato..."
                                        aria-invalid={fieldErrors.mensagem ? "true" : undefined}
                                        aria-describedby={fieldErrors.mensagem ? "contact-message-error contact-message-hint" : "contact-message-hint"}
                                        onChange={handleFieldChange}
                                        onBlur={handleFieldBlur}
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
                            </div>

                            <button
                                type="submit"
                                disabled={
                                    !isBasinFormConfigured
                                    || isSubmitting
                                    || (hasInteractedWithForm && !isFormValid)
                                }
                                className="contact-send-button group mt-8 flex w-full items-center justify-center overflow-hidden border border-bronze bg-bronze px-5 py-4 font-space text-[11px] font-medium uppercase tracking-[0.16em] text-obsidian transition-[background-color,color,transform,border-color] duration-300 hover:bg-transparent hover:text-bronze active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne focus-visible:ring-offset-2 focus-visible:ring-offset-obsidian disabled:cursor-not-allowed disabled:border-graphite disabled:bg-graphite disabled:text-steel disabled:hover:bg-graphite disabled:hover:text-steel"
                            >
                                <span className="contact-send-button__content inline-flex items-center justify-center gap-3">
                                    <span className="contact-send-button__icon-wrapper inline-flex shrink-0 items-center justify-center">
                                        <Send
                                            aria-hidden="true"
                                            className="contact-send-button__icon h-4 w-4"
                                        />
                                    </span>
                                    <span className="contact-send-button__label">
                                        {isSubmitting
                                            ? "Enviando mensagem"
                                            : !isBasinFormConfigured
                                                ? "Formulário em configuração"
                                                : hasInteractedWithForm && !isFormValid
                                                    ? "Complete os campos obrigatórios"
                                                    : "Enviar mensagem"}
                                    </span>
                                </span>
                            </button>

                            {isBasinFormConfigured && hasInteractedWithForm && !isFormValid && !isSubmitting && (
                                <p role="status" aria-live="polite" className="mt-4 text-xs leading-5 text-steel">
                                    Preencha todos os campos corretamente para habilitar o envio.
                                </p>
                            )}

                            {submissionStatus && (
                                <p
                                    role={submissionStatus.type === "error" ? "alert" : "status"}
                                    aria-live={submissionStatus.type === "error" ? "assertive" : "polite"}
                                    className={[
                                        "mt-5 flex items-start gap-2 text-xs leading-5",
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

                        </form>
                    </div>

                    <aside className="space-y-5">
                        <div className=" p-5 b-md:p-7">
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

                        
                    </aside>
                </div>
            </section>
        </InteriorPageLayout>
    );
}

export default Contato;

import { z } from "zod";

export const contactSchema = z.object({
    nome: z.string()
        .trim()
        .min(2, "Informe um nome com pelo menos 2 caracteres.")
        .max(100, "O nome deve ter até 100 caracteres."),
    email: z.string()
        .trim()
        .min(1, "Informe seu e-mail.")
        .max(254, "O e-mail deve ter até 254 caracteres.")
        .pipe(z.email({ error: "Informe um e-mail válido." })),
    assunto: z.string()
        .trim()
        .min(3, "O assunto deve ter pelo menos 3 caracteres.")
        .max(120, "O assunto deve ter até 120 caracteres."),
    mensagem: z.string()
        .trim()
        .min(10, "A mensagem deve ter pelo menos 10 caracteres.")
        .max(4000, "A mensagem deve ter até 4.000 caracteres."),
});

/**
 * Valida e normaliza os valores do formulário antes de enviá-los ao Basin.
 * A validação nativa do HTML continua ativa e o Zod acrescenta regras
 * reutilizáveis; nenhum dos dois substitui validação no servidor.
 */
export function validateContactForm(values) {
    return contactSchema.safeParse(values);
}

export function getContactFieldErrors(error) {
    if (!Array.isArray(error?.issues)) return {};

    return error.issues.reduce((fieldErrors, issue) => {
        const fieldName = issue.path[0];

        if (typeof fieldName === "string" && !fieldErrors[fieldName]) {
            fieldErrors[fieldName] = issue.message;
        }

        return fieldErrors;
    }, {});
}

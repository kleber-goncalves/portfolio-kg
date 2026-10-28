import { describe, expect, it } from "vitest";

import {
    contactSchema,
    getContactFieldErrors,
    validateContactField,
    validateContactForm,
} from "../contactSchema.js";

const validContact = {
    nome: "Kleber Gonçalves",
    email: "kleber@example.com",
    assunto: "Oportunidade profissional",
    mensagem: "Gostaria de conversar sobre uma oportunidade.",
};

describe("contactSchema", () => {
    it("aceita os dados válidos do formulário", () => {
        const result = validateContactForm(validContact);

        expect(result.success).toBe(true);
        if (result.success) {
            expect(result.data).toEqual(validContact);
        }
    });

    it("remove espaços externos e devolve os valores normalizados", () => {
        const result = contactSchema.safeParse({
            ...validContact,
            nome: "  Kleber Gonçalves  ",
            email: "  kleber@example.com  ",
            assunto: "  Projeto novo  ",
            mensagem: "  Podemos conversar sobre o projeto?  ",
        });

        expect(result.success).toBe(true);
        if (result.success) {
            expect(result.data).toEqual({
                nome: "Kleber Gonçalves",
                email: "kleber@example.com",
                assunto: "Projeto novo",
                mensagem: "Podemos conversar sobre o projeto?",
            });
        }
    });

    it.each([
        ["nome", " ", "Informe um nome com pelo menos 2 caracteres."],
        ["nome", "x".repeat(101), "O nome deve ter até 100 caracteres."],
        ["email", "", "Informe seu e-mail."],
        ["email", "endereco-invalido", "Informe um e-mail válido."],
        ["email", `${"a".repeat(245)}@example.com`, "O e-mail deve ter até 254 caracteres."],
        ["assunto", "ab", "O assunto deve ter pelo menos 3 caracteres."],
        ["assunto", "x".repeat(121), "O assunto deve ter até 120 caracteres."],
        ["mensagem", "curto", "A mensagem deve ter pelo menos 10 caracteres."],
        ["mensagem", "x".repeat(4001), "A mensagem deve ter até 4.000 caracteres."],
    ])("rejeita valor inválido em %s", (field, value, expectedMessage) => {
        const result = validateContactForm({
            ...validContact,
            [field]: value,
        });

        expect(result.success).toBe(false);
        if (!result.success) {
            expect(result.error.issues.some((issue) => (
                issue.path[0] === field && issue.message === expectedMessage
            ))).toBe(true);
        }
    });

    it("valida individualmente um campo usando as regras do schema", () => {
        expect(validateContactField("nome", "K")).toBe(
            "Informe um nome com pelo menos 2 caracteres.",
        );
        expect(validateContactField("email", "  kleber@example.com  ")).toBeNull();
        expect(validateContactField("assunto", "ab")).toBe(
            "O assunto deve ter pelo menos 3 caracteres.",
        );
        expect(validateContactField("mensagem", "curto")).toBe(
            "A mensagem deve ter pelo menos 10 caracteres.",
        );
    });

    it("ignora nomes de campo que não fazem parte do schema", () => {
        expect(validateContactField("campoInexistente", "qualquer valor")).toBeNull();
    });

    it("transforma os problemas de validação em mensagens associadas aos campos", () => {
        const result = validateContactForm({
            ...validContact,
            nome: " ",
            assunto: "x",
        });

        expect(result.success).toBe(false);
        if (!result.success) {
            expect(getContactFieldErrors(result.error)).toEqual({
                nome: "Informe um nome com pelo menos 2 caracteres.",
                assunto: "O assunto deve ter pelo menos 3 caracteres.",
            });
        }
    });

    it("retorna um objeto vazio se não receber erros Zod válidos", () => {
        expect(getContactFieldErrors(null)).toEqual({});
        expect(getContactFieldErrors({ issues: "inválido" })).toEqual({});
    });
});

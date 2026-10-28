import { afterEach, describe, expect, it, vi } from "vitest";

import {
    getBasinFormEndpoint,
    isValidBasinFormEndpoint,
    submitContactForm,
} from "../contactSubmission.js";

const VALID_ENDPOINT = "https://usebasin.com/f/testForm_123";

function createFormData() {
    const formData = new FormData();
    formData.set("nome", "Kleber Gonçalves");
    formData.set("email", "kleber@example.com");
    formData.set("assunto", "Contato de teste");
    formData.set("mensagem", "Mensagem válida para testar o envio.");
    formData.set("origem", "KLEBER DEV — página de contato");
    return formData;
}

afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
});

describe("contactSubmission", () => {
    it("lê e remove espaços externos da variável de ambiente", () => {
        vi.stubEnv("VITE_BASIN_FORM_ENDPOINT", ` ${VALID_ENDPOINT} `);

        expect(getBasinFormEndpoint()).toBe(VALID_ENDPOINT);
    });

    it("aceita apenas endpoints HTTPS válidos do Basin", () => {
        expect(isValidBasinFormEndpoint(VALID_ENDPOINT)).toBe(true);
        expect(isValidBasinFormEndpoint(`${VALID_ENDPOINT}/`)).toBe(true);
        expect(isValidBasinFormEndpoint("http://usebasin.com/f/testForm_123")).toBe(false);
        expect(isValidBasinFormEndpoint("https://example.com/f/testForm_123")).toBe(false);
        expect(isValidBasinFormEndpoint("")).toBe(false);
        expect(isValidBasinFormEndpoint(null)).toBe(false);
    });

    it("envia por POST com Accept JSON e preserva os campos do Basin", async () => {
        const fetchImpl = vi.fn().mockResolvedValue({
            ok: true,
            json: vi.fn().mockResolvedValue({ success: true }),
        });
        const formData = createFormData();

        const result = await submitContactForm(VALID_ENDPOINT, formData, fetchImpl);

        expect(result).toEqual({ success: true });
        expect(fetchImpl).toHaveBeenCalledOnce();
        expect(fetchImpl).toHaveBeenCalledWith(VALID_ENDPOINT, {
            method: "POST",
            headers: { Accept: "application/json" },
            body: formData,
        });
        expect(formData.get("email")).toBe("kleber@example.com");
        expect(formData.get("origem")).toBe("KLEBER DEV — página de contato");
    });

    it("não tenta enviar quando o endpoint não é válido", async () => {
        const fetchImpl = vi.fn();

        await expect(submitContactForm("", createFormData(), fetchImpl))
            .rejects.toThrow("Basin endpoint is not configured.");
        expect(fetchImpl).not.toHaveBeenCalled();
    });

    it("considera falhas HTTP como erro de envio", async () => {
        const fetchImpl = vi.fn().mockResolvedValue({
            ok: false,
            json: vi.fn().mockResolvedValue({ success: false }),
        });

        await expect(submitContactForm(VALID_ENDPOINT, createFormData(), fetchImpl))
            .rejects.toThrow("Basin did not accept the submission.");
    });

    it("considera success:false uma rejeição mesmo com HTTP 200", async () => {
        const fetchImpl = vi.fn().mockResolvedValue({
            ok: true,
            json: vi.fn().mockResolvedValue({ success: false }),
        });

        await expect(submitContactForm(VALID_ENDPOINT, createFormData(), fetchImpl))
            .rejects.toThrow("Basin did not accept the submission.");
    });

    it("propaga falhas de rede para o componente tratar", async () => {
        const fetchImpl = vi.fn().mockRejectedValue(new TypeError("Network error"));

        await expect(submitContactForm(VALID_ENDPOINT, createFormData(), fetchImpl))
            .rejects.toThrow("Network error");
    });
});

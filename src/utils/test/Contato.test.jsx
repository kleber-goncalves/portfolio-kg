import { act, createElement } from "react";
import { createRoot } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const VALID_ENDPOINT = "https://usebasin.com/f/testForm_123";

vi.mock("../../layouts/InteriorPageLayout", async () => {
    const { createElement: h } = await import("react");

    return {
        default: ({ children, title }) => h(
            "main",
            null,
            h("h1", null, title),
            children,
        ),
    };
});

let container;
let root;

function setField(name, value) {
    const field = container.querySelector(`[name="${name}"]`);
    if (!field) throw new Error(`Campo não encontrado: ${name}`);
    field.value = value;
}

async function changeField(name, value) {
    const field = container.querySelector(`[name="${name}"]`);
    if (!field) throw new Error(`Campo não encontrado: ${name}`);

    const valueSetter = Object.getOwnPropertyDescriptor(
        Object.getPrototypeOf(field),
        "value",
    )?.set;

    if (valueSetter) {
        valueSetter.call(field, value);
    } else {
        field.value = value;
    }

    await act(async () => {
        field.dispatchEvent(new Event("input", { bubbles: true }));
    });
}

async function blurField(name) {
    const field = container.querySelector(`[name="${name}"]`);
    if (!field) throw new Error(`Campo não encontrado: ${name}`);

    await act(async () => {
        field.dispatchEvent(new FocusEvent("focusout", { bubbles: true }));
    });
}

function fillValidForm() {
    setField("nome", "Kleber Gonçalves");
    setField("email", "kleber@example.com");
    setField("assunto", "Contato de teste");
    setField("mensagem", "Mensagem válida para testar o envio.");
}

async function submitForm() {
    await act(async () => {
        container.querySelector("form").dispatchEvent(
            new Event("submit", { bubbles: true, cancelable: true }),
        );
    });
}

function successResponse() {
    return {
        ok: true,
        json: vi.fn().mockResolvedValue({ success: true }),
    };
}

beforeEach(async () => {
    globalThis.IS_REACT_ACT_ENVIRONMENT = true;
    vi.stubEnv("VITE_BASIN_FORM_ENDPOINT", VALID_ENDPOINT);
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(successResponse()));

    container = document.createElement("div");
    document.body.appendChild(container);
    root = createRoot(container);

    const { default: Contato } = await import("../../pages/contato/Contato.jsx");
    await act(async () => {
        root.render(createElement(Contato));
    });
});

afterEach(async () => {
    if (root) {
        await act(async () => root.unmount());
    }

    container?.remove();
    root = null;
    container = null;
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
});

describe("Contato", () => {
    it("começa habilitado, desabilita enquanto o formulário está inválido e reabilita quando todos os campos são válidos", async () => {
        const submitButton = container.querySelector('button[type="submit"]');

        expect(submitButton.disabled).toBe(false);
        expect(submitButton.classList.contains("contact-send-button")).toBe(true);
        expect(submitButton.querySelector(".contact-send-button__icon-wrapper")).not.toBeNull();
        expect(submitButton.querySelector(".contact-send-button__icon")).not.toBeNull();
        expect(submitButton.querySelector(".contact-send-button__label")?.textContent)
            .toContain("Enviar mensagem");

        await changeField("nome", "K");
        expect(submitButton.disabled).toBe(true);
        expect(submitButton.textContent).toContain("Complete os campos obrigatórios");
        expect(container.textContent).toContain(
            "Preencha todos os campos corretamente para habilitar o envio.",
        );

        await changeField("nome", "Kleber Gonçalves");
        await changeField("email", "kleber@example.com");
        await changeField("assunto", "Oportunidade");
        await changeField("mensagem", "Mensagem válida para testar o envio.");

        expect(submitButton.disabled).toBe(false);
        expect(submitButton.textContent).toContain("Enviar mensagem");

        await changeField("email", "email-invalido");
        expect(submitButton.disabled).toBe(true);

        await changeField("email", "kleber@example.com");
        expect(submitButton.disabled).toBe(false);
    });

    it("preserva a validação nativa do navegador nos campos", () => {
        expect(container.querySelector('[name="nome"]').required).toBe(true);
        expect(container.querySelector('[name="nome"]').minLength).toBe(2);
        expect(container.querySelector('[name="nome"]').maxLength).toBe(100);
        expect(container.querySelector('[name="email"]').type).toBe("email");
        expect(container.querySelector('[name="email"]').required).toBe(true);
        expect(container.querySelector('[name="email"]').maxLength).toBe(254);
        expect(container.querySelector('[name="assunto"]').minLength).toBe(3);
        expect(container.querySelector('[name="assunto"]').maxLength).toBe(120);
        expect(container.querySelector('[name="mensagem"]').minLength).toBe(10);
        expect(container.querySelector('[name="mensagem"]').maxLength).toBe(4000);
    });

    it("organiza os quatro campos em linhas numeradas, com divisórias horizontais e inputs sem caixa", () => {
        const form = container.querySelector("form");
        const fields = [...container.querySelectorAll(".contact-form-field")];

        expect(form.classList.contains("border-t")).toBe(true);
        expect(fields).toHaveLength(4);
        expect(fields.map((field) => (
            field.querySelector('span[aria-hidden="true"]')?.textContent.trim()
        ))).toEqual(["01", "02", "03", "04"]);

        expect(fields.map((field) => (
            field.querySelector("label")?.textContent.replace("*", "").trim()
        ))).toEqual([
            "Qual é o seu nome?",
            "Qual é o seu e-mail?",
            "Qual é o assunto da mensagem?",
            "Como posso ajudar você?",
        ]);

        fields.forEach((field) => {
            expect(field.classList.contains("border-b")).toBe(true);
            expect(field.classList.contains("border-l")).toBe(false);
            expect(field.classList.contains("border-r")).toBe(false);
        });

        container.querySelectorAll('input:not([type="hidden"]), textarea').forEach((field) => {
            expect(field.classList.contains("border-0")).toBe(true);
            expect(field.classList.contains("bg-transparent")).toBe(true);
        });
    });

    it("valida o campo ao perder o foco e limpa o erro quando corrigido", async () => {
        setField("nome", "K");

        await blurField("nome");

        const nameField = container.querySelector('[name="nome"]');
        expect(nameField.getAttribute("aria-invalid")).toBe("true");
        expect(container.textContent).toContain(
            "Informe um nome com pelo menos 2 caracteres.",
        );

        setField("nome", "Kleber Gonçalves");
        await blurField("nome");

        expect(nameField.getAttribute("aria-invalid")).toBeNull();
        expect(container.textContent).not.toContain(
            "Informe um nome com pelo menos 2 caracteres.",
        );
    });

    it("não envia dados inválidos e anuncia o erro do campo", async () => {
        fillValidForm();
        setField("nome", "  ");

        await submitForm();

        expect(globalThis.fetch).not.toHaveBeenCalled();
        expect(container.querySelector('[name="nome"]').getAttribute("aria-invalid")).toBe("true");
        expect(container.textContent).toContain("Informe um nome com pelo menos 2 caracteres.");
    });

    it("envia os valores normalizados com as chaves esperadas pelo Basin", async () => {
        fillValidForm();
        setField("nome", "  Kleber Gonçalves  ");
        setField("email", "  kleber@example.com  ");
        setField("assunto", "  Projeto novo  ");
        setField("mensagem", "  Podemos conversar sobre uma oportunidade?  ");

        await submitForm();

        expect(globalThis.fetch).toHaveBeenCalledOnce();
        const [endpoint, options] = globalThis.fetch.mock.calls[0];
        expect(endpoint).toBe(VALID_ENDPOINT);
        expect(options.method).toBe("POST");
        expect(options.headers).toEqual({ Accept: "application/json" });
        expect(options.body.get("nome")).toBe("Kleber Gonçalves");
        expect(options.body.get("email")).toBe("kleber@example.com");
        expect(options.body.get("assunto")).toBe("Projeto novo");
        expect(options.body.get("mensagem")).toBe("Podemos conversar sobre uma oportunidade?");
        expect(options.body.get("origem")).toBe("KLEBER DEV — página de contato");
        expect(container.textContent).toContain("Mensagem enviada com sucesso.");
        expect(container.querySelector('[name="nome"]').value).toBe("");
    });

    it("mostra uma mensagem acessível quando a requisição falha", async () => {
        globalThis.fetch.mockRejectedValueOnce(new TypeError("Network error"));
        fillValidForm();

        await submitForm();

        expect(container.querySelector('[role="alert"]').textContent)
            .toContain("Não foi possível enviar a mensagem agora.");
    });

    it("impede uma segunda requisição enquanto a primeira está pendente", async () => {
        let resolveFetch;
        globalThis.fetch.mockImplementationOnce(() => new Promise((resolve) => {
            resolveFetch = resolve;
        }));
        fillValidForm();

        await submitForm();
        await submitForm();

        expect(globalThis.fetch).toHaveBeenCalledOnce();
        expect(container.querySelector("button[type='submit']").disabled).toBe(true);

        await act(async () => {
            resolveFetch(successResponse());
        });

        expect(container.textContent).toContain("Mensagem enviada com sucesso.");
    });
});

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { clearExperienceMode, getExperienceMode, isReducedMotion, setExperienceMode } from "../experienceMode.js";

describe("experienceMode", () => {
    beforeEach(() => {
        localStorage.clear();

        Object.defineProperty(window, "matchMedia", {
            configurable: true,
            writable: true,
            value: vi.fn().mockReturnValue({
                matches: false,
            }),
        });
    });

    afterEach(() => {
        localStorage.clear();
        vi.restoreAllMocks();
    });

    it("deve respeitar o modo completo salvo", () => {
        localStorage.setItem("experienceMode", "full");
        window.matchMedia.mockReturnValue({ matches: true });

        expect(getExperienceMode()).toBe("full");
    });

    it("deve respeitar o modo reduzido salvo", () => {
        localStorage.setItem("experienceMode", "reduced");

        expect(getExperienceMode()).toBe("reduced");
    });

    it("deve respeitar a preferência do sistema sem configuração salva", () => {
        window.matchMedia.mockReturnValue({ matches: true });

        expect(getExperienceMode()).toBe("reduced");
    });

    it("deve retornar null quando não há preferência ativa", () => {
        expect(getExperienceMode()).toBeNull();
    });

    it("deve ignorar um modo salvo inválido", () => {
        localStorage.setItem("experienceMode", "invalid");

        expect(getExperienceMode()).toBeNull();
    });

    it("deve salvar uma preferência válida", () => {
        setExperienceMode("reduced");

        expect(localStorage.getItem("experienceMode")).toBe("reduced");
    });

    it("não deve sobrescrever a preferência com um valor inválido", () => {
        localStorage.setItem("experienceMode", "full");

        setExperienceMode("invalid");

        expect(localStorage.getItem("experienceMode")).toBe("full");
    });

    it("deve limpar a preferência salva", () => {
        localStorage.setItem("experienceMode", "full");

        clearExperienceMode();

        expect(localStorage.getItem("experienceMode")).toBeNull();
    });

    it("deve identificar corretamente o modo reduzido", () => {
        localStorage.setItem("experienceMode", "reduced");

        expect(isReducedMotion()).toBe(true);

        localStorage.setItem("experienceMode", "full");

        expect(isReducedMotion()).toBe(false);
    });
});

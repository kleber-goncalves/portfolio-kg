import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
    clearLenisInstance,
    scrollToTarget,
    setLenisInstance,
    startSmoothScroll,
    stopSmoothScroll,
} from "../lenisControl.js";

describe("lenisControl", () => {
    beforeEach(() => {
        setLenisInstance(null);
    });

    afterEach(() => {
        setLenisInstance(null);
        vi.restoreAllMocks();
    });

    it("não falha ao iniciar ou parar quando não existe uma instância Lenis", () => {
        expect(() => startSmoothScroll()).not.toThrow();
        expect(() => stopSmoothScroll()).not.toThrow();
    });

    it("delegates start e stop para a instância registrada", () => {
        const instance = {
            start: vi.fn(),
            stop: vi.fn(),
        };
        setLenisInstance(instance);

        startSmoothScroll();
        stopSmoothScroll();

        expect(instance.start).toHaveBeenCalledOnce();
        expect(instance.stop).toHaveBeenCalledOnce();
    });

    it("só limpa a instância quando a referência recebida é a atual", () => {
        const previousInstance = {
            start: vi.fn(),
            stop: vi.fn(),
        };
        const currentInstance = {
            start: vi.fn(),
            stop: vi.fn(),
        };

        setLenisInstance(currentInstance);
        clearLenisInstance(previousInstance);

        stopSmoothScroll();
        expect(currentInstance.stop).toHaveBeenCalledOnce();

        clearLenisInstance(currentInstance);
        stopSmoothScroll();
        expect(currentInstance.stop).toHaveBeenCalledOnce();
    });

    it("usa Lenis e aplica as opções padrão ao navegar", () => {
        const instance = {
            start: vi.fn(),
            scrollTo: vi.fn(),
        };
        const target = "#projetos";
        setLenisInstance(instance);

        const result = scrollToTarget(target);

        expect(result).toBe(true);
        expect(instance.start).toHaveBeenCalledOnce();
        expect(instance.scrollTo).toHaveBeenCalledWith(target, {
            duration: 1.4,
            offset: 0,
            immediate: false,
            lock: false,
            force: false,
        });
    });

    it("preserva as opções personalizadas ao navegar com Lenis", () => {
        const instance = {
            start: vi.fn(),
            scrollTo: vi.fn(),
        };
        const target = "#stack";
        setLenisInstance(instance);

        scrollToTarget(target, {
            duration: 0.8,
            offset: -72,
            immediate: true,
            lock: true,
            force: true,
            behavior: "auto",
            block: "center",
        });

        expect(instance.scrollTo).toHaveBeenCalledWith(target, {
            duration: 0.8,
            offset: -72,
            immediate: true,
            lock: true,
            force: true,
        });
    });

    it("usa a rolagem nativa para um destino numérico quando Lenis não existe", () => {
        const scrollTo = vi.spyOn(window, "scrollTo").mockImplementation(() => {});

        const result = scrollToTarget(240);

        expect(result).toBe(true);
        expect(scrollTo).toHaveBeenCalledWith({
            top: 240,
            behavior: "smooth",
        });
    });

    it("usa behavior auto na rolagem nativa quando immediate é true", () => {
        const scrollTo = vi.spyOn(window, "scrollTo").mockImplementation(() => {});

        const result = scrollToTarget(0, { immediate: true });

        expect(result).toBe(true);
        expect(scrollTo).toHaveBeenCalledWith({
            top: 0,
            behavior: "auto",
        });
    });

    it("localiza um seletor e rola até o elemento com as opções solicitadas", () => {
        const element = { scrollIntoView: vi.fn() };
        vi.spyOn(document, "querySelector").mockReturnValue(element);

        const result = scrollToTarget("#contato", {
            behavior: "auto",
            block: "center",
        });

        expect(document.querySelector).toHaveBeenCalledWith("#contato");
        expect(element.scrollIntoView).toHaveBeenCalledWith({
            behavior: "auto",
            block: "center",
        });
        expect(result).toBe(true);
    });

    it("aceita diretamente um elemento com scrollIntoView", () => {
        const element = { scrollIntoView: vi.fn() };

        const result = scrollToTarget(element, { block: "end" });

        expect(element.scrollIntoView).toHaveBeenCalledWith({
            behavior: "smooth",
            block: "end",
        });
        expect(result).toBe(true);
    });

    it("retorna false quando o seletor não encontra um elemento", () => {
        vi.spyOn(document, "querySelector").mockReturnValue(null);

        expect(scrollToTarget("#nao-existe")).toBe(false);
    });

    it("retorna false quando o destino não permite scrollIntoView", () => {
        expect(scrollToTarget({})).toBe(false);
    });

    it("usa a rolagem nativa se a instância registrada não tiver scrollTo", () => {
        const scrollTo = vi.spyOn(window, "scrollTo").mockImplementation(() => {});
        setLenisInstance({ start: vi.fn() });

        const result = scrollToTarget(120);

        expect(result).toBe(true);
        expect(scrollTo).toHaveBeenCalledWith({
            top: 120,
            behavior: "smooth",
        });
    });
});

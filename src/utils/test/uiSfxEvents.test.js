import { afterEach, describe, expect, it, vi } from "vitest";

import { requestUiSound } from "../uiSfxEvents.js";

const REQUEST_EVENT = "kleber-dev:ui-sfx-request";

describe("uiSfxEvents", () => {
    afterEach(() => {
        vi.restoreAllMocks();
        vi.unstubAllGlobals();
    });

    it("dispara o evento de solicitação com o cue recebido", () => {
        const listener = vi.fn();
        window.addEventListener(REQUEST_EVENT, listener);

        try {
            requestUiSound("expand");

            expect(listener).toHaveBeenCalledOnce();
            const event = listener.mock.calls[0][0];
            expect(event).toBeInstanceOf(CustomEvent);
            expect(event.type).toBe(REQUEST_EVENT);
            expect(event.detail).toEqual({ cue: "expand" });
        } finally {
            window.removeEventListener(REQUEST_EVENT, listener);
        }
    });

    it("permite qualquer string sem alterar o valor recebido", () => {
        const listener = vi.fn();
        window.addEventListener(REQUEST_EVENT, listener);

        try {
            requestUiSound("");

            expect(listener).toHaveBeenCalledOnce();
            expect(listener.mock.calls[0][0].detail).toEqual({ cue: "" });
        } finally {
            window.removeEventListener(REQUEST_EVENT, listener);
        }
    });

    it.each([undefined, null, 0, 1, false, true, {}, []])(
        "não dispara evento quando cue não é uma string (%s)",
        (cue) => {
            const dispatchEvent = vi.spyOn(window, "dispatchEvent");

            requestUiSound(cue);

            expect(dispatchEvent).not.toHaveBeenCalled();
        },
    );

    it("não lança erro nem dispara evento quando window não está disponível", () => {
        vi.stubGlobal("window", undefined);

        expect(() => requestUiSound("expand")).not.toThrow();
    });
});

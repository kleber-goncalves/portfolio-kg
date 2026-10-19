const UI_SFX_REQUEST_EVENT = "kleber-dev:ui-sfx-request";

/**
 * Envia um pedido de efeito sonoro sem importar o motor de áudio no componente.
 * O listener central em uiSfx.js respeita a preferência e o desbloqueio do áudio.
 */
export function requestUiSound(cue) {
    if (typeof window === "undefined" || typeof cue !== "string") return;

    window.dispatchEvent(new CustomEvent(UI_SFX_REQUEST_EVENT, {
        detail: { cue },
    }));
}

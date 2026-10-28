const BASIN_ENDPOINT_PATTERN = /^https:\/\/usebasin\.com\/f\/[A-Za-z0-9_-]+\/?$/;

export function getBasinFormEndpoint() {
    return (import.meta.env.VITE_BASIN_FORM_ENDPOINT ?? "").trim();
}

export function isValidBasinFormEndpoint(endpoint) {
    return typeof endpoint === "string" && BASIN_ENDPOINT_PATTERN.test(endpoint.trim());
}

/**
 * Envia os dados já validados ao Basin.
 * As proteções e regras de processamento do Basin continuam sob responsabilidade
 * do serviço; esta função apenas trata o contrato HTTP do front-end.
 */
export async function submitContactForm(endpoint, formData, fetchImpl = globalThis.fetch) {
    if (!isValidBasinFormEndpoint(endpoint)) {
        throw new Error("Basin endpoint is not configured.");
    }

    if (typeof fetchImpl !== "function") {
        throw new Error("Fetch is not available.");
    }

    const response = await fetchImpl(endpoint.trim(), {
        method: "POST",
        headers: {
            Accept: "application/json",
        },
        body: formData,
    });
    const payload = await response.json().catch(() => null);

    if (!response.ok || payload?.success === false) {
        throw new Error("Basin did not accept the submission.");
    }

    return payload;
}

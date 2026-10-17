import { mergeConfig } from "vite";
import baseConfig from "./vite.config.js";
import { visualizer } from "rollup-plugin-visualizer";

// Configuração exclusiva de diagnóstico. Não é usada pelo build normal.
export default mergeConfig(baseConfig, {
    build: {
        // Source maps permitem atribuir trechos executados a arquivos/módulos originais.
        sourcemap: true,
    },
    plugins: [
        visualizer({
            filename: "bundle-analysis.html",
            template: "treemap",
            gzipSize: true,
            brotliSize: true,
            open: false,
            emitFile: true,
        }),
    ],
});

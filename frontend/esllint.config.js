// eslint.config.js

import globals from "globals";
import js from "@eslint/js";
import pluginReact from "eslint-plugin-react";
import pluginReactHooks from "eslint-plugin-react-hooks";
import pluginReactRefresh from "eslint-plugin-react-refresh";

export default [
    {
        // 1. CONFIGURACIÓN BASE: Ignorar archivos
        ignores: ["dist", "node_modules", "backend/**/*.js", "backend/**/*.ts"],
    },
    js.configs.recommended,
    {
        // 2. CONFIGURACIÓN DE LENGUAJE Y ENTORNOS
        languageOptions: {
            parserOptions: {
                ecmaFeatures: {
                    jsx: true,
                },
                ecmaVersion: 'latest',
                sourceType: 'module',
            },
            globals: {
                ...globals.browser,
                ...globals.node,
                // Agrega variables globales de Vite/React si es necesario
            },
        },
    },
    {
        // 3. CONFIGURACIÓN DE REACT
        files: ["**/*.{js,jsx,mjs,cjs,ts,tsx}"],
        plugins: {
            "react": pluginReact,
            "react-hooks": pluginReactHooks,
            "react-refresh": pluginReactRefresh,
        },
        rules: {
            // Reglas de React recomendadas
            ...pluginReact.configs.recommended.rules,
            
            // Reglas específicas de React Hooks
            ...pluginReactHooks.configs.recommended.rules,
            
            // Reglas para Hot Reloading de Vite
            "react-refresh/only-export-components": [
                "warn",
                { allowConstantExport: true },
            ],
            
            // ===============================================
            // 4. ANULACIÓN DE REGLAS DE FORMATO (PARA EVITAR CONFLICTOS)
            // Desactiva las reglas que causan el error "Delete/Replace" de Prettier/ESLint.
            // Esto le permite a tu formateador (si lo usas) o a ti mismo definir el estilo libremente.
            // ===============================================
            "indent": "off",            // Desactiva la regla de indentación
            "semi": "off",              // Desactiva la regla de punto y coma
            "quotes": "off",            // Desactiva la regla de comillas
            "comma-dangle": "off",      // Desactiva la regla de comas colgantes
            "space-before-function-paren": "off", // Desactiva el espaciado en funciones
            "key-spacing": "off",       // Desactiva el espaciado en objetos

            // Si llegaste a tener la dependencia de prettier-plugin, esto lo deshabilita:
            "prettier/prettier": "off", 
        }
    }
];
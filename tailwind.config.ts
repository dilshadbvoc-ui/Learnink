import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "#f0f4f8",
                foreground: "#1a1a1a",
                primary: {
                    DEFAULT: "#5B4B9E",
                    dark: "#4A3D82",
                    light: "#7B6BB8",
                },
                secondary: "#4A90E2",
                tertiary: "#50E3C2",
                quaternary: "#9B8BC8",
                accent: {
                    DEFAULT: "#2d3748",
                    light: "#4a5568",
                    dark: "#1a202c",
                },
                selection: "#5B4B9E",
                success: "#10b981",
                warning: "#f59e0b",
                danger: "#ef4444",
            },
            fontFamily: {
                sans: ["var(--font-geist-sans)"],
                mono: ["var(--font-geist-mono)"],
            },
            keyframes: {
                fadeIn: {
                    "0%": { opacity: "0", transform: "translateY(10px)" },
                    "100%": { opacity: "1", transform: "translateY(0)" },
                },
                slideUp: {
                    "0%": { opacity: "0", transform: "translateY(20px)" },
                    "100%": { opacity: "1", transform: "translateY(0)" },
                },
                float: {
                    "0%, 100%": { transform: "translateY(0px) rotate(0deg)" },
                    "50%": { transform: "translateY(-10px) rotate(2deg)" },
                },
                "float-reverse": {
                    "0%, 100%": { transform: "translateY(0px) rotate(0deg)" },
                    "50%": { transform: "translateY(10px) rotate(-2deg)" },
                },
                shine: {
                    "0%": { left: "-100%" },
                    "100%": { left: "100%" },
                },
                pulseGlow: {
                    "0%, 100%": { boxShadow: "0 0 20px -5px #5B4B9E" },
                    "50%": { boxShadow: "0 0 40px -5px #5B4B9E" },
                },
            },
            animation: {
                "fade-in": "fadeIn 0.8s cubic-bezier(0.2, 1, 0.3, 1) forwards",
                "slide-up": "slideUp 0.6s cubic-bezier(0.2, 1, 0.3, 1) forwards",
                float: "float 6s ease-in-out infinite",
                "float-reverse": "float-reverse 7s ease-in-out infinite",
                shine: "shine 3s infinite",
                "pulse-glow": "pulseGlow 2s ease-in-out infinite",
            },
        },
    },
    plugins: [],
};
export default config;

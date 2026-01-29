/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "../auth-app/src/**/*.{js,jsx,ts,tsx}", // Adicionar para auth-app
    "../consorcio-app/src/**/*.{js,jsx,ts,tsx}", // Adicionar para consorcio-app
    "../cotas-app/src/**/*.{js,jsx,ts,tsx}", // Adicionar para cotas-app (se existir)
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};

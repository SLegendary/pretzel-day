# 🥨 Pretzel Day — El Dunder-Aleatorizador

> *"I wake up every morning in a bed that's too small, drive my daughter to a school that's too expensive, and then I go to work to a job for which I get paid too little. But on Pretzel Day? Well, I like Pretzel Day."*  
> — **Stanley Hudson**

[![Deploy to GitHub Pages](https://github.com/SLegendary/pretzel-day/actions/workflows/deploy.yml/badge.svg)](https://github.com/SLegendary/pretzel-day/actions/workflows/deploy.yml)
[![React](https://img.shields.io/badge/React-19-blue.svg?logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF.svg?logo=vite)](https://vite.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-blue.svg?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC.svg?logo=tailwind-css)](https://tailwindcss.com/)

**Pretzel Day** (El Dunder-Aleatorizador) es una aplicación web interactiva diseñada para fanáticos de **The Office (US)** que no saben qué episodio ver hoy. Inspirada en la estética corporativa de Dunder Mifflin Scranton, ofrece una ruleta inteligente de episodios con filtros temáticos, catálogo exploratorio, frases memorables, efectos de sonido y confeti.

🌐 **Demo en vivo:** [https://slegendary.github.io/pretzel-day/](https://slegendary.github.io/pretzel-day/)

---

## ✨ Características Principales

- 🎲 **Ruleta de Episodios Interactiva**: Animación de giro en tiempo real con selección aleatoria, efectos de sonido y lluvia de confeti al descubrir el episodio seleccionado.
- 🎯 **Filtros Avanzados y Personalizados**:
  - **Por Época**: Toda la serie, la icónica *Era Michael Scott* (Temporadas 1–7) o *Post-Michael* (Temporadas 8–9).
  - **Por Temporadas**: Selección individual o grupal de temporadas (1 a 9).
  - **Por Calificación IMDb**: Filtra episodios legendarios con puntuaciones mayores a 8.0, 8.5 o 9.0.
  - **Etiquetas Temáticas**: Bromas de Jim, Cenas Incómodas (*Dinner Party*), Pretzel Day, Dundies, Jim & Pam, Dwight, etc.
  - **Exclusión de Episodios Vistos**: Evita repetir episodios vistos en tu sesión actual.
- 📖 **Explorador y Buscador de Catálogo**: Busca por título en español o inglés, sinopsis o personajes con filtros interactivos.
- 📜 **Historial de Reproducción**: Guarda los episodios generados directamente en `localStorage` con la opción de limpiar o revisar tu actividad.
- 🔊 **Efectos de Audio y Animaciones**: Generador de sonido sintético con Web Audio API (sin dependencias externas de audio) y botón para silenciar/activar en la cabecera.
- 📱 **Diseño Responsivo y Temático**: Interfaz moderna inspirada en Dunder Mifflin, completamente adaptada a móviles, tablets y escritorios.

---

## 🛠️ Stack Tecnológico

- **Frontend:** [React 19](https://react.dev/) con Hooks avanzados (`useMemo`, `useCallback`, `useState`, `useEffect`).
- **Empaquetador & Dev Server:** [Vite 8](https://vite.dev/) con soporte HMR ultrarrápido.
- **Tipado Estático:** [TypeScript](https://www.typescriptlang.org/).
- **Estilos:** [Tailwind CSS v4](https://tailwindcss.com/) con diseño utilitario y animaciones fluidas.
- **Iconografía:** [Lucide React](https://lucide.dev/).
- **Efectos Visuales:** [Canvas Confetti](https://www.npmjs.com/package/canvas-confetti).
- **Linter:** [Oxlint](https://oxc.rs/) para análisis estático veloz.
- **CI/CD:** [GitHub Actions](https://github.com/features/actions) para compilación y despliegue continuo en **GitHub Pages**.

---

## 🚀 Instalación y Desarrollo Local

### Requisitos previos
- [Node.js](https://nodejs.org/) v20 o superior
- [npm](https://www.npmjs.com/) v9 o superior

### Pasos

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/SLegendary/pretzel-day.git
   cd pretzel-day
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Iniciar el servidor de desarrollo:**
   ```bash
   npm run dev
   ```
   Abre [http://localhost:5173](http://localhost:5173) en tu navegador para ver la aplicación.

4. **Compilar para producción:**
   ```bash
   npm run build
   ```

5. **Previsualizar la compilación local:**
   ```bash
   npm run preview
   ```

6. **Ejecutar el linter:**
   ```bash
   npm run lint
   ```

---

## 📦 Despliegue en GitHub Pages

Este proyecto incluye un flujo de trabajo automatizado en [.github/workflows/deploy.yml](.github/workflows/deploy.yml).

### Requisito para desplegar en tu repositorio:
1. Dirígete a tu repositorio en GitHub: **Settings** → **Pages**.
2. En la sección **Build and deployment** → **Source**, selecciona **GitHub Actions**.
3. Cada vez que hagas `git push` a la rama `main`, la aplicación se compilará y se publicará automáticamente en:
   ```
   https://<tu-usuario>.github.io/pretzel-day/
   ```

---

## 📄 Estructura del Proyecto

```text
pretzel-day/
├── .github/
│   └── workflows/
│       └── deploy.yml          # Flujo de CI/CD para GitHub Pages
├── public/                     # Recursos estáticos
├── src/
│   ├── components/             # Componentes React (Roulette, Filters, Cards, Modals)
│   ├── data/                   # Base de datos completa de episodios (episodes.ts)
│   ├── types/                  # Definiciones de TypeScript
│   ├── utils/                  # Generador de sonidos y utilidades
│   ├── App.tsx                 # Componente principal y gestión de estado
│   ├── main.tsx                # Entrada de la aplicación React
│   └── index.css               # Estilos globales y Tailwind
├── package.json
├── tsconfig.json
└── vite.config.ts              # Configuración de Vite con base path relativo
```

---

## ☕ Créditos & Licencia

Este es un proyecto tributo sin fines de lucro creado por fans para fans de **The Office (US)** (creado por Greg Daniels, Ricky Gervais y Stephen Merchant, propiedad de NBCUniversal).

*"Limitless paper in a paperless world."* — Dunder Mifflin Paper Company, Scranton Branch.

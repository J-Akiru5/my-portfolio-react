# React + Vite
## Current development stage

This portfolio is in active development. The core React + Vite setup is complete and HMR is working. Key UI sections and routing are scaffolded; several components and styles are implemented, but content, responsive polish, and some accessibility improvements are still in progress.

## Implemented features

- Routing and basic navigation
- Home, About, Projects, and Contact pages (skeleton/content in place)
- Component-driven layout with reusable header/footer
- ESLint and Prettier configured for consistent code style
- Vite dev server with fast refresh

## Running locally

1. Install dependencies:
  `npm install` or `yarn`
2. Start development server:
  `npm run dev` or `yarn dev`
3. Build for production:
  `npm run build` or `yarn build`
4. Preview production build:
  `npm run preview` or `yarn preview`

## Available scripts

- `dev` — start Vite dev server
- `build` — create production build
- `preview` — preview production build locally
- `lint` — run ESLint
- `format` — run Prettier

## Roadmap / TODO

- Finalize project content and case studies
- Responsive and accessibility improvements (ARIA, keyboard nav)
- Add unit/integration tests
- Integrate CMS or MDX for easier content updates
- CI/CD pipeline and automated deployments

## Known issues

- Some components need layout refinement on small screens
- Minor ESLint warnings remain for in-progress files

## Contributing

Fork the repo, create a branch for your feature/fix, and open a PR with a short description. Follow the existing lint and formatting rules.

## Contact

Open an issue or PR in this repository for feedback or questions.
This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

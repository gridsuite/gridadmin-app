# GridAdmin-App

[![MPL-2.0 License](https://img.shields.io/badge/license-MPL_2.0-blue.svg)](https://www.mozilla.org/en-US/MPL/2.0/)

## Description

The **gridadmin-app** is the administration front-end of the [GridSuite](https://github.com/gridsuite) platform. It is the UI consumed by administrators on top of the [`user-admin-server`](https://github.com/gridsuite/user-admin-server) microservice, and provides:

- **User management**: list, search, create, edit and delete users identified by their OIDC `sub`; grant or revoke `admin` rights.
- **User profiles**: create named profiles bundling parameter sets (LoadFlow, Security Analysis, Sensitivity Analysis, Short Circuit, Voltage Init, etc.) and per-profile operation quotas, and assign them to users.
- **User groups**: create groups and manage their many-to-many membership with users.
- **Announcements**: create, schedule and delete time-windowed system-wide announcements broadcast to all connected users.

This app uses the [commons-ui](https://github.com/gridsuite/commons-ui) library which is released on npmjs.

## Technical Stack

- React + TypeScript, built with Vite
- Redux Toolkit (RTK) for state management
- MUI (Material UI) for the component library
- ag-grid for tabular data (users, groups, profiles)
- react-hook-form + yup for forms and validation
- react-intl for i18n
- Jest for unit tests

## Interactions with Other Services

```
┌─────────────────┐
│  gridadmin-app  │──► user-admin-server   (users, profiles, groups, quotas, announcements)
└─────────────────┘
```

## Getting started

To launch the app type `npm install` then `npm start`.

##### Development Scripts

- **`npm run type-check`** - Runs TypeScript type checking without emitting files. This ensures all developers use the project's local TypeScript version from `node_modules` rather than a potentially different globally-installed version. Run this to verify your code has no type errors before committing.

- **`npm run build`** - Builds the app. Note: This automatically runs `npm run prebuild` first.

- **`npm run prebuild`** - Runs linting and type checking before the build. This script is executed automatically by npm before `npm run build` and ensures that the build is not executed if linting or type checking fails. You don't need to call this manually unless you want to verify code quality without building.

## Front-End Architecture

The code under `src` is organised as follows:

- **`components/`** - Shared, generic UI building blocks, independent of any specific business page (e.g. the top-level `App` component, the `Grid` wrapper around ag-grid).
- **`pages/`** - One folder per business feature/screen: `users`, `groups`, `profiles`, `announcements`, plus `common` for elements shared across those pages. This is where most of the application logic and feature-specific display lives.
- **`services/`** - REST calls to the backend servers (user-admin-server, etc.).
- **`redux/`** - Global application state managed with [`redux-toolkit`](https://redux-toolkit.js.org/) (RTK): slices, selectors and reducers shared across the app.
- **`translations/`** - i18n message files (`react-intl`).
- **`utils/`** - Generic, reusable helper functions.
- **`images/`** - Static assets (logos, icons).
- **`_mocks_/`** - Mocks used by unit tests.

If you are a developer and you want to update/enhance components used from the gridsuite commons-ui library,
click [here](https://github.com/gridsuite/commons-ui) and follow instructions.

[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

## Typescript config

Files `tsconfig.json` and `src/react-app-env.d.ts` both result from the create-react-app typescript template (version 5).
Some property values have been changed to meet the project needs (ex: target, baseUrl, ...).

## License Headers and dependencies checking

To check dependencies license compatibility with this project locally, please run the following command:

```
npm run licenses-check
```

Notes:

- Check [license-checker-config.json](license-checker-config.json) for the license white list.
  If you need to update this list, please inform the organization's owners.

# Repository Guidelines

## Project Structure & Module Organization
This repository is a GNOME Shell extension with a flat source layout. Runtime code lives in [`extension.js`](/home/rui/.local/share/gnome-shell/extensions/power-switching-manager@joseruibarros.com/extension.js), preferences UI in [`prefs.js`](/home/rui/.local/share/gnome-shell/extensions/power-switching-manager@joseruibarros.com/prefs.js), and shared setting keys in [`constants.js`](/home/rui/.local/share/gnome-shell/extensions/power-switching-manager@joseruibarros.com/constants.js). Extension metadata is defined in [`metadata.json`](/home/rui/.local/share/gnome-shell/extensions/power-switching-manager@joseruibarros.com/metadata.json). GSettings XML and compiled schemas live under [`schemas/`](/home/rui/.local/share/gnome-shell/extensions/power-switching-manager@joseruibarros.com/schemas). Release automation is in [`.github/workflows/deploy.yml`](/home/rui/.local/share/gnome-shell/extensions/power-switching-manager@joseruibarros.com/.github/workflows/deploy.yml).

## Build, Test, and Development Commands
Use `make install` to reinstall the extension into `~/.local/share/gnome-shell/extensions/power-switching-manager@joseruibarros.com/`; it removes the existing install first, copies only the packaged files, and compiles schemas in the installed location. Use `make uninstall` to remove that local install. Use `make zip` to create `power-switching-manager@joseruibarros.com.zip` without relying on GNOME Shell tooling. For manual enablement, run `gnome-extensions enable power-switching-manager@joseruibarros.com`.

## Coding Style & Naming Conventions
Follow the existing GJS style: 4-space indentation, semicolons used inconsistently, and ES module imports with GNOME libraries first when practical. Keep exported constants in `UPPER_SNAKE_CASE`, private class fields and helper methods with `#camelCase`, and extension classes in `PascalCase`. Prefer small, direct methods and preserve SPDX headers in JS files.
Before proposing or implementing any file change, show the concrete diff first and wait for approval.

## Testing Guidelines
There is no automated test suite in this repository today. Validate changes by running `make zip`, `make install`, and exercising both power states in GNOME Shell. When changing preferences or power behavior, confirm theme, screen brightness, and keyboard backlight updates from the extension and preferences window without schema warnings. When changing the GitHub workflow, test the `workflow_dispatch` dry-run path before any real upload.

## Commit & Pull Request Guidelines
Recent commits use short, imperative subjects such as `Makefile` and `Changes necessary for extension approval`. Keep commit titles concise, present tense, and focused on one change. Pull requests should describe the user-visible behavior, note GNOME Shell versions tested, and include screenshots when UI in `prefs.js` changes. Link related issues and mention packaging or schema impacts explicitly.

## Security & Configuration Tips
Do not commit local build artifacts except the release zip when intentionally updating a packaged release. If you change settings keys or defaults, update the schema carefully. The manual GitHub workflow in `.github/workflows/deploy.yml` uploads the zip to extensions.gnome.org using `EGO_LOGIN` and `EGO_PASSWORD` secrets and supports a `dry_run` mode for safe request testing.

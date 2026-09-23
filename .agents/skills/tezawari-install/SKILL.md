---
name: tezawari-install
description: Install or update Tezawari in an existing React app, connect its styles and project-local agent skills, and verify the installed package. Use for initial adoption or package upgrades.
---

# Install Tezawari

Input: the target app directory and the intended package version or local tarball.
Inspect the app's package manifest, lockfile, framework entrypoint and existing CSS
before changing anything. Use its package manager and preserve unrelated changes.
The component library supports React 18/19; the harness requires Node 22+.
If the package source/version is missing, look for the supplied artifact or the
existing dependency first; ask only when the choice cannot be established.

## Install and connect

Read `README.md` and `DESIGN.md` in the supplied Tezawari checkout or
installed package. README owns the package installation commands;
DESIGN.md owns harness setup, update/removal and MCP instructions.
For GitHub Packages, configure the consumer's `@mitame-ai` scope and an
environment-backed `read:packages` token as shown in README before installing.
Never write the token value to a tracked file. If registry access fails, report
the authentication or package-access error instead of switching registries.

1. Install `@mitame-ai/design-system@<version>` from GitHub Packages or the
   supplied tarball with the app's
   package manager. For a source checkout, follow README's build-and-pack steps;
   consume the tarball through public exports rather than source aliases.
   Keep compatible existing React dependencies; do not silently replace an
   incompatible framework or major version.
2. Import `@mitame-ai/design-system/styles.css` once from the app's existing global CSS
   entry or client entrypoint. If the app already uses Tailwind v4, follow README's
   CSS import order for `@mitame-ai/design-system/theme.css`; Tailwind is optional.
   Use the framework's client boundary for interactive components when required.
3. From the consumer root, install the package's project-local task skills and
   resolve the pilot as a retrieval smoke test:

   ```sh
   pnpm exec tezawari-design install-skills .
   pnpm exec tezawari-design resolve scenario.profile-edit
   node --input-type=module -e "console.log(import.meta.resolve('@mitame-ai/design-system/package.json'))"
   ```

   Adapt `pnpm exec` to the app's package manager. Read the referenced guides beside
   the resolved package manifest. If the installer reports an edited/unmanaged
   skill conflict, preserve that file and report the exact conflict for resolution;
   do not delete the file or falsify the installation receipt.
4. Build/typecheck the consuming app using its existing commands and render a
   minimal public-import example, such as Button, in its existing preview. Verify
   that styles load, the control is usable by keyboard, and no new runtime errors
   appear. Remove any temporary probe after verification unless the user requested
   a persistent example. Report what was actually verified.

The profile-edit checker requires its declared form, states and mocked endpoint;
resolving it does not make an arbitrary app satisfy that scenario. Run its browser
check only when the app implements it. Otherwise hand off to `tezawari-build` with
the app's own brief and tests. Install Chromium only when browser checking needs it,
using the pinned command documented in DESIGN.md.

## Updates and optional MCP

After changing the package version, rerun `install-skills .` and the consumer checks.
Only unchanged managed skill files may be replaced. Restart any existing Tezawari
MCP process to load the new contract snapshot. If MCP setup was requested, follow
the installed guide's stdio command and merge the selected client's project settings;
do not replace unrelated configuration or add a global registration by default.
Removal uses `install-skills . --remove` and preserves authored work and unrelated files.

Output: installed version/source and lockfile change, CSS entrypoint, installed skill
paths, verification commands/results, and any unresolved compatibility or local-edit
conflicts. Stop dependent work if installation fails or a required compatibility
choice is unresolved; do not report the library as installed from file presence alone.

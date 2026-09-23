## Portable design harness

### Design principles for consumers

Use the public components and semantic CSS tokens to preserve Tezawari's material
language: quiet paper and ink colors, individual contours, and local responses to
interaction. Reserve shu (朱) for correction or caution rather than general emphasis.
Leave enough layout space for the components' decorative shells and focus indicators.
Keep labels, readable instructions, keyboard operation and failure recovery clear;
decoration must not replace these functions. Respect reduced-motion preferences.

Implementation details belong to the maintainer-only `DESIGN.local.md` in the source
repository. That file is not distributed or required by the installed harness.
Consumer contracts and this guide are the packaged knowledge surface.

### Authority and coverage

| Responsibility                                              | Authority                                                                 | Consumer                                                     |
| ----------------------------------------------------------- | ------------------------------------------------------------------------- | ------------------------------------------------------------ |
| Design intent and material principles                       | [Consumer principles](#design-principles-for-consumers)                                | Build/review skills and contextual review                    |
| Values, selectors, media conditions and component overrides | `src/styles/*.css` and `src/styles/kit/*.css`                             | Vite CSS build; generated token reference                    |
| Component behavior and public types                         | `src/components/` and `src/index.ts`                                      | Package build, generated API index, compiled consumer        |
| Pilot integration guidance                                  | `design/components/*.json`                                                | Resolver and typed/rendered examples                         |
| Composition and task requirements                           | `design/patterns/edit-form.json`, `design/scenarios/profile-edit.json`    | Consumer form and browser checker                            |
| Mechanical criteria                                         | `design/rules.json` with `harness/browser.mjs`                            | Shared CLI/MCP verification                                  |
| Proposed changes and adoption                               | Maintainer `feedback/`; accepted authority changes use normal code review | Maintainers only; proposals never enter production retrieval |

The harness reuses the existing CSS and TypeScript authorities. It generates a
catalog and reference views; it does not replace the token pipeline or duplicate
values in a second source. The existing Vite build produces distributed CSS.
`index.html` remains a historical visual reference, not a second runtime authority.
Every public export is indexed. Detailed contracts cover Button, Input, Field,
Card, Alert, PaperGrain and their declared helpers. Verification covers the pilot
composition and examples, not every prop combination or every library component.

Gap resolution: reuse CSS, exports, components and Storybook; connect them to the
catalog and packed consumer; create shared checks, MCP and task skills; keep
contextual judgments explicit. The pilot helps a member edit a display name and
recover from a failed save. Its Japanese copy, endpoint and viewport sizes are
fixture requirements, not global Tezawari product policy.

### Install in another app

Follow [README.md](README.md#他のアプリにインストール) to install the intended version
of `@mitame-ai/design-system` (a local tarball is supported).
GitHub Packages requires the consumer's `@mitame-ai` registry mapping and a
`read:packages` token, including for public packages. Keep the token in an
environment variable as shown in README; do not commit its value.
For agent-assisted installation or upgrades, use
[tezawari-install](.agents/skills/tezawari-install/SKILL.md).
Keep existing imports:

```tsx
import "@mitame-ai/design-system/styles.css";
import { Button, Field, FieldLabel, Input } from "@mitame-ai/design-system";
```

Node-side knowledge is available from `@mitame-ai/design-system/harness`:
`loadHarness()`, `readResource(harness, uri)`, `searchDesign(harness, query)`,
`resolveContext(harness, scenarioId)`, and
`checkDesign(harness, {scenarioId, route}, {origin, outputDir})`.
The catalog is exported as `@mitame-ai/design-system/design/catalog.json`.
Node tools are separate from the browser entrypoint. Use Node 22+.

From the consumer project root:

```sh
pnpm exec tezawari-design install-skills .
pnpm exec tezawari-design search form
pnpm exec tezawari-design resolve scenario.profile-edit
pnpm exec playwright install chromium
TEZAWARI_PREVIEW_ORIGIN=http://127.0.0.1:4173 pnpm exec tezawari-design check scenario.profile-edit / test-results/tezawari
```

If pnpm does not expose the transitive Playwright executable, use
`pnpm dlx playwright@1.63.0 install chromium`, matching this package's pinned runtime.
The preview must implement the selected scenario. The sample in `examples/consumer`
is the reproducible integration; the maintainer verification command copies it to
an isolated directory and installs the packed library with no source aliases.
Other app flows reuse contracts and need their own interaction tests; the pilot
checker does not automatically verify an arbitrary application.

The check browser intercepts the pilot POST endpoint and blocks unmocked writes
and requests outside the configured origin. It checks the loaded preview build,
not a live backend. Routes must remain within a loopback origin configured before
CLI/MCP startup. Do not point the checker at a server with side-effectful GETs.

### MCP and task skills

A stdio client launches `node` with the absolute installed path to
`harness/cli.mjs` and argument `mcp`. Set `TEZAWARI_PREVIEW_ORIGIN` in its environment.
Resolve the package location with:

```sh
node --input-type=module -e "console.log(import.meta.resolve('@mitame-ai/design-system/package.json'))"
```

Use the sibling `harness/cli.mjs`; startup is independent of the working directory.
Only protocol messages go to stdout. Tools are `search_design({query})`,
`resolve_design_context({scenarioId})`, and `check_design({scenarioId, route})`.
Resources use listed `tezawari://design/…` URIs. Unknown IDs and broken references
fail. Every response identifies the package and/or contract snapshot. Restart the
server after updating the package. The repository tests a real subprocess client;
no global client registration is installed by the harness.

The four task skills (`tezawari-install`, `tezawari-build`, `tezawari-review`, and
`tezawari-improve`) install into the consumer's `.agents/skills/`. They resolve
knowledge from its installed package. Re-run `install-skills .` after updating the
package: only unchanged managed files are replaced; local edits stop installation
before writes. `install-skills . --remove` removes unchanged managed skill files
and the installation receipt, preserving unrelated files and authored contracts.
Disconnect the MCP client separately. No global settings are modified.

### Commands and task sequence

From this maintainer repository:

```sh
pnpm design:generate   # Refresh CSS token/API/catalog/reference views
pnpm design:drift      # Non-mutating freshness and API-contract validation
pnpm test:harness     # Integrity, installation, transport and learning tests
pnpm design:check     # Full packed consumer, browser, transport and correction proof
```

1. Read the brief; resolve the scenario and read its pattern, components and tokens.
2. Implement required states using public imports. Set `disabled` as well as
   `loading` while saving; `Button loading` alone does not block submission.
3. Run checks and inspect current screenshots and reports.
4. Correct specific violations and rerun against the changed artifact. The task
   skills allow at most two automatic correction attempts, stopping sooner on
   stalled progress, unavailable tools, or a new product decision. Preserve the
   last verified result; never lower the acceptance bar.
5. Review hierarchy, readability, action priority and task fit against the brief.
   Mechanical success does not resolve contextual judgment.
6. Capture a scoped observation, record its decision, update accepted authority,
   regenerate views and prove a fresh task retrieves and uses the correction.

Reports under `test-results/design/` include content-based artifact and contract
identities, tool/command metadata, rule IDs, observations and images. The source
of the browser artifact is the served HTML/JS/CSS bytes, including dirty builds.
`pass`, `fail`, `needs-review`, `not-evaluated`, and `not-applicable` remain distinct.
Required mechanical failures, missing required execution and errors return nonzero.
CLI exits 0 for mechanical success, 1 for check failure, and 2 for invalid invocation
or configuration. MCP returns identical check semantics; tool errors are explicit.

### Maintenance and compatibility

Package maintainers own contracts/checks. Revalidate on component, token, contract,
SDK/browser/tooling changes and repeated integration failures. Retain the package
version, contract revision, origin revision and any local modifications in consuming
app lockfiles and reports. Tezawari is MIT licensed (see package metadata).
This release adds harness interfaces without changing component/CSS imports.
Removed resource IDs, exports, skill paths, required states, stronger rules or tool
schemas require an explicit compatibility note and a packed-consumer rerun.

Feedback uses ordinary reviewed files outside the catalog: observation, scope,
evidence, destination, proposal, decision/reviewer/reason, applied revision and
fresh-task proof. Pending/rejected proposals remain maintainer history. The
installer never modifies node_modules policy. A consumer proposes changes upstream.
Registry publication, global MCP setup and full-library verification are outside
this delivery's acceptance scope.

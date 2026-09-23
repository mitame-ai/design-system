---
name: tezawari-build
description: Build or revise React UI using installed Tezawari components, contracts, and the recoverable edit-form workflow.
---

# Tezawari build

From the consuming app root, resolve the installed package with:

```sh
node --input-type=module -e "console.log(import.meta.resolve('@mitame-ai/design-system/package.json'))"
pnpm exec tezawari-design resolve scenario.profile-edit
```

Read `DESIGN.md` for the consumer design principles and harness workflow beside that package manifest and every relevant resource returned by the resolver. The source checkout uses `node harness/cli.mjs` instead of `pnpm exec tezawari-design`. No token values or API specifications are owned by this skill.

Input: the user brief, app root, and selected scenario. Preserve app requirements; pilot labels and viewport dimensions are examples, not universal policy.

Implement the required states using public package imports and the CSS entrypoint. Follow the resolved contracts. For the pilot, expose the specified form labels and request endpoint in a local preview; use the sample consumer as the runnable composition reference.

Start the app preview, then run:

```sh
TEZAWARI_PREVIEW_ORIGIN=http://127.0.0.1:4173 pnpm exec tezawari-design check scenario.profile-edit / test-results/tezawari
```

Read the JSON report and inspect its screenshots. Correct specific failures, rerun, and retain before/after evidence. Limit automatic correction to two attempts; stop earlier on stalled progress, missing tools, or a new product decision. Do not weaken checks. Record contextual review and unevaluated behavior separately. For other app flows, use the shared contracts and app-specific tests; do not pretend the pilot checker covers them.

Output: implemented UI, current artifact/contract revisions, report and images, remaining decisions, and scoped feedback for the improve skill.

---
name: tezawari-improve
description: Turn an observed Tezawari integration correction into a scoped, reviewed knowledge update and verify its use by a later task.
---

# Tezawari improve

From the consuming app root, resolve the installed package with:

```sh
node --input-type=module -e "console.log(import.meta.resolve('@mitame-ai/design-system/package.json'))"
pnpm exec tezawari-design resolve scenario.profile-edit
```

Read `DESIGN.md` for the consumer design principles and harness workflow beside that package manifest and every relevant resource returned by the resolver. The source checkout uses `node harness/cli.mjs` instead of `pnpm exec tezawari-design`. No token values or API specifications are owned by this skill.

Input: concrete observation, reproduction, report revisions, and the authoritative destination. Store proposals in the maintainer repository feedback directory, outside production retrieval. Record scope, evidence digest, proposal, decision, responsible reviewer and reason, adoption revision, and a later verification run.

Use an ordinary reviewed change to the smallest contract, check, or scenario. Preserve pending/rejected decisions outside the catalog. Existing authorization covers implementation-grounded corrections; never invent stakeholder approval for new shared design policy. Consumers propose upstream changes instead of editing node_modules.

In the maintainer checkout run `pnpm design:generate`, `pnpm design:drift`, and `pnpm design:check`. Install the newly packed version in a fresh consumer, restart MCP, resolve again, and verify the original defect, its correction, and a neighboring case. Record whether this was a deterministic test, operator walkthrough, or actual agent run.

Output: decision record, authoritative diff, refreshed views, and proof that a fresh task retrieved and used the change. Stop on unresolved policy decisions or stale evidence; do not silently broaden a scenario rule.

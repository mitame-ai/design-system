---
name: tezawari-review
description: Review a Tezawari consumer against its brief, installed contracts, rendered states, and executable pilot checks.
---

# Tezawari review

From the consuming app root, resolve the installed package with:

```sh
node --input-type=module -e "console.log(import.meta.resolve('@mitame-ai/design-system/package.json'))"
pnpm exec tezawari-design resolve scenario.profile-edit
```

Read `DESIGN.md` for the consumer design principles and harness workflow beside that package manifest and every relevant resource returned by the resolver. The source checkout uses `node harness/cli.mjs` instead of `pnpm exec tezawari-design`. No token values or API specifications are owned by this skill.

Input: current artifact, brief, selected scenario, and local preview origin. Resolve current knowledge, run the check command shown in the installed DESIGN.md, and inspect the report and actual screenshots. Verify keyboard operation and failure/recovery evidence. Source inspection alone is insufficient.

Separate mechanical failures, contextual findings (reading order, action priority, material fit), and missing evidence. A zero exit grants no visual approval. Other flows need their own interaction tests; indexed components are not exhaustively verified.

Output: findings with rule IDs, state, artifact/contract revisions, evidence paths, and specific corrections. Stop when required evidence cannot be obtained or a product decision is needed; preserve uncertainty. Send repeatable knowledge gaps to the improve workflow without changing policy during review.

# Tezawari agent entrypoint

Read [DESIGN.local.md](DESIGN.local.md) for the internal design language and
[DESIGN.md](DESIGN.md) for the authority map and portable harness workflow.
For installation, app implementation, review, or knowledge corrections, use the corresponding
`tezawari-install`, `tezawari-build`, `tezawari-review`, or `tezawari-improve` skill in `.agents/skills/`.
Preserve the Japanese design language and public component APIs. Generated views
are refreshed with `pnpm design:generate` and checked with `pnpm design:drift`.

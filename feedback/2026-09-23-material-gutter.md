# Adopted: reserve space for the animated material shell

Status: accepted, scoped pilot composition correction.
Owner/reviewer: implementing agent under the authorized pilot task; package maintainers own later changes. No new global spacing token or stakeholder approval is implied.

Observation: The initial 390px consumer had a 393px document width. Inspection found decorative tz-shell spans extending roughly 3px beyond the viewport. A 24px container gutter only covered the card's 24px shell padding, leaving no room for its animated contour.

Evidence: `test-results/material-before/report.json` records LAYOUT-OVERFLOW failing with the built artifact digest; `390-light-no-preference-long-content-failed.png` shows the actual consumer. A DOM geometry probe reported viewport=390, scrollWidth=393, shell bounds approximately -3.1..393.2.

Scope/destination: `design/patterns/edit-form.json` and the sample consumer's narrow layout. Other compositions choose their own adequate gutter.

Decision: Use a 32px pilot gutter and document that the outer material envelope needs layout space. Keep real overflow assertions active in normal motion.

Rejected alternative: overflow-x:hidden would conceal the geometry defect and could clip focus/material contours. Removing animation would change the established design.

Adoption: Regenerate the pattern/catalog, install a fresh tarball, restart MCP and retrieve the updated pattern. The next consumer task must pass LAYOUT-OVERFLOW across both viewport sizes, themes, motion settings and long content. Final verification and review receipts identify the resulting revisions and screenshots.

Original artifact revision: `9d95d09d2c7e4536d693a98512977c37d46af42d635975f0e841ff7a7aa08f62`. Original contract revision: `f659d768e8d80cda17a30d7f195cf800143a859cd8590c4798662fa0a665b909`.

Final adoption evidence: `../test-results/design/2026-09-22T18-50-48.624Z/verification.json`, `../test-results/design/2026-09-22T18-50-48.624Z/corrected/report.json`, and `../test-results/design/2026-09-22T18-50-48.624Z/review.md`. Contract revision: `ae46cefbce5d02bd7c69c35cb888ccbf133c485af0811f1a5cbd023bb635ce8d`.

# Adopted: keep the submitted draft stable while saving

Status: accepted within the authorized profile-edit pilot.
Owner/reviewer: implementing agent; package maintainers own the scenario/check.

Observation: The first implementation disabled Save but left the name editable.
A browser reproduction sent one name, entered a different name while the response
was held, then received a success message beside the unsaved second name.

Evidence: `test-results/pending-draft-before.json` records the actual sent payload,
displayed value and editable-while-pending state from the previous packed consumer.

Scope/destination: The profile-edit scenario's FORM-PENDING rule, its shared browser
check, and the sample consumer. This is not a new library-wide Input behavior.

Decision: Disable the name input during the pending save and enable it again on
completion/failure. Assert that state alongside the existing single-request and
busy-state checks. The displayed value then remains the submitted draft.

Alternative: An app can support edits during save with explicit saved/current draft
tracking, but that adds state the pilot does not need and requires another scenario.

Adoption: Refresh the catalog, install a new packed consumer and run FORM-PENDING
through CLI and MCP. The final verification receipt identifies the corrected
artifact, pending screenshots, recovery rerun, and retained long-content case.

Final adoption evidence: `../test-results/design/2026-09-22T18-50-48.624Z/verification.json`, `../test-results/design/2026-09-22T18-50-48.624Z/corrected/report.json`, and `../test-results/design/2026-09-22T18-50-48.624Z/review.md`. Contract revision: `ae46cefbce5d02bd7c69c35cb888ccbf133c485af0811f1a5cbd023bb635ce8d`.

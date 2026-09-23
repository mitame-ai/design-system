# Pilot correction: readable helper instruction

Status: accepted within the authorized pilot implementation; not a global token change.
Owner/reviewer: implementing agent; package maintainers maintain the pilot.

Observation: Reviewing the packed consumer's narrow dark screenshot showed the
helper instruction was visually too faint. It inherited the library's pale note
token, which is also used for subordinate/decorative annotations.

Evidence: `test-results/design/2026-09-22T18-32-54.385Z/baseline/390-dark-no-preference-default.png`.
This is a contextual readability observation, not a claim of a complete accessibility audit.

Destination/change: The pilot uses the existing secondary-text token for
`#name-help`. The scenario records that instruction ID and token; THEME-TOKENS
verifies the actual rendered background, helper color and font against their
semantic CSS values in every supported theme.

Decision/reason: Make the pilot instruction readable without changing the
library-wide note style, palette or component APIs. A global palette change was
rejected as unnecessary for this scoped composition.

Adoption evidence: The final packed-consumer verification records the current
scenario/contract digest, passing THEME-TOKENS results and updated screenshots.

Final adoption evidence: `../test-results/design/2026-09-22T18-50-48.624Z/verification.json`, `../test-results/design/2026-09-22T18-50-48.624Z/corrected/report.json`, and `../test-results/design/2026-09-22T18-50-48.624Z/review.md`. Contract revision: `ae46cefbce5d02bd7c69c35cb888ccbf133c485af0811f1a5cbd023bb635ce8d`.

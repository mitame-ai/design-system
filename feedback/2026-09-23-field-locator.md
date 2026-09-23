# Adopted: accessible-name lookup for a required FieldLabel

Status: accepted, implementation-grounded testing guidance.
Reviewer/owner: implementing agent under the authorized harness task; package maintainers own future changes. This is not stakeholder approval of a new design policy.

Observation: In the first packed consumer, `getByLabel("表示名", {exact:true})` returned zero while `getByRole("textbox", {name:"表示名", exact:true})` returned one. The accessibility snapshot was `textbox "表示名": 山田 花子`. The visually displayed label includes a required mark, hidden from the accessible name.

Evidence: `test-results/design/2026-09-22T18-27-00.681Z/consumer` (original packed consumer); direct Playwright probe and `test-results/field-locator-probe.png`. The initial browser run was interrupted after diagnosing repeated locator timeouts; it is not a passing acceptance run.

Scope/destination: Field's browser-automation guidance in `design/components/field.json` and the pilot checker in `harness/browser.mjs`.

Decision/reason: Retrieve by the observed accessible name and independently assert native label association. Preserve the component's aria-hidden marker and existing accessibility behavior.

Rejected alternative: Removing the required marker or including the bullet in the accessible name would change the design/accessibility semantics to accommodate a test locator.

Adoption: The contract and checker were updated together, then generated views refreshed. A fresh packed consumer and restarted MCP must retrieve the new sentence and pass FORM-LABEL. See the final verification receipt for the adopted contract revision and fresh-task proof.

Original artifact revision: `9d95d09d2c7e4536d693a98512977c37d46af42d635975f0e841ff7a7aa08f62`. Original contract revision: `fdeed54cb9929ff1bb74c726e12fed8f707dc1b88e0715f0d437a4e9c55872bd`.

Final adoption evidence: `../test-results/design/2026-09-22T18-50-48.624Z/verification.json`, `../test-results/design/2026-09-22T18-50-48.624Z/corrected/report.json`, and `../test-results/design/2026-09-22T18-50-48.624Z/review.md`. Contract revision: `ae46cefbce5d02bd7c69c35cb888ccbf133c485af0811f1a5cbd023bb635ce8d`.

/**
 * Framing of the agents band (`#automatisations`), copy deck B2 `home.auto.*` (US-104): what the
 * monthly offer builds, each tool starting from a task the team already does.
 * This file alone is read by the red-line guard and the no-price oracle: the five scenes and their
 * sample data stay in `content.ts`, unchanged (their invoice amounts are not training prices).
 */

export const EYEBROW = 'Ce que je construis'
export const TITLE = 'Les tâches qui reviennent, confiées à Claude.'
/** « votre équipe » named twice: « elle » could read as Claude (adversarial review K6, dir-7). */
export const LINE =
  "Chaque outil part d'une tâche que votre équipe fait déjà : Claude prépare, et votre équipe relit et valide."

/** Screen-reader intro of the animated cases (the scenes' own text follows it in `.auto-sr`). */
export const SR_INTRO =
  "Exemples animés d'outils construits sur des tâches qui reviennent. Pour chaque cas, une demande arrive et Claude produit ce que vous validez : un devis, un mail envoyé à la bonne personne, le résumé de la veille du matin, les documents d'une intervention, le compte rendu d'une séance et son mail de suivi."

/**
 * Framing of the agents band (`#automatisations`), 01b « What the team knows after three days ».
 * This file alone is read by the red-line guard and the no-price oracle: the five scenes and their
 * sample data stay in `content.ts`, unchanged (their invoice amounts are not training prices).
 */

export const EYEBROW = 'Après trois jours'
export const TITLE = 'Ce que votre équipe sait faire.'
export const LINE =
  "Confier à Claude les tâches qui reviennent, avec vos documents et vos règles, puis relire ce qu'il produit."

/** Screen-reader intro of the animated cases (the scenes' own text follows it in `.auto-sr`). */
export const SR_INTRO =
  "Exemples animés de tâches qu'une équipe formée confie à Claude. Pour chaque cas, une demande arrive et Claude produit ce que vous validez : un devis, un mail envoyé à la bonne personne, le résumé de la veille du matin, les documents d'une intervention, le compte rendu d'une séance et son mail de suivi."

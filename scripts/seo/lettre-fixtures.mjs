// Fixture issues of the Tuesday letter (US-101), for offline builds, dev servers and the local
// checkpoint builds: `SABLIA_FIXTURE_LETTRES=2026-11-10-exemple-de-numero[,…]` makes each listed slug a
// published issue with specimen text, so the whole chain (pages, list, guards, sitemap) runs without
// Supabase. The rows have the shape the hub writes into `contenu_lettres` (body already cleaned: no
// merge tag, no mail UTM, no image). The specimens cycle by position; the SECOND one carries a video the
// home already shows (its poster is committed under public/video-thumbs/), so
// `2026-11-10-exemple-de-numero,2026-11-03-numero-avec-video` builds one issue without and one with a video.
//
// Refused on a strict, prod-slot or Vercel build: a fixture must never hide real rows in a deployed
// build. A fixture is never dated after the build day either: `site-check.py` refuses a sitemap date
// after tomorrow, and the sitemap dates an issue from its row.

const SLUG = /^(\d{4})-(\d{2})-(\d{2})-[a-z0-9]+(?:-[a-z0-9]+)*$/
const PARIS = 'Europe/Paris'

/** The calendar day of `date` in Paris, as `yyyy-mm-dd`. */
function parisDay(date) {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: PARIS,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date)
}

/** Paris offset from UTC in minutes at instant `ms` (+60 in winter, +120 in summer). */
function parisOffsetMinutes(ms) {
  const name =
    new Intl.DateTimeFormat('en-US', { timeZone: PARIS, timeZoneName: 'longOffset' })
      .formatToParts(new Date(ms))
      .find((part) => part.type === 'timeZoneName')?.value ?? 'GMT'
  const m = /GMT([+-])(\d{2}):(\d{2})/.exec(name)
  if (!m) return 0
  return (m[1] === '-' ? -1 : 1) * (Number(m[2]) * 60 + Number(m[3]))
}

/** 08:30 Paris on that day, as PostgREST prints a timestamptz (`…T07:30:00+00:00`). */
function sendInstant(year, month, day) {
  const wall = Date.UTC(year, month - 1, day, 8, 30)
  const ms = wall - parisOffsetMinutes(wall) * 60_000
  return new Date(ms).toISOString().replace(/\.\d{3}Z$/, '+00:00')
}

const calendly = (slug) =>
  `https://calendly.com/brice-gachadoat/echange-30-minutes?utm_source=sablia.io&utm_medium=lettre&utm_campaign=${slug}`

// Specimen text: realistic French, no client and no company named, no figure, no em dash.
const SPECIMENS = [
  (slug) => ({
    youtube_id: null,
    titre: "Relancer un devis sans y penser : ce que l'outil ne fait pas",
    resume:
      'Une relance automatique aide, à condition de savoir quoi lui confier et quoi garder pour vous.',
    corps_md: `Bonjour,

## Pourquoi cette vidéo

La même question revient dans presque chaque échange : comment ne plus oublier de relancer un devis ? Dans la vidéo, je montre une relance préparée par Claude à partir du CRM.

## Ce que dix minutes ne disent pas

Une relance automatique ne sait pas si le client a déjà appelé.
Elle part quand même, et c'est là que tout se joue.

Avant de la brancher, trois choses à préparer :

- la liste des devis encore ouverts ;
- la date du dernier échange, tenue à jour ;
- une phrase de relance que vous signeriez vous-même.

## Mon avis

Je laisse l'outil préparer le brouillon, jamais l'envoyer seul. Vous gardez le dernier mot, et vos clients le sentent.

Les modèles des vidéos sont sur [la page des ressources](https://sablia.io/ressources).

Si vous voulez voir ce que ça donnerait chez vous, 30 minutes : ${calendly(slug)}

Brice`,
  }),
  (slug) => ({
    // « Claude branché sur un CRM », the first tile of the home's video row.
    youtube_id: 'd5fo00AFqVM',
    titre: "Avant un rendez-vous client, ce que Claude doit lire et ce qu'il doit ignorer",
    resume:
      'Préparer un rendez-vous avec Claude fait gagner du temps, si vous choisissez bien ce que vous lui montrez.',
    corps_md: `Bonjour,

## Pourquoi cette vidéo

Un dirigeant m'a demandé la semaine dernière s'il pouvait confier la préparation de ses rendez-vous à Claude. La vidéo montre la version courte de ma réponse.

## Le vrai problème derrière

Le temps perdu n'est pas dans la lecture des notes.
Il est dans les notes qui manquent, ou qui se contredisent.

Ce que je donne à Claude avant un rendez-vous :

- le compte rendu du dernier échange ;
- les questions restées ouvertes ;
- ce que le client a déjà refusé.

## Mon avis

Je ne lui donne jamais toute la boîte mail. Moins il lit, plus sa préparation est juste.

Les modèles des vidéos sont sur [la page des ressources](https://sablia.io/ressources).

Si vous voulez voir ce que ça donnerait chez vous, 30 minutes : ${calendly(slug)}

Brice`,
  }),
]

/**
 * The fixture issues named by `SABLIA_FIXTURE_LETTRES`, in the order given, or `[]` when unset.
 * Throws when set on a strict (`PRERENDER_STRICT`), prod-slot (`SABLIA_SLOT=prod`) or Vercel build,
 * on a malformed slug, and on a slug dated after the build day in Paris.
 */
export function fixtureLettres(env = process.env, { now = new Date() } = {}) {
  const slugs = (env.SABLIA_FIXTURE_LETTRES ?? '')
    .split(',')
    .map((slug) => slug.trim())
    .filter(Boolean)
  if (slugs.length === 0) return []
  if (env.PRERENDER_STRICT || env.SABLIA_SLOT === 'prod' || env.VERCEL) {
    throw new Error(
      'SABLIA_FIXTURE_LETTRES is set on a strict, prod-slot or Vercel build: fixtures would replace the real issues',
    )
  }

  const today = parisDay(now)
  return slugs.map((slug, index) => {
    const m = SLUG.exec(slug)
    const [year, month, day] = m ? [Number(m[1]), Number(m[2]), Number(m[3])] : []
    const real = m && new Date(Date.UTC(year, month - 1, day)).toISOString().slice(0, 10)
    if (!m || real !== slug.slice(0, 10)) {
      throw new Error(`SABLIA_FIXTURE_LETTRES: "${slug}" is not a slug yyyy-mm-dd-words`)
    }
    if (slug.slice(0, 10) > today) {
      throw new Error(
        `SABLIA_FIXTURE_LETTRES: ${slug} is dated after the build day (${today}); the sitemap would carry a future date`,
      )
    }
    const published_at = sendInstant(year, month, day)
    return {
      slug,
      ...SPECIMENS[index % SPECIMENS.length](slug),
      published_at,
      updated_at: published_at,
    }
  })
}

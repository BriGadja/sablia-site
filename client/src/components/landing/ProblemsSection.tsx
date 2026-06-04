import { Moon, Plug, TriangleAlert, UserSearch } from '@/components/icons/lucide-crm'

const PROBLEMS = [
  {
    icon: <UserSearch size={22} />,
    quote: 'Notre équipe commerciale passe des heures à prospecter à la main.',
    desc: 'Recherche LinkedIn, copie-colle, envoi de messages un par un. Une assistante mobilisée 20 heures par semaine pour quelques rendez-vous.',
  },
  {
    icon: <Moon size={22} />,
    quote: 'Nous avons des milliers de contacts qui dorment dans notre base.',
    desc: "Du chiffre d'affaires potentiel qui sommeille sous vos yeux, faute de temps pour le réactiver.",
  },
  {
    icon: <TriangleAlert size={22} />,
    quote: "Notre CRM n'est jamais vraiment à jour.",
    desc: "Vos commerciaux affirment qu'ils le renseignent. Vous savez bien que la réalité est plus nuancée. Vous pilotez à l'aveugle.",
  },
  {
    icon: <Plug size={22} />,
    quote: "Nous utilisons déjà l'IA, mais nous n'arrivons pas à l'intégrer dans nos process.",
    desc: "ChatGPT, Claude, Perplexity — vous les testez tous. Le passage à l'échelle, c'est de les brancher à votre CRM et à vos workflows. C'est précisément notre métier.",
  },
]

export default function ProblemsSection() {
  return (
    <section id="problemes" className="bg-canvas px-8 py-section">
      <div className="mx-auto max-w-editorial">
        <div className="mx-auto mb-14 max-w-[760px] text-center">
          <div className="eyebrow mb-4 text-primary">Problématiques</div>
          <h2 className="t-display-lg">
            Les 4 frictions les plus fréquentes en direction commerciale B2B.
          </h2>
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          {PROBLEMS.map((p) => (
            <div
              key={p.quote}
              className="flex flex-col gap-4 rounded-lg border border-hairline bg-surface-card p-8 transition-colors duration-base hover:bg-surface-card-elevated"
            >
              <div className="inline-flex h-11 w-11 items-center justify-center rounded-[10px] bg-primary/10 text-primary">
                {p.icon}
              </div>
              <p className="font-display text-[19px] italic leading-snug text-on-dark-strong">
                «&nbsp;{p.quote}&nbsp;»
              </p>
              <p className="text-[15px] leading-relaxed text-on-dark-body">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

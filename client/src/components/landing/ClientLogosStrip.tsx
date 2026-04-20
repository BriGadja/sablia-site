import { motion } from 'framer-motion'

const clients = ['Nestenn', 'Qwertys', 'Stefano', 'Norloc', 'GirlsGang', 'CER']

export default function ClientLogosStrip() {
  return (
    <section
      aria-label="Clients Sablia"
      className="py-14 bg-sablia-bg border-y border-sablia-border"
    >
      <div className="container mx-auto px-6 lg:px-8">
        <p className="text-center text-xs font-medium uppercase tracking-[0.2em] text-sablia-text-tertiary mb-8">
          Ils ont structuré leur IA avec Sablia
        </p>
        <motion.ul
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6 max-w-5xl mx-auto"
        >
          {clients.map((client) => (
            <li
              key={client}
              className="text-base sm:text-lg font-display font-semibold tracking-wide text-sablia-text-tertiary/70 hover:text-sablia-text transition-colors duration-300"
            >
              {client}
            </li>
          ))}
        </motion.ul>
      </div>
    </section>
  )
}

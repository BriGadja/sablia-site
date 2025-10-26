import { motion } from "framer-motion";
import Container from "./Container";
import Section from "./Section";

const clients = [
  "Client 1",
  "Client 2",
  "Client 3",
  "Client 4",
  "Client 5",
  "Client 6",
  "Client 7",
  "Client 8",
];

export default function LogosCloud() {
  return (
    <Section background="off-white" spacing="tight">
      <Container>
        <div className="text-center mb-12">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-sm font-semibold text-v2-charcoal/60 uppercase tracking-wider"
          >
            Ils nous font confiance
          </motion.p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 items-center justify-items-center">
          {clients.map((client, index) => (
            <motion.div
              key={client}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-center w-full h-20 px-4"
            >
              <div className="text-v2-charcoal/40 font-semibold text-lg">
                {client}
              </div>
            </motion.div>
          ))}
        </div>
      </Container>
    </Section>
  );
}

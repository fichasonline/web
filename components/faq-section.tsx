"use client"
import { Reveal } from "@/components/reveal"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import Image from "next/image"

export function FAQSection() {
  const faqs = [
    {
      question: "¿Cómo puedo comprar fichas?",
      answer: "Contactate con nosotros. Nuestro equipo te asesora y acompaña en cada paso del proceso de compra.",
    },
    {
      question: "¿Qué criptomonedas soportan?",
      answer: "Soportamos BTC, USDT y otras criptomonedas populares. Consultanos por otras opciones disponibles.",
    },
    {
      question: "¿Cómo garantizan la seguridad de mis transacciones?",
      answer:
        "Utilizamos tecnología de punta y prácticas de seguridad avanzadas para proteger todas las transacciones. Nuestros sistemas están constantemente monitoreados y actualizados.",
    },
    {
      question: "¿Ofrecen soporte al cliente?",
      answer:
        "Sí, nuestro equipo de soporte está disponible para asistirte con cualquier consulta. Nos caracterizamos por nuestra respuesta rápida y atención personalizada.",
    },
    {
      question: "¿Cuáles son los tiempos de procesamiento?",
      answer:
        "Procesamos las transacciones de forma rápida y eficiente. Los tiempos varían según el tipo de operación, pero siempre priorizamos la velocidad sin comprometer la seguridad.",
    },
    {
      question: "¿Hay comisiones por las transacciones?",
      answer:
        "Nuestras comisiones son competitivas y transparentes. Te informamos todos los costos antes de procesar cualquier transacción.",
    },
  ]

  return (
    <section id="faq" className="py-24 bg-gradient-to-br from-neutral-50 to-purple-50 relative overflow-hidden">
      <div className="absolute top-20 left-20 w-20 h-20 opacity-5">
        <Image
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo.finex-CgwjTwjZjIwuFfYNr3HsxwQhXFKSnJ.png"
          alt="Finex Logo Background"
          fill
          className="object-contain"
          sizes="80px"
        />
      </div>
      <div className="absolute bottom-20 right-20 w-28 h-28 opacity-5">
        <Image
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo.finex-CgwjTwjZjIwuFfYNr3HsxwQhXFKSnJ.png"
          alt="Finex Logo Background"
          fill
          className="object-contain"
          sizes="112px"
        />
      </div>

      <div className="container-custom relative z-10">
        <div className="text-center mb-16">
          <Reveal>
            <h2 className="text-4xl font-display font-bold text-neutral-900 mb-4">Preguntas Frecuentes</h2>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
              Encuentra respuestas a las preguntas más comunes sobre nuestros servicios
            </p>
          </Reveal>
        </div>

        <div className="max-w-3xl mx-auto">
          <Reveal delay={0.4}>
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="bg-white border border-neutral-200 rounded-lg px-6"
                >
                  <AccordionTrigger className="text-left font-display font-semibold text-neutral-900 hover:text-purple-600">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-neutral-600 leading-relaxed">{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

"use client"
import { Reveal } from "@/components/reveal"
import { Card } from "@/components/ui/card"
import { Star } from "lucide-react"
import Image from "next/image"

export function TestimonialsSection() {
  const testimonials = [
    {
      name: "Agustín",
      text: "Muy buen servicio en general, igual destaco la rapidez y seriedad del servicio ya sea una consulta, recarga o cobro. Para felicitar 👏👏",
      rating: 5,
    },
    {
      name: "Marcos",
      text: "La amabilidad de ustedes, la respuesta rápida, el compromiso por el trabajo, las diversas formas de poder depositar como retirar dinero, la veracidad del servicio y que tienen un servicio bastante completo y siguen avanzando.",
      rating: 5,
    },
    {
      name: "Federico",
      text: "Muy grata, siempre con amabilidad, rapidez y eficacia!! Lo cual se valora mucho.",
      rating: 5,
    },
    {
      name: "Paulina",
      text: "Muy buena, siempre atentos, respuesta rápida y efectiva.",
      rating: 5,
    },
  ]

  return (
    <section id="testimonios" className="py-24 bg-white relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 opacity-5">
        <Image
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Finex.Vector-9hy7UohQQyiREX1GaXcYkkkOPb8N26.png"
          alt="Finex Abstract Shape Background"
          fill
          className="object-contain"
          sizes="384px"
        />
      </div>

      <div className="container-custom relative z-10">
        <div className="text-center mb-16">
          <Reveal>
            <h2 className="text-4xl font-display font-bold text-neutral-900 mb-4">Testimonios de nuestros clientes</h2>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
              Lo que dicen nuestros clientes sobre la experiencia con Finex
            </p>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <Reveal key={testimonial.name} delay={index * 0.1}>
              <Card className="p-8 hover:shadow-lg transition-all duration-300 border-neutral-200">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-neutral-700 mb-6 leading-relaxed italic">"{testimonial.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="font-display font-semibold text-purple-600">{testimonial.name.charAt(0)}</span>
                  </div>
                  <div>
                    <h4 className="font-display font-semibold text-neutral-900">{testimonial.name}</h4>
                    <p className="text-sm text-neutral-600">Cliente verificado</p>
                  </div>
                </div>
              </Card>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

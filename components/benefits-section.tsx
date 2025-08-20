"use client"
import { Reveal } from "@/components/reveal"
import { Card } from "@/components/ui/card"
import { Zap, Shield, Lightbulb, Headphones } from "lucide-react"
import Image from "next/image"

export function BenefitsSection() {
  const benefits = [
    {
      icon: Zap,
      title: "Eficiencia",
      description: "Procesamos tus solicitudes rápidamente, sin complicaciones.",
    },
    {
      icon: Shield,
      title: "Confianza y Seguridad",
      description: "Garantizamos transacciones seguras con la máxima transparencia.",
    },
    {
      icon: Lightbulb,
      title: "Innovación Continua",
      description: "Usamos la última tecnología para asegurar tu experiencia.",
    },
    {
      icon: Headphones,
      title: "Soporte Dedicado",
      description: "Nuestro equipo está siempre disponible para ayudarte.",
    },
  ]

  return (
    <section id="beneficios" className="py-24 bg-gradient-to-br from-purple-50 to-neutral-50 relative overflow-hidden">
      <div className="absolute top-10 right-10 w-32 h-32 opacity-5">
        <Image
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo.finex-CgwjTwjZjIwuFfYNr3HsxwQhXFKSnJ.png"
          alt="Finex Logo Background"
          fill
          className="object-contain"
          sizes="128px"
        />
      </div>
      <div className="absolute bottom-10 left-10 w-24 h-24 opacity-5">
        <Image
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo.finex-CgwjTwjZjIwuFfYNr3HsxwQhXFKSnJ.png"
          alt="Finex Logo Background"
          fill
          className="object-contain"
          sizes="96px"
        />
      </div>

      <div className="container-custom relative z-10">
        <div className="text-center mb-16">
          <Reveal>
            <h2 className="text-4xl font-display font-bold text-neutral-900 mb-4">¿Por qué elegirnos?</h2>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
              Nuestros beneficios que nos distinguen en el mercado de intercambios digitales
            </p>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 ]">
          {benefits.map((benefit, index) => (
            <Reveal key={benefit.title} delay={index * 0.1}>
              <Card className=" md:h-[350px] p-8 text-center hover:shadow-lg transition-all duration-300 bg-white border-neutral-200">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <benefit.icon className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-display font-semibold text-neutral-900 mb-4">{benefit.title}</h3>
                <p className="text-neutral-600 leading-relaxed">{benefit.description}</p>
              </Card>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

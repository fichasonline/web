"use client"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Reveal } from "@/components/reveal"
import { MessageCircle, Mail, Phone } from "lucide-react"
import Image from "next/image"

export function ContactSection() {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="absolute top-10 right-10 w-40 h-40 opacity-10">
        <Image
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Finex.Vector-9hy7UohQQyiREX1GaXcYkkkOPb8N26.png"
          alt="Finex Abstract Shape Background"
          fill
          className="object-contain"
          sizes="160px"
        />
      </div>

      <div className="container-custom relative z-10">
        <div className="text-center mb-16">
          <Reveal>
            <h2 className="text-4xl font-display font-bold text-neutral-900 mb-4">Unite a Finex hoy</h2>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
              Contactate con nosotros y comenzá a operar de manera segura y eficiente
            </p>
          </Reveal>
        </div>

        <div className="max-w-4xl mx-auto">
          <Reveal delay={0.4}>
            <Card className="p-12 text-center bg-gradient-to-br from-purple-600 to-purple-700 text-white border-0">
              <h3 className="text-2xl font-display font-bold mb-4">¿Listo para comenzar?</h3>
              <p className="text-purple-100 mb-8 text-lg">
                Nuestro equipo está disponible para asesorarte y acompañarte en cada paso
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                <Button
                  size="lg"
                  className="bg-white text-purple-600 hover:bg-purple-50 px-8 py-3 text-lg font-semibold"
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Contactar por WhatsApp
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-white text-white hover:bg-white hover:text-purple-600 px-8 py-3 text-lg font-semibold bg-transparent"
                >
                  <Mail className="w-5 h-5 mr-2" />
                  Enviar Email
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8 border-t border-purple-500">
                <div className="flex flex-col items-center gap-2">
                  <MessageCircle className="w-8 h-8 text-purple-200" />
                  <h4 className="font-display font-semibold">WhatsApp</h4>
                  <p className="text-purple-200 text-sm">Respuesta inmediata</p>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <Mail className="w-8 h-8 text-purple-200" />
                  <h4 className="font-display font-semibold">Email</h4>
                  <p className="text-purple-200 text-sm">Consultas detalladas</p>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <Phone className="w-8 h-8 text-purple-200" />
                  <h4 className="font-display font-semibold">Teléfono</h4>
                  <p className="text-purple-200 text-sm">Atención personalizada</p>
                </div>
              </div>
            </Card>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

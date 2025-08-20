"use client"
import { motion } from "framer-motion"
import { ServiceCard } from "./service-card"
import { Reveal } from "./reveal"
import { Coins, Bitcoin, Users, TrendingUp } from "lucide-react"

const featuredServices = [
  {
    id: "poker-chips",
    name: "Fichas de Póker",
    description: "Compra y venta de fichas para todas las principales plataformas de póker",
    icon: Coins,
    features: ["Todas las plataformas", "Transacciones rápidas", "Mejores tasas"],
    color: "purple",
  },
  {
    id: "crypto",
    name: "Criptomonedas",
    description: "Compra y venta de criptomonedas de forma segura y eficiente",
    icon: Bitcoin,
    features: ["BTC, USDT y más", "Seguridad garantizada", "Sin comisiones ocultas"],
    color: "blue",
  },
  {
    id: "account-support",
    name: "Soporte de Cuentas",
    description: "Asistencia para establecer cuentas en plataformas de póker y acceder a bonos",
    icon: Users,
    features: ["Setup completo", "Bonos exclusivos", "Asesoría personalizada"],
    color: "green",
  },
  {
    id: "promotions",
    name: "Promociones y Torneos",
    description: "Información actualizada sobre las últimas promociones y torneos",
    icon: TrendingUp,
    features: ["Info en tiempo real", "Mejores oportunidades", "Alertas personalizadas"],
    color: "orange",
  },
]

export function FeaturedProducts() {
  return (
    <section className="py-20 lg:py-32 " id="servicios">
      <div className="container-custom">
        <Reveal>
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-6xl font-display font-bold text-neutral-900 mb-4">
              Nuestros <span className="italic font-light text-purple-600">Servicios</span>
            </h2>
            <p className="text-lg text-neutral-600 max-w-3xl mx-auto">
              Ofrecemos una gama completa de servicios para intercambios digitales seguros y eficientes
            </p>
          </div>
        </Reveal>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.2,
              },
            },
          }}
        >
          {featuredServices.map((service, index) => (
            <motion.div
              key={service.id}
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: {
                    duration: 0.8,
                    ease: [0.21, 0.47, 0.32, 0.98],
                  },
                },
              }}
            >
              <Reveal delay={index * 0.1}>
                <ServiceCard service={service} />
              </Reveal>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

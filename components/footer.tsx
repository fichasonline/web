"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { Instagram, Twitter, Facebook, Send } from "lucide-react"
import Image from "next/image"

export function Footer() {
  const currentYear = new Date().getFullYear()

  const socialLinks = [
    { name: "Instagram", icon: Instagram, href: "#" },
    { name: "Twitter", icon: Twitter, href: "#" },
    { name: "Facebook", icon: Facebook, href: "#" },
  ] as const

  // Fondo parallax
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] })
  const bgY = useTransform(scrollYProgress, [0, 1], [-16, 8])

  return (
    <footer
      ref={ref}
      className="h-[600px] relative isolate overflow-hidden bg-neutral-950 text-neutral-200 flex flex-col"
    >
      {/* Halo degradado */}
      <motion.div
        aria-hidden
        style={{ y: bgY }}
        className="absolute -top-40 left-1/2 -translate-x-1/2 -z-10 h-[360px] w-[980px] rounded-full
                   bg-[radial-gradient(closest-side,rgba(139,92,246,0.18),rgba(88,28,135,0.08)_50%,transparent_70%)] blur-3xl"
      />

      {/* Contenido principal centrado */}
      <div className="flex flex-1 flex-col items-center justify-center text-center px-6">
        {/* Logo + descripción */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-10"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo.finex-CgwjTwjZjIwuFfYNr3HsxwQhXFKSnJ.png"
              alt="Finex"
              width={40}
              height={40}
              className="h-10 w-auto"
            />
          </div>
          <p className="max-w-md text-sm leading-relaxed text-neutral-400 mx-auto">
            Intercambios digitales con foco en seguridad y eficiencia. Fichas, cripto y soporte real.
          </p>
        </motion.div>

        {/* Redes */}
        <div className="flex justify-center items-center gap-3 mb-10">
          {socialLinks.map((s) => (
            <motion.a
              key={s.name}
              href={s.href}
              className="group relative inline-flex size-10 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-white/5"
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.96 }}
            >
              <motion.div
                aria-hidden
                className="absolute inset-0 -z-10 bg-gradient-to-br from-purple-500/0 to-blue-500/0 transition-opacity duration-300 group-hover:from-purple-500/20 group-hover:to-blue-500/20"
              />
              <s.icon className="h-4.5 w-4.5 text-neutral-300 transition-colors group-hover:text-white" />
              <span className="sr-only">{s.name}</span>
            </motion.a>
          ))}
        </div>

        {/* Newsletter */}
        <motion.form
          onSubmit={(e) => e.preventDefault()}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
          className="flex w-full max-w-md items-center gap-2 rounded-full border border-white/10 bg-white/10 p-1.5 backdrop-blur"
        >
          <input
            type="email"
            placeholder="Tu email"
            className="flex-1 bg-transparent px-3 py-2 text-sm text-white placeholder:text-neutral-400 focus:outline-none"
            aria-label="Email"
          />
          <button
            className="inline-flex items-center gap-2 rounded-full bg-purple-600 px-4 py-2 text-sm font-medium text-white
                       hover:bg-purple-500 transition"
            type="submit"
          >
            Suscribirme <Send size={16} />
          </button>
        </motion.form>
      </div>

      {/* Legal pegado al fondo */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        viewport={{ once: true }}
        className="mt-auto border-t border-white/10 py-6"
      >
        <div className="flex flex-col items-center justify-center gap-4 text-center text-xs text-neutral-400">
          <p>© {currentYear} Finex. Todos los derechos reservados.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-neutral-200 transition-colors">Política de Privacidad</a>
            <a href="#" className="hover:text-neutral-200 transition-colors">Términos de Servicio</a>
            <a href="#" className="hover:text-neutral-200 transition-colors">Cookies</a>
          </div>
        </div>
      </motion.div>
    </footer>
  )
}

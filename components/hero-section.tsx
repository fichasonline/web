"use client"

import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion"
import { useRef, useEffect, useState } from "react"
import Image from "next/image"
import { Shield, Zap, TrendingUp } from "lucide-react"
import { Reveal } from "./reveal"
import { BlurPanel } from "./blur-panel"

export function HeroSection() {
  const [showLogo, setShowLogo] = useState(true)
  const [showText, setShowText] = useState(false)

  const SPLASH_HIDE_MS = 1100
  const TEXT_SHOW_MS = 1200

  useEffect(() => {
    const t1 = setTimeout(() => setShowLogo(false), SPLASH_HIDE_MS)
    const t2 = setTimeout(() => setShowText(true), TEXT_SHOW_MS)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [])

  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  })

  const imageScale = useTransform(scrollYProgress, [0, 1], [1.05, 0.95])
  const imageY = useTransform(scrollYProgress, [0, 1], [0, -50])
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 100])
  const contentOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  return (
    <section ref={containerRef} className="relative h-screen overflow-hidden">
      <motion.div
        className="absolute inset-0 will-change-transform"
        style={{ scale: imageScale, y: imageY }}
        initial={{ scale: 1.15 }}
        animate={{ scale: 1 }}
        transition={{ duration: 3, ease: [0.21, 0.47, 0.32, 0.98] }}
        aria-hidden
      >
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-purple-800 to-neutral-900" />
        <Image
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Finex.Vector-9hy7UohQQyiREX1GaXcYkkkOPb8N26.png"
          alt="Finex Abstract Shape"
          fill
          className="object-cover opacity-60 mix-blend-screen"
          priority
          sizes="100vw"
        />
        <AnimatePresence>
          {showLogo && (
            <motion.div
              className="absolute inset-0 z-[1] flex items-center justify-center pointer-events-none"
              initial={{ opacity: 0.2, scale: 0.94 }}
              animate={{ opacity: 0.12, scale: 1 }}
              exit={{ opacity: 0, scale: 1.03 }}
              transition={{ duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98] }}
            >
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo.finex-CgwjTwjZjIwuFfYNr3HsxwQhXFKSnJ.png"
                alt="Finex Logo Background"
                width={450}
                height={180}
                className="h-13 sm:h-32 md:h-36 w-auto"
                sizes="(min-width: 768px) 360px, (min-width: 640px) 320px, 200px"
                priority
              />
            </motion.div>
          )}
        </AnimatePresence>
        <div className="absolute inset-0 bg-black/20" />
      </motion.div>

      {showText && (
        <motion.div
          className="relative z-10 h-full flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98] }}
        >
          <motion.div
            className="container-custom text-center text-white will-change-[transform,opacity]"
            style={{ y: contentY, opacity: contentOpacity }}
          >
            <Reveal>
              <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-tight tracking-tight mb-6">
                <AnimatedText text="Seguridad y confianza" delay={0.2} />
                <span className="block italic font-light">
                  <AnimatedText text="en cada movimiento." delay={0.8} />
                </span>
              </h1>
            </Reveal>

            <Reveal delay={0.1}>
              <motion.p
                className="text-base sm:text-lg md:text-xl text-white/90 mb-12 leading-relaxed max-w-3xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4, ease: [0.21, 0.47, 0.32, 0.98] }}
              >
                Tu solución integral para intercambios digitales. Nos especializamos en el manejo seguro y confiable de
                activos digitales, como fichas de póker, criptoactivos, sitios de gaming y apuestas online.
              </motion.p>
            </Reveal>
          </motion.div>
        </motion.div>
      )}

      {showText && (
        <motion.div
          className="absolute bottom-0 left-0 right-0 z-20 flex justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.21, 0.47, 0.32, 0.98] }}
        >
          <BlurPanel className="mx-6 mb-6 px-4 sm:px-6 py-4 bg-black/24 backdrop-blur-md border-white/20">
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-white/90">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-green-400" />
                <span className="text-xs sm:text-sm">Transacciones seguras</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400" />
                <span className="text-xs sm:text-sm">Procesamiento rápido</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-blue-400" />
                <span className="text-xs sm:text-sm">Soporte 24/7</span>
              </div>
            </div>
          </BlurPanel>
        </motion.div>
      )}
    </section>
  )
}

const AnimatedText = ({ text, delay = 0, className }: { text: string; delay?: number, className?: string }) => {
  const words = text.split(" ")
  let i = 0

  return (
    <span className={className}>
      {words.map((word, wordIndex) => (
        <span key={wordIndex} className="inline-block">
          {word.split("").map((char, charIndex) => {
            const charI = i
            i++
            return (
              <motion.span
                key={`${char}-${charIndex}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  delay: delay + charI * 0.03,
                  ease: [0.21, 0.47, 0.32, 0.98],
                }}
                className="inline-block"
              >
                {char}
              </motion.span>
            )
          })}
          {wordIndex < words.length - 1 && <span>&nbsp;</span>}
        </span>
      ))}
    </span>
  )
}

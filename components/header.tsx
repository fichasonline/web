"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import Image from "next/image"

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <motion.header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        "backdrop-blur-md border-b border-white/[0.02] ",
        isScrolled ? "bg-black/[0.35]" : "bg-black/[0.02]"
      )}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 1.7, ease: [0.21, 0.47, 0.32, 0.98] }}
    >
      <div className="container-custom">
        <div className="relative flex h-12 lg:h-16 items-center justify-center">
          <motion.div className="flex-shrink-0" whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
            <a href="/" className="flex items-center" aria-label="Finex Home">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo.finex-CgwjTwjZjIwuFfYNr3HsxwQhXFKSnJ.png"
                alt="Finex Logo"
                // Estas dimensiones son de referencia para el ratio y evitar CLS.
                // El tamaño visual lo controla Tailwind con h-*/w-auto.
                width={600}
                height={180}
                className="h-6 lg:h-8 w-auto"
                sizes="(min-width:1024px) 48px, 40px"
                priority
              />
            </a>
          </motion.div>
        </div>
      </div>
    </motion.header>
  )
}

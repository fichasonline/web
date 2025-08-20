"use client"

import { motion } from "framer-motion"

interface AnimatedTextProps {
  text: string
  delay?: number
  className?: string
}

export function AnimatedText({ text, delay = 0, className }: AnimatedTextProps) {
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

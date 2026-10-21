import { motion } from 'framer-motion'
import type { ComponentType, CSSProperties, ElementType, ReactNode } from 'react'

type Props = {
  as?: ElementType
  children?: ReactNode
  className?: string
  style?: CSSProperties
  delay?: number
  duration?: number
  x?: number
  y?: number
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const cache = new Map<ElementType, ComponentType<any>>()
function motionFor(tag: ElementType) {
  if (!cache.has(tag)) cache.set(tag, motion.create(tag as never) as ComponentType<unknown>)
  return cache.get(tag)!
}

export default function FadeIn({ as = 'div', children, className, style, delay = 0, duration = 0.7, x = 0, y = 30 }: Props) {
  const M = motionFor(as)
  return (
    <M
      className={className}
      style={style}
      initial={{ opacity: 0, x, y }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: '50px', amount: 0 }}
      transition={{ delay, duration, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {children}
    </M>
  )
}

"use client"

import { useEffect } from 'react'

export default function ClientScrollHandler() {
  useEffect(() => {
    const scrollTarget = window.localStorage.getItem('scrollTarget')
    if (scrollTarget) {
      setTimeout(() => {
        const section = document.getElementById(scrollTarget)
        if (section) {
          const yOffset = -80
          const y = section.getBoundingClientRect().top + window.pageYOffset + yOffset
          window.scrollTo({ top: y, behavior: 'smooth' })
        }
        window.localStorage.removeItem('scrollTarget')
      }, 100)
    }
  }, [])

  return null
}
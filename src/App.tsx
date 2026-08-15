import { useEffect } from 'react'
import { useRoutes } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { routes } from './router'

gsap.registerPlugin(ScrollTrigger)

export default function App() {
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('.reveal-on-scroll').forEach((element) => {
        gsap.fromTo(
          element,
          { autoAlpha: 0, y: 28 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: element,
              start: 'top 85%',
              once: true,
            },
          },
        )
      })
    })

    return () => ctx.revert()
  }, [])

  return useRoutes(routes)
}
"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { motion, useAnimation, useMotionValue, useTransform } from "framer-motion"

const partners = [
  {
    name: "The North Face",
    logo: "/placeholder.svg?height=80&width=160",
    website: "https://www.thenorthface.com",
  },
  {
    name: "Lululemon",
    logo: "/placeholder.svg?height=80&width=160",
    website: "https://www.lululemon.com",
  },
  {
    name: "Arc'teryx",
    logo: "/placeholder.svg?height=80&width=160",
    website: "https://www.arcteryx.com",
  },
  {
    name: "Athleta",
    logo: "/placeholder.svg?height=80&width=160",
    website: "https://www.athleta.com",
  },
  {
    name: "Kjus",
    logo: "/placeholder.svg?height=80&width=160",
    website: "https://www.kjus.com",
  },
  {
    name: "Kathmandu",
    logo: "/placeholder.svg?height=80&width=160",
    website: "https://www.kathmandu.com",
  },
  {
    name: "Vuori",
    logo: "/placeholder.svg?height=80&width=160",
    website: "https://www.vuoriclothing.com",
  },
  {
    name: "Ulvine",
    logo: "/placeholder.svg?height=80&width=160",
    website: "https://www.ulvine.com",
  },
  {
    name: "SSEN10",
    logo: "/placeholder.svg?height=80&width=160",
    website: "https://www.ssen10.com",
  },
  {
    name: "Bogner",
    logo: "/placeholder.svg?height=80&width=160",
    website: "https://www.bogner.com",
  },
]

const PartnerSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [autoplay, setAutoplay] = useState(true)
  const autoplayRef = useRef<NodeJS.Timeout | null>(null)
  const itemsPerPage = { mobile: 2, tablet: 3, desktop: 5 }
  const [itemsToShow, setItemsToShow] = useState(itemsPerPage.desktop)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [sliderWidth, setSliderWidth] = useState(0)
  const sliderRef = useRef<HTMLDivElement>(null)
  
  // Motion values for smooth animations
  const x = useMotionValue(0)
  const controls = useAnimation()
  const maxPages = Math.ceil(partners.length / itemsToShow)
  const maxScroll = -(partners.length - itemsToShow) * (100 / itemsToShow)
  
  // Calculate slider width for drag constraints
  useEffect(() => {
    if (sliderRef.current) {
      setSliderWidth(sliderRef.current.offsetWidth)
    }
    
    const handleResize = () => {
      if (sliderRef.current) {
        setSliderWidth(sliderRef.current.offsetWidth)
      }
    }
    
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [itemsToShow])

  // Handle responsive items per page
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setItemsToShow(itemsPerPage.mobile)
      } else if (window.innerWidth < 1024) {
        setItemsToShow(itemsPerPage.tablet)
      } else {
        setItemsToShow(itemsPerPage.desktop)
      }
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Autoplay functionality
  useEffect(() => {
    if (autoplay && !isDragging) {
      autoplayRef.current = setInterval(() => {
        nextSlide()
      }, 3000)
    }

    return () => {
      if (autoplayRef.current) {
        clearInterval(autoplayRef.current)
      }
    }
  }, [autoplay, currentIndex, itemsToShow, isDragging])

  // Update x motion value when currentIndex changes
  useEffect(() => {
    const newX = -(currentIndex * (100 / itemsToShow))
    controls.start({
      x: `${newX}%`,
      transition: { type: "spring", stiffness: 300, damping: 30 }
    })
  }, [currentIndex, itemsToShow, controls])

  const nextSlide = () => {
    if (currentIndex + itemsToShow >= partners.length) {
      // Smooth loop back to first slide
      controls.start({
        x: "5%",
        transition: { duration: 0.2 }
      }).then(() => {
        controls.start({
          x: "0%",
          transition: { type: "spring", stiffness: 300, damping: 30 }
        })
      })
      setCurrentIndex(0)
    } else {
      setCurrentIndex((prevIndex) => prevIndex + 1)
    }
  }

  const prevSlide = () => {
    if (currentIndex === 0) {
      // Smooth loop to last slide
      controls.start({
        x: "-5%",
        transition: { duration: 0.2 }
      }).then(() => {
        controls.start({
          x: `${-(partners.length - itemsToShow) * (100 / itemsToShow)}%`,
          transition: { type: "spring", stiffness: 300, damping: 30 }
        })
      })
      setCurrentIndex(partners.length - itemsToShow)
    } else {
      setCurrentIndex((prevIndex) => prevIndex - 1)
    }
  }

  const pauseAutoplay = () => setAutoplay(false)
  const resumeAutoplay = () => {
    if (!isDragging) setAutoplay(true)
  }

  // Touch and mouse drag handlers
  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true)
    setAutoplay(false)
    
    // Get starting position
    if ('touches' in e) {
      setStartX(e.touches[0].clientX)
    } else {
      setStartX(e.clientX)
    }
  }

  const handleDragMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging) return
    
    let currentX: number
    if ('touches' in e) {
      currentX = e.touches[0].clientX
    } else {
      currentX = e.clientX
    }
    
    const diff = currentX - startX
    const percentMove = (diff / sliderWidth) * 100
    
    // Calculate new position with boundaries
    const basePosition = -(currentIndex * (100 / itemsToShow))
    let newPosition = basePosition + percentMove
    
    // Apply boundaries
    if (newPosition > 5) newPosition = 5
    if (newPosition < maxScroll - 5) newPosition = maxScroll - 5
    
    controls.set({ x: `${newPosition}%` })
  }

  const handleDragEnd = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging) return
    
    let endX: number
    if ('changedTouches' in e) {
      endX = e.changedTouches[0].clientX
    } else {
      endX = e.clientX
    }
    
    const diff = endX - startX
    
    // Determine if we should change slides based on drag distance
    if (Math.abs(diff) > sliderWidth / 5) {
      if (diff > 0) {
        prevSlide()
      } else {
        nextSlide()
      }
    } else {
      // Snap back to current position
      controls.start({
        x: `${-(currentIndex * (100 / itemsToShow))}%`,
        transition: { type: "spring", stiffness: 300, damping: 30 }
      })
    }
    
    setIsDragging(false)
    setTimeout(() => setAutoplay(true), 1000)
  }

  // Mouse wheel scrolling
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault()
    pauseAutoplay()
    
    if (e.deltaY > 0) {
      nextSlide()
    } else {
      prevSlide()
    }
    
    // Resume autoplay after a delay
    setTimeout(() => resumeAutoplay(), 1000)
  }

  return (
    <div className="w-full">
      {/* Desktop: Arrow di luar slider */}
      <div className="hidden sm:flex w-full items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          className="rounded-full bg-background/80 backdrop-blur-sm shadow-md hover:bg-background border-primary/20 hover:border-primary opacity-70 hover:opacity-100 transition-opacity"
          onClick={prevSlide}
          aria-label="Previous slide"
          suppressHydrationWarning={true}
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <div className="relative w-full overflow-hidden" ref={sliderRef}>
            <motion.div
              className="relative w-full cursor-grab active:cursor-grabbing"
              onMouseEnter={pauseAutoplay}
              onMouseLeave={resumeAutoplay}
              onMouseDown={handleDragStart}
              onMouseMove={handleDragMove}
              onMouseUp={handleDragEnd}
              onTouchStart={handleDragStart}
              onTouchMove={handleDragMove}
              onTouchEnd={handleDragEnd}
              onWheel={handleWheel}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
            >
              <motion.div
                className="flex"
                animate={controls}
                style={{ x }}
              >
                {partners.map((partner, index) => (
                  <motion.div
                    key={index}
                    className="flex-shrink-0 p-4"
                    style={{ width: `${100 / itemsToShow}%` }}
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >
                    <Link href={partner.website} target="_blank" rel="noopener noreferrer" className="block h-full">
                      <Card className="h-full flex items-center justify-center hover:shadow-lg transition-all duration-300 group bg-background/80 backdrop-blur-sm border-primary/10">
                        <CardContent className="p-6 flex items-center justify-center">
                          <div className="relative h-16 w-full">
                            <Image
                              src={partner.logo || "/placeholder.svg"}
                              alt={partner.name}
                              fill
                              className="object-contain transition-transform duration-300 group-hover:scale-110"
                            />
                          </div>
                          <span className="absolute bottom-2 opacity-0 group-hover:opacity-100 transition-opacity text-xs text-center font-medium text-muted-foreground">
                            {partner.name}
                          </span>
                        </CardContent>
                      </Card>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </div>
        <Button
          variant="outline"
          size="icon"
          className="rounded-full bg-background/80 backdrop-blur-sm shadow-md hover:bg-background border-primary/20 hover:border-primary opacity-70 hover:opacity-100 transition-opacity"
          onClick={nextSlide}
          aria-label="Next slide"
          suppressHydrationWarning={true}
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>
      {/* Mobile: Arrow tetap absolute di dalam slider */}
      <div className="relative w-full overflow-hidden sm:hidden" ref={sliderRef}>
        <motion.div
          className="relative w-full cursor-grab active:cursor-grabbing"
          onMouseEnter={pauseAutoplay}
          onMouseLeave={resumeAutoplay}
          onMouseDown={handleDragStart}
          onMouseMove={handleDragMove}
          onMouseUp={handleDragEnd}
          onTouchStart={handleDragStart}
          onTouchMove={handleDragMove}
          onTouchEnd={handleDragEnd}
          onWheel={handleWheel}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="flex"
            animate={controls}
            style={{ x }}
          >
            {partners.map((partner, index) => (
              <motion.div
                key={index}
                className="flex-shrink-0 p-4"
                style={{ width: `${100 / itemsToShow}%` }}
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <Link href={partner.website} target="_blank" rel="noopener noreferrer" className="block h-full">
                  <Card className="h-full flex items-center justify-center hover:shadow-lg transition-all duration-300 group bg-background/80 backdrop-blur-sm border-primary/10">
                    <CardContent className="p-6 flex items-center justify-center">
                      <div className="relative h-16 w-full">
                        <Image
                          src={partner.logo || "/placeholder.svg"}
                          alt={partner.name}
                          fill
                          className="object-contain transition-transform duration-300 group-hover:scale-110"
                        />
                      </div>
                      <span className="absolute bottom-2 opacity-0 group-hover:opacity-100 transition-opacity text-xs text-center font-medium text-muted-foreground">
                        {partner.name}
                      </span>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
        {/* Arrow absolute di mobile */}
        <Button
          variant="outline"
          size="icon"
          className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-background/80 backdrop-blur-sm shadow-md hover:bg-background border-primary/20 hover:border-primary z-10 opacity-70 hover:opacity-100 transition-opacity"
          onClick={prevSlide}
          aria-label="Previous slide"
          suppressHydrationWarning={true}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-background/80 backdrop-blur-sm shadow-md hover:bg-background border-primary/20 hover:border-primary z-10 opacity-70 hover:opacity-100 transition-opacity"
          onClick={nextSlide}
          aria-label="Next slide"
          suppressHydrationWarning={true}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      {/* Improved dots indicator */}
      <div className="flex justify-center mt-6 gap-2">
        {Array.from({ length: Math.ceil(partners.length / itemsToShow) }).map((_, index) => {
          const isActive = index === Math.floor(currentIndex / itemsToShow)
          return (
            <button
              key={index}
              className={cn(
                "h-2 rounded-full transition-all duration-300 hover:opacity-100",
                isActive 
                  ? "w-8 bg-primary shadow-sm" 
                  : "w-2 bg-muted-foreground/30 opacity-70 hover:bg-primary/50"
              )}
              onClick={() => {
                setCurrentIndex(index * itemsToShow)
                pauseAutoplay()
                setTimeout(() => resumeAutoplay(), 1000)
              }}
              aria-label={`Go to slide ${index + 1}`}
              suppressHydrationWarning={true}
            />
          )
        })}
      </div>
    </div>
  )
}

export default PartnerSlider

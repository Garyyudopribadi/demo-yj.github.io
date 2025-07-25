"use client"

import { useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import Timeline from "@/components/timeline"
import FactoryOverview from "@/components/factory-overview"
import ParticipatePrograms from "@/components/participate-programs"
import PartnerSlider from "@/components/partner-slider"
import { motion, useScroll, useTransform } from "framer-motion"
import { ArrowRight, ChevronDown, ArrowUpRight, CheckCircle } from "lucide-react"

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollY } = useScroll()
  const opacity = useTransform(scrollY, [0, 300], [1, 0])
  const scale = useTransform(scrollY, [0, 300], [1, 1.1])
  const y = useTransform(scrollY, [0, 300], [0, 100])

  const scrollToContent = () => {
    const contentSection = document.getElementById("content-section")
    if (contentSection) {
      contentSection.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <motion.div
        ref={heroRef}
        className="relative w-full h-[100vh] flex items-center justify-center overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        {/* Background Image with Parallax Effect */}
        <motion.div className="absolute inset-0 z-0" style={{ scale, opacity }}>
          <Image
            src="/placeholder.svg?height=1080&width=1920"
            alt="Yongjin Factory"
            fill
            className="object-cover brightness-[0.6]"
            priority
          />
        </motion.div>

        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-background z-10"></div>

        {/* Hero Content */}
        <motion.div className="container relative z-20 px-4 md:px-6 text-center" style={{ y }}>
          <motion.div
            className="space-y-6 max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <motion.h1
              className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl text-white drop-shadow-md"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              PT.YONGJIN JAVASUKA GARMENT
            </motion.h1>
            <motion.p
              className="mx-auto max-w-[700px] text-white/90 text-lg md:text-xl lg:text-2xl drop-shadow"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              Improve quality of life by manufacturing premium quality products.
            </motion.p>
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center pt-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <Link href="/contact">
                <Button size="lg" className="min-w-[150px] text-base">
                  Contact Us
                </Button>
              </Link>
              <Link href="/careers">
                <Button
                  variant="outline"
                  size="lg"
                  className="min-w-[150px] text-base bg-white/10 backdrop-blur-sm text-white border-white/30 hover:bg-white/20"
                >
                  Join Our Team
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Scroll Down Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 cursor-pointer"
          onClick={scrollToContent}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, repeatType: "loop" }}
          >
            <ChevronDown className="h-10 w-10 text-white/80" />
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Main Content */}
      <div id="content-section" className="flex flex-col gap-24 py-16 md:py-24">
        {/* Company Overview */}
        <section className="container px-4 md:px-6">
          <motion.div
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="/placeholder.svg?height=800&width=600"
                alt="Yongjin Factory Building"
                fill
                className="object-cover"
              />
            </div>
            <div className="space-y-6">
              <div className="inline-block">
                <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary text-primary-foreground hover:bg-primary/80">
                  Established in 1989
                </div>
              </div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Premium Garment Manufacturing
              </h2>
              <p className="text-muted-foreground md:text-lg">
                PT.YONGJIN JAVASUKA GARMENT is a leading manufacturer of premium quality garments, committed to
                excellence in every aspect of our operations. With state-of-the-art facilities and a skilled workforce,
                we deliver products that meet the highest standards of quality and craftsmanship.
              </p>
              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">35+</h3>
                  <p className="text-muted-foreground">Years of Experience</p>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">10,000+</h3>
                  <p className="text-muted-foreground">Skilled Employees</p>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">3</h3>
                  <p className="text-muted-foreground">Manufacturing Facilities</p>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">10+</h3>
                  <p className="text-muted-foreground">Global Brand Partners</p>
                </div>
              </div>
              <div className="pt-4">
                <Link href="/contact">
                  <Button className="group">
                    Learn More
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Timeline History */}
        <section className="container px-4 md:px-6 py-8 md:py-12">
          <motion.div
            className="flex flex-col items-center justify-center space-y-4 text-center mb-12"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Our Journey Through Time</h2>
            <p className="text-muted-foreground md:text-lg max-w-[800px]">
              Since our establishment in 1989, we have grown to become a leading manufacturer of premium quality
              garments, continuously evolving and expanding our capabilities.
            </p>
          </motion.div>
          <Timeline />
        </section>

        {/* Factory Overview */}
        <section className="py-16 bg-muted/30">
          <div className="container px-4 md:px-6">
            <motion.div
              className="flex flex-col items-center justify-center space-y-4 text-center mb-12"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">State Of Yongjin Facilities</h2>
              <p className="text-muted-foreground md:text-lg max-w-[800px]">
                Explore our modern manufacturing facilities designed for efficiency, quality, and sustainability.
              </p>
            </motion.div>
            <FactoryOverview />
          </div>
        </section>

        {/* Participate Programs */}
        <section className="container px-4 md:px-6 py-8 md:py-12">
          <motion.div
            className="flex flex-col items-center justify-center space-y-4 text-center mb-12"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Our Commitments</h2>
            <p className="text-muted-foreground md:text-lg max-w-[800px]">
              We are committed to ethical manufacturing practices, sustainability, and social responsibility.
            </p>
          </motion.div>
          <ParticipatePrograms />
        </section>

        {/* Partners */}
        <section className="py-16 bg-muted/30">
          <div className="container px-4 md:px-6">
            <motion.div
              className="flex flex-col items-center justify-center space-y-4 text-center mb-12"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Our Trusted Partners</h2>
              <p className="text-muted-foreground md:text-lg max-w-[800px]">
                We are proud to work with some of the world's leading brands who trust us with their manufacturing
                needs.
              </p>
            </motion.div>
            <PartnerSlider />
          </div>
        </section>

        {/* CTA Section - Enhanced */}
        <section className="container px-4 md:px-6 py-8 md:py-12">
          <motion.div
            className="rounded-3xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground p-8 md:p-12 lg:p-16 relative overflow-hidden"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            {/* Background Pattern - REMOVED */}

            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/3 blur-3xl"></div>

            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
              <div className="space-y-6 text-center lg:text-left max-w-2xl">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Ready to Partner With Us?
                </h2>
                <p className="text-primary-foreground/90 md:text-lg">
                  Contact us today to discuss how we can meet your garment manufacturing needs with our premium quality
                  products and services.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-white mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-white/90">Premium quality manufacturing with attention to detail</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-white mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-white/90">Sustainable and ethical production practices</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-white mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-white/90">State-of-the-art facilities and equipment</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-white mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-white/90">Experienced team with industry expertise</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-4 min-w-[240px]">
                <Link href="/contact">
                  <Button size="lg" variant="secondary" className="w-full group">
                    Contact Us
                    <ArrowUpRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                  </Button>
                </Link>
                <Link href="/careers">
                  <Button size="lg" className="w-full bg-white text-primary hover:bg-white/90 border-0">
                    Join Our Team
                  </Button>
                </Link>
                <div className="mt-2 text-center">
                  <p className="text-xs text-white/70">Trusted by leading brands worldwide</p>
                </div>
              </div>
            </div>
          </motion.div>
        </section>
      </div>
    </div>
  )
}

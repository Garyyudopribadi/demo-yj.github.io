"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Phone, Building2, Users, Boxes, Factory } from "lucide-react"
import Image from "next/image"
import { motion } from "framer-motion"

const factories = [
  {
    id: "yongjin-1",
    name: "Yongjin 1",
    address: "Jl. Raya Siliwangi Pajagan No Km.35, Sukabumi, Cicurug 43359, Indonesia",
    phone: "+62 812-8927-5271",
    image: "/factory-1.png",
    employees: "2,000+",
    capacity: "500,000 units/month",
    specialization: "Technical Outerwear",
    established: "1989",
  },
  {
    id: "yongjin-2-unit-1",
    name: "Yongjin 2 Unit 1",
    address: "Jl. Raya Siliwangi Pajagan No Km.35, Sukabumi, Cicurug 43359, Indonesia",
    phone: "+62 812-8927-5271",
    image: "/factory-2.png",
    employees: "1,500+",
    capacity: "350,000 units/month",
    specialization: "Athletic Apparel",
    established: "2008",
  },
  {
    id: "yongjin-2-unit-2",
    name: "Yongjin 2 Unit 2",
    address: "Jl. Raya Siliwangi Pajagan No Km.35, Sukabumi, Cicurug 43359, Indonesia",
    phone: "+62 812-8927-5271",
    image: "/factory-3.png",
    employees: "1,500+",
    capacity: "350,000 units/month",
    specialization: "Performance Wear",
    established: "2009",
  },
]

const FactoryOverview = () => {
  return (
    <Tabs defaultValue="yongjin-1" className="w-full">
      <TabsList className="grid w-full grid-cols-3 mb-8">
        {factories.map((factory) => (
          <TabsTrigger key={factory.id} value={factory.id} className="text-sm md:text-base">
            {factory.name}
          </TabsTrigger>
        ))}
      </TabsList>

      {factories.map((factory) => (
        <TabsContent key={factory.id} value={factory.id}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Card className="overflow-hidden">
              <CardHeader>
                <CardTitle>{factory.name}</CardTitle>
                <CardDescription>Manufacturing Facility</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="grid grid-cols-1 lg:grid-cols-2">
                  <div className="relative aspect-video lg:aspect-auto lg:h-full overflow-hidden">
                    <Image src={factory.image || "/placeholder.svg"} alt={factory.name} fill className="object-cover" />
                  </div>
                  <div className="p-6 space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Building2 className="h-4 w-4" />
                          <span className="text-sm font-medium">Established</span>
                        </div>
                        <p>{factory.established}</p>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Users className="h-4 w-4" />
                          <span className="text-sm font-medium">Employees</span>
                        </div>
                        <p>{factory.employees}</p>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Boxes className="h-4 w-4" />
                          <span className="text-sm font-medium">Capacity</span>
                        </div>
                        <p>{factory.capacity}</p>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Factory className="h-4 w-4" />
                          <span className="text-sm font-medium">Specialization</span>
                        </div>
                        <p>{factory.specialization}</p>
                      </div>
                    </div>

                    <div className="space-y-4 pt-4">
                      <div className="flex items-start gap-2">
                        <MapPin className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                        <p className="text-sm">{factory.address}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-5 w-5 text-muted-foreground" />
                        <p className="text-sm">{factory.phone}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      ))}
    </Tabs>
  )
}

export default FactoryOverview

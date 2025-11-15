"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MapPin, Clock, Phone, Navigation, Filter, Navigation2 } from "lucide-react"

export default function LocationsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedService, setSelectedService] = useState("all")
  const [selectedLocation, setSelectedLocation] = useState<number | null>(null)
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)

  const locations = [
    {
      id: 1,
      name: "Swift Courier - Downtown",
      address: "123 Main Street, New York, NY 10001",
      phone: "(555) 123-4567",
      hours: {
        weekday: "8:00 AM - 6:00 PM",
        saturday: "9:00 AM - 4:00 PM",
        sunday: "Closed",
      },
      services: ["Package Drop-off", "Package Pickup", "SwiftShip Kiosk", "Stamps"],
      distance: 0.5,
      isOpen: true,
      lat: 40.7128,
      lng: -74.006,
      type: "full-service",
    },
    {
      id: 2,
      name: "Swift Courier - Midtown",
      address: "456 Business Ave, New York, NY 10002",
      phone: "(555) 234-5678",
      hours: {
        weekday: "7:00 AM - 7:00 PM",
        saturday: "8:00 AM - 5:00 PM",
        sunday: "10:00 AM - 3:00 PM",
      },
      services: ["Package Drop-off", "Package Pickup", "Business Services", "International Shipping"],
      distance: 1.2,
      isOpen: true,
      lat: 40.758,
      lng: -73.9855,
      type: "business",
    },
    {
      id: 3,
      name: "Swift Courier - Express Hub",
      address: "789 Commerce Blvd, New York, NY 10003",
      phone: "(555) 345-6789",
      hours: {
        weekday: "6:00 AM - 8:00 PM",
        saturday: "7:00 AM - 6:00 PM",
        sunday: "9:00 AM - 4:00 PM",
      },
      services: ["24/7 Drop Box", "Express Services", "Large Package Handling"],
      distance: 2.1,
      isOpen: false,
      lat: 40.7505,
      lng: -73.9972,
      type: "express",
    },
    {
      id: 4,
      name: "Swift Courier Kiosk - Mall",
      address: "Shopping Center, 321 Retail Way, New York, NY 10004",
      phone: "Self-Service",
      hours: {
        weekday: "10:00 AM - 9:00 PM",
        saturday: "10:00 AM - 9:00 PM",
        sunday: "11:00 AM - 7:00 PM",
      },
      services: ["SwiftShip Kiosk", "Package Pickup", "Stamps"],
      distance: 3.5,
      isOpen: true,
      lat: 40.7614,
      lng: -73.9776,
      type: "kiosk",
    },
    {
      id: 5,
      name: "Swift Courier - Brooklyn Branch",
      address: "555 Atlantic Ave, Brooklyn, NY 11217",
      phone: "(555) 456-7890",
      hours: {
        weekday: "8:00 AM - 5:00 PM",
        saturday: "9:00 AM - 3:00 PM",
        sunday: "Closed",
      },
      services: ["Package Drop-off", "Package Pickup", "International Shipping"],
      distance: 2.8,
      isOpen: true,
      lat: 40.6751,
      lng: -73.9776,
      type: "branch",
    },
  ]

  const filteredLocations = locations.filter((location) => {
    const matchesSearch =
      location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      location.address.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesService =
      selectedService === "all" ||
      location.services.some((service) => service.toLowerCase().includes(selectedService.toLowerCase()))

    return matchesSearch && matchesService
  }).sort((a, b) => a.distance - b.distance)

  useEffect(() => {
    // Simulate getting user location
    setUserLocation({ lat: 40.7128, lng: -74.006 })
  }, [])

  const getLocationTypeColor = (type: string) => {
    switch (type) {
      case "full-service":
        return "bg-blue-100 text-blue-800"
      case "express":
        return "bg-red-100 text-red-800"
      case "business":
        return "bg-green-100 text-green-800"
      case "kiosk":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleGetDirections = (address: string) => {
    // Open in Google Maps
    const query = encodeURIComponent(address)
    window.open(`https://www.google.com/maps/search/${query}`, "_blank")
  }

  const handleCall = (phone: string) => {
    if (phone !== "Self-Service") {
      window.location.href = `tel:${phone.replace(/[^\d-]/g, "")}`
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Find Swift Courier Locations</h1>
          <p className="text-gray-600">Locate nearby offices, drop-off points, and service centers</p>
        </div>

        {/* Search and Filters */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Enter ZIP code, city, or address"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={selectedService} onValueChange={setSelectedService}>
                <SelectTrigger>
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Filter by service" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Services</SelectItem>
                  <SelectItem value="package">Package Services</SelectItem>
                  <SelectItem value="kiosk">SwiftShip Kiosk</SelectItem>
                  <SelectItem value="business">Business Services</SelectItem>
                  <SelectItem value="international">International</SelectItem>
                  <SelectItem value="express">Express Services</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Map Section */}
        <Card className="mb-8">
          <CardContent className="p-0">
            <div className="h-96 bg-gradient-to-br from-blue-100 via-blue-50 to-blue-100 rounded-lg flex items-center justify-center relative overflow-hidden">
              {/* Map background */}
              <div className="absolute inset-0 opacity-20">
                <svg className="w-full h-full" viewBox="0 0 800 600">
                  <g stroke="#cbd5e1" strokeWidth="1" fill="none">
                    {/* Grid lines */}
                    {Array.from({ length: 9 }).map((_, i) => (
                      <line key={`v-${i}`} x1={i * 100} y1="0" x2={i * 100} y2="600" />
                    ))}
                    {Array.from({ length: 7 }).map((_, i) => (
                      <line key={`h-${i}`} x1="0" y1={i * 100} x2="800" y2={i * 100} />
                    ))}
                  </g>
                </svg>
              </div>

              {/* Location pins */}
              <div className="absolute inset-0">
                {filteredLocations.map((location, index) => {
                  const x = ((location.lng + 74.006) * 400)
                  const y = ((40.7614 - location.lat) * 400)
                  
                  return (
                    <button
                      key={location.id}
                      onClick={() => setSelectedLocation(location.id)}
                      className="absolute transform -translate-x-1/2 -translate-y-full hover:scale-110 transition-transform"
                      style={{
                        left: `${(x % 400) + 50}%`,
                        top: `${(y % 300) + 30}%`,
                      }}
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-lg ${
                        selectedLocation === location.id 
                          ? "bg-red-600 scale-125" 
                          : "bg-blue-600"
                      }`}>
                        {index + 1}
                      </div>
                    </button>
                  )
                })}
              </div>

              {/* Legend */}
              <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-3 text-xs">
                <p className="font-semibold mb-2">Found {filteredLocations.length} locations</p>
                <p className="text-gray-600">Click on pins to view details</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Location Results */}
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Nearby Locations ({filteredLocations.length})</h2>
            <Button variant="outline" size="sm">
              <Navigation className="mr-2 h-4 w-4" />
              Sort by Distance
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredLocations.map((location) => (
              <Card 
                key={location.id} 
                className={`hover:shadow-lg transition-all cursor-pointer ${selectedLocation === location.id ? "ring-2 ring-blue-500" : ""}`}
                onClick={() => setSelectedLocation(location.id)}
              >
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg flex items-center gap-2">
                        {location.name}
                        <Badge className={getLocationTypeColor(location.type)} variant="secondary">
                          {location.type === "full-service" ? "Full Service" : location.type === "express" ? "Express" : location.type.charAt(0).toUpperCase() + location.type.slice(1)}
                        </Badge>
                      </CardTitle>
                      <CardDescription className="flex items-center mt-1">
                        <MapPin className="mr-1 h-4 w-4" />
                        {location.address}
                      </CardDescription>
                    </div>
                    <div className="text-right">
                      <Badge variant={location.isOpen ? "default" : "secondary"}>
                        {location.isOpen ? "Open" : "Closed"}
                      </Badge>
                      <p className="text-sm text-gray-600 mt-1 font-semibold">{location.distance} miles</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Contact Info */}
                    <div className="flex items-center">
                      <Phone className="mr-2 h-4 w-4 text-gray-400" />
                      <span className="text-sm">{location.phone}</span>
                    </div>

                    {/* Hours */}
                    <div className="flex items-start">
                      <Clock className="mr-2 h-4 w-4 text-gray-400 mt-0.5" />
                      <div className="text-sm">
                        <p>
                          <strong>Mon-Fri:</strong> {location.hours.weekday}
                        </p>
                        <p>
                          <strong>Sat:</strong> {location.hours.saturday}
                        </p>
                        <p>
                          <strong>Sun:</strong> {location.hours.sunday}
                        </p>
                      </div>
                    </div>

                    {/* Services */}
                    <div>
                      <p className="text-sm font-medium mb-2">Available Services:</p>
                      <div className="flex flex-wrap gap-1">
                        {location.services.map((service, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {service}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-2">
                      <Button 
                        size="sm" 
                        className="flex-1"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleGetDirections(location.address)
                        }}
                      >
                        <Navigation2 className="mr-1 h-3 w-3" />
                        Directions
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="flex-1"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleCall(location.phone)
                        }}
                        disabled={location.phone === "Self-Service"}
                      >
                        <Phone className="mr-1 h-3 w-3" />
                        Call
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Additional Services */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Additional Services</CardTitle>
            <CardDescription>Other ways to access Swift Courier services</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <MapPin className="h-6 w-6 text-blue-600" />
                </div>
                <h4 className="font-medium mb-2">Drop Boxes</h4>
                <p className="text-sm text-gray-600">24/7 secure drop boxes at convenient locations. No human interaction needed.</p>
              </div>
              <div className="text-center p-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Clock className="h-6 w-6 text-green-600" />
                </div>
                <h4 className="font-medium mb-2">Scheduled Pickup</h4>
                <p className="text-sm text-gray-600">Schedule free pickup from your location at a time that works for you.</p>
              </div>
              <div className="text-center p-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Phone className="h-6 w-6 text-purple-600" />
                </div>
                <h4 className="font-medium mb-2">Call for Help</h4>
                <p className="text-sm text-gray-600">On-demand service for business customers. Call 1-800-SWIFT-123.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

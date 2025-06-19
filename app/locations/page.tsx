"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MapPin, Clock, Phone, Navigation, Filter } from "lucide-react"

export default function LocationsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedService, setSelectedService] = useState("all")

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
      distance: "0.5 miles",
      isOpen: true,
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
      distance: "1.2 miles",
      isOpen: true,
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
      distance: "2.1 miles",
      isOpen: false,
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
      distance: "3.5 miles",
      isOpen: true,
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
  })

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
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Map Placeholder */}
        <Card className="mb-8">
          <CardContent className="p-0">
            <div className="h-64 bg-gray-200 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600">Interactive map would be displayed here</p>
                <p className="text-sm text-gray-500">Showing {filteredLocations.length} locations near you</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Location Results */}
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Nearby Locations ({filteredLocations.length})</h2>
            <Button variant="outline">
              <Navigation className="mr-2 h-4 w-4" />
              Get Directions
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredLocations.map((location) => (
              <Card key={location.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{location.name}</CardTitle>
                      <CardDescription className="flex items-center mt-1">
                        <MapPin className="mr-1 h-4 w-4" />
                        {location.address}
                      </CardDescription>
                    </div>
                    <div className="text-right">
                      <Badge variant={location.isOpen ? "default" : "secondary"}>
                        {location.isOpen ? "Open" : "Closed"}
                      </Badge>
                      <p className="text-sm text-gray-600 mt-1">{location.distance}</p>
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
                          <strong>Saturday:</strong> {location.hours.saturday}
                        </p>
                        <p>
                          <strong>Sunday:</strong> {location.hours.sunday}
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
                      <Button size="sm" className="flex-1">
                        <Navigation className="mr-1 h-3 w-3" />
                        Directions
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1">
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
                <p className="text-sm text-gray-600">24/7 secure drop boxes at convenient locations</p>
              </div>
              <div className="text-center p-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Clock className="h-6 w-6 text-green-600" />
                </div>
                <h4 className="font-medium mb-2">Pickup Service</h4>
                <p className="text-sm text-gray-600">Schedule free pickup from your location</p>
              </div>
              <div className="text-center p-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Phone className="h-6 w-6 text-purple-600" />
                </div>
                <h4 className="font-medium mb-2">Mobile Service</h4>
                <p className="text-sm text-gray-600">On-demand service for business customers</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

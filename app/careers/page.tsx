"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MapPin, Briefcase, DollarSign, Clock, Search } from "lucide-react"

const jobs = [
  {
    id: 1,
    title: "Senior Software Engineer",
    department: "Engineering",
    location: "New York, NY",
    type: "Full-time",
    salary: "$120,000 - $160,000",
    description: "Build scalable systems for our shipping platform. Work with React, Node.js, and cloud infrastructure.",
    postedDate: "2024-12-10",
  },
  {
    id: 2,
    title: "Customer Success Manager",
    department: "Customer Success",
    location: "Remote",
    type: "Full-time",
    salary: "$70,000 - $90,000",
    description: "Support and manage relationships with our business customers. Help them achieve their shipping goals.",
    postedDate: "2024-12-08",
  },
  {
    id: 3,
    title: "Operations Coordinator",
    department: "Operations",
    location: "Los Angeles, CA",
    type: "Full-time",
    salary: "$50,000 - $65,000",
    description: "Manage daily operations at our distribution center. Ensure timely package processing and delivery.",
    postedDate: "2024-12-05",
  },
  {
    id: 4,
    title: "Product Manager",
    department: "Product",
    location: "San Francisco, CA",
    type: "Full-time",
    salary: "$110,000 - $150,000",
    description: "Define and drive product strategy for our shipping platform. Lead cross-functional teams.",
    postedDate: "2024-12-03",
  },
  {
    id: 5,
    title: "Data Analyst",
    department: "Analytics",
    location: "Remote",
    type: "Full-time",
    salary: "$80,000 - $110,000",
    description: "Analyze shipping data and provide insights to drive business decisions.",
    postedDate: "2024-11-28",
  },
  {
    id: 6,
    title: "UX/UI Designer",
    department: "Design",
    location: "New York, NY",
    type: "Full-time",
    salary: "$85,000 - $115,000",
    description: "Design beautiful and intuitive interfaces for our shipping tools and web platform.",
    postedDate: "2024-11-25",
  },
  {
    id: 7,
    title: "Delivery Driver",
    department: "Operations",
    location: "Multiple Locations",
    type: "Full-time",
    salary: "$45,000 - $55,000",
    description: "Deliver packages to customers in your area. Be part of our growing courier network.",
    postedDate: "2024-11-20",
  },
  {
    id: 8,
    title: "Marketing Manager",
    department: "Marketing",
    location: "Remote",
    type: "Full-time",
    salary: "$75,000 - $100,000",
    description: "Lead marketing campaigns and grow brand awareness for Swift Courier.",
    postedDate: "2024-11-18",
  },
]

export default function CareersPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedDepartment, setSelectedDepartment] = useState("all")
  const [selectedLocation, setSelectedLocation] = useState("all")
  const [selectedJob, setSelectedJob] = useState<number | null>(null)

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         job.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesDepartment = selectedDepartment === "all" || job.department === selectedDepartment
    const matchesLocation = selectedLocation === "all" || job.location === selectedLocation

    return matchesSearch && matchesDepartment && matchesLocation
  })

  const selectedJobDetail = selectedJob ? jobs.find(j => j.id === selectedJob) : null

  const departments = Array.from(new Set(jobs.map(j => j.department)))
  const locations = Array.from(new Set(jobs.map(j => j.location)))

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Join the Swift Courier Team</h1>
          <p className="text-gray-600 mb-8">Help us revolutionize the shipping industry. We're looking for talented people to join us.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
            <Card>
              <CardContent className="p-4">
                <Briefcase className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <p className="font-semibold">{jobs.length}+ Open Positions</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <MapPin className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <p className="font-semibold">{locations.length} Locations</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <Clock className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <p className="font-semibold">Remote-Friendly</p>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar - Filters */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Filter Jobs</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Search */}
                <div>
                  <label className="text-sm font-medium text-gray-900 mb-2 block">Search</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Job title or keyword"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Department */}
                <div>
                  <label className="text-sm font-medium text-gray-900 mb-2 block">Department</label>
                  <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Departments</SelectItem>
                      {departments.map((dept) => (
                        <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Location */}
                <div>
                  <label className="text-sm font-medium text-gray-900 mb-2 block">Location</label>
                  <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Locations</SelectItem>
                      {locations.map((loc) => (
                        <SelectItem key={loc} value={loc}>{loc}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button className="w-full" onClick={() => {
                  setSearchQuery("")
                  setSelectedDepartment("all")
                  setSelectedLocation("all")
                }} variant="outline">
                  Clear Filters
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Job List */}
            <div className="space-y-4 mb-8">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">Job Listings ({filteredJobs.length})</h2>
              </div>

              {filteredJobs.length > 0 ? (
                filteredJobs.map((job) => (
                  <Card
                    key={job.id}
                    className={`cursor-pointer hover:shadow-md transition-all ${
                      selectedJob === job.id ? "ring-2 ring-blue-500" : ""
                    }`}
                    onClick={() => setSelectedJob(job.id)}
                  >
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">{job.title}</h3>
                          <p className="text-sm text-gray-600">{job.department}</p>
                        </div>
                        <Badge variant="outline">{job.type}</Badge>
                      </div>

                      <p className="text-gray-700 mb-4">{job.description}</p>

                      <div className="flex flex-wrap gap-4 text-sm">
                        <div className="flex items-center text-gray-600">
                          <MapPin className="h-4 w-4 mr-1" />
                          {job.location}
                        </div>
                        <div className="flex items-center text-gray-600">
                          <DollarSign className="h-4 w-4 mr-1" />
                          {job.salary}
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Clock className="h-4 w-4 mr-1" />
                          Posted {new Date(job.postedDate).toLocaleDateString()}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card>
                  <CardContent className="p-12 text-center">
                    <p className="text-gray-500">No jobs found matching your criteria.</p>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Job Detail */}
            {selectedJobDetail && (
              <Card>
                <CardHeader>
                  <CardTitle>{selectedJobDetail.title}</CardTitle>
                  <CardDescription>{selectedJobDetail.department}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Location</p>
                      <p className="font-semibold">{selectedJobDetail.location}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Salary</p>
                      <p className="font-semibold">{selectedJobDetail.salary}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Type</p>
                      <p className="font-semibold">{selectedJobDetail.type}</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-bold mb-2">About This Role</h3>
                    <p className="text-gray-700">{selectedJobDetail.description}</p>
                  </div>

                  <div>
                    <h3 className="font-bold mb-2">What We're Looking For</h3>
                    <ul className="list-disc pl-6 space-y-1 text-gray-700">
                      <li>Passion for solving shipping industry challenges</li>
                      <li>Strong communication and collaboration skills</li>
                      <li>Ability to work in a fast-paced startup environment</li>
                      <li>Commitment to excellence and continuous learning</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-bold mb-2">Why Join Swift Courier?</h3>
                    <ul className="list-disc pl-6 space-y-1 text-gray-700">
                      <li>Competitive salaries and benefits package</li>
                      <li>Health, dental, and vision insurance</li>
                      <li>401(k) with company match</li>
                      <li>Flexible work arrangements</li>
                      <li>Professional development opportunities</li>
                      <li>Inclusive and diverse team culture</li>
                    </ul>
                  </div>

                  <Button className="w-full" size="lg">
                    Apply Now
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

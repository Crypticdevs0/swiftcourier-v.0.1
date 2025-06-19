"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Filter, Clock, Bookmark, Package, MapPin, Star } from "lucide-react"

interface SearchResult {
  id: string
  type: "package" | "location" | "service" | "help"
  title: string
  description: string
  category: string
  tags: string[]
  relevance: number
  lastUpdated?: string
  location?: string
  status?: string
}

export default function SearchPage() {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [filters, setFilters] = useState({
    type: "all",
    category: "all",
    dateRange: "all",
    status: "all",
  })
  const [savedSearches, setSavedSearches] = useState<string[]>([])
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // Mock search data
  const mockResults: SearchResult[] = [
    {
      id: "1",
      type: "package",
      title: "Package SC1234567890",
      description: "Express delivery to Chicago, IL - In Transit",
      category: "tracking",
      tags: ["express", "chicago", "in-transit"],
      relevance: 95,
      lastUpdated: "2024-12-19T14:30:00Z",
      location: "Chicago, IL",
      status: "In Transit",
    },
    {
      id: "2",
      type: "location",
      title: "Swift Courier - Downtown Chicago",
      description: "123 Main St, Chicago, IL 60601 - Open until 6 PM",
      category: "locations",
      tags: ["chicago", "downtown", "pickup", "dropoff"],
      relevance: 88,
      location: "Chicago, IL",
    },
    {
      id: "3",
      type: "service",
      title: "Express International Shipping",
      description: "Fast international delivery to 200+ countries",
      category: "services",
      tags: ["international", "express", "fast"],
      relevance: 82,
    },
    {
      id: "4",
      type: "help",
      title: "How to track a package",
      description: "Step-by-step guide to tracking your Swift Courier packages",
      category: "help",
      tags: ["tracking", "guide", "help"],
      relevance: 75,
    },
  ]

  const performSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([])
      return
    }

    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      const filteredResults = mockResults
        .filter((result) => {
          const matchesQuery =
            result.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            result.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            result.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

          const matchesType = filters.type === "all" || result.type === filters.type
          const matchesCategory = filters.category === "all" || result.category === filters.category

          return matchesQuery && matchesType && matchesCategory
        })
        .sort((a, b) => b.relevance - a.relevance)

      setResults(filteredResults)
      setIsLoading(false)

      // Add to recent searches
      if (!recentSearches.includes(searchQuery)) {
        setRecentSearches((prev) => [searchQuery, ...prev.slice(0, 4)])
      }
    }, 500)
  }

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      performSearch(query)
    }, 300)

    return () => clearTimeout(debounceTimer)
  }, [query, filters])

  const saveSearch = (searchQuery: string) => {
    if (!savedSearches.includes(searchQuery)) {
      setSavedSearches((prev) => [...prev, searchQuery])
    }
  }

  const getResultIcon = (type: string) => {
    switch (type) {
      case "package":
        return <Package className="h-4 w-4 text-blue-600" />
      case "location":
        return <MapPin className="h-4 w-4 text-green-600" />
      case "service":
        return <Star className="h-4 w-4 text-purple-600" />
      case "help":
        return <Search className="h-4 w-4 text-orange-600" />
      default:
        return <Search className="h-4 w-4 text-gray-600" />
    }
  }

  const highlightText = (text: string, query: string) => {
    if (!query) return text
    const regex = new RegExp(`(${query})`, "gi")
    return text.replace(regex, "<mark>$1</mark>")
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Search Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Search Swift Courier</h1>
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search packages, locations, services, and more..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-10 h-12 text-lg"
              />
            </div>
            <Button size="lg" onClick={() => performSearch(query)}>
              Search
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Filter className="mr-2 h-4 w-4" />
                  Filters
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Content Type</label>
                  <Select value={filters.type} onValueChange={(value) => setFilters({ ...filters, type: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="package">Packages</SelectItem>
                      <SelectItem value="location">Locations</SelectItem>
                      <SelectItem value="service">Services</SelectItem>
                      <SelectItem value="help">Help & Support</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Category</label>
                  <Select
                    value={filters.category}
                    onValueChange={(value) => setFilters({ ...filters, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="tracking">Tracking</SelectItem>
                      <SelectItem value="shipping">Shipping</SelectItem>
                      <SelectItem value="locations">Locations</SelectItem>
                      <SelectItem value="services">Services</SelectItem>
                      <SelectItem value="help">Help</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Date Range</label>
                  <Select
                    value={filters.dateRange}
                    onValueChange={(value) => setFilters({ ...filters, dateRange: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Time</SelectItem>
                      <SelectItem value="today">Today</SelectItem>
                      <SelectItem value="week">This Week</SelectItem>
                      <SelectItem value="month">This Month</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Package Status</label>
                  <div className="space-y-2">
                    {["In Transit", "Delivered", "Pending", "Delayed"].map((status) => (
                      <div key={status} className="flex items-center space-x-2">
                        <Checkbox id={status} />
                        <label htmlFor={status} className="text-sm">
                          {status}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Saved Searches */}
            {savedSearches.length > 0 && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Bookmark className="mr-2 h-4 w-4" />
                    Saved Searches
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {savedSearches.map((search, index) => (
                      <Button
                        key={index}
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start"
                        onClick={() => setQuery(search)}
                      >
                        {search}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Search Results */}
          <div className="lg:col-span-3">
            <Tabs defaultValue="results" className="space-y-6">
              <TabsList>
                <TabsTrigger value="results">Search Results {results.length > 0 && `(${results.length})`}</TabsTrigger>
                <TabsTrigger value="recent">Recent Searches</TabsTrigger>
                <TabsTrigger value="suggestions">Suggestions</TabsTrigger>
              </TabsList>

              <TabsContent value="results">
                {isLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <Card key={i}>
                        <CardContent className="p-6">
                          <div className="animate-pulse space-y-2">
                            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                            <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : results.length === 0 && query ? (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No results found</h3>
                      <p className="text-gray-600 mb-4">
                        Try adjusting your search terms or filters to find what you're looking for.
                      </p>
                      <Button variant="outline" onClick={() => setQuery("")}>
                        Clear Search
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {results.map((result) => (
                      <Card key={result.id} className="hover:shadow-md transition-shadow cursor-pointer">
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center mb-2">
                                {getResultIcon(result.type)}
                                <h3
                                  className="font-medium text-gray-900 ml-2"
                                  dangerouslySetInnerHTML={{ __html: highlightText(result.title, query) }}
                                />
                                <Badge variant="outline" className="ml-2 text-xs">
                                  {result.type}
                                </Badge>
                              </div>
                              <p
                                className="text-gray-600 mb-2"
                                dangerouslySetInnerHTML={{ __html: highlightText(result.description, query) }}
                              />
                              <div className="flex items-center space-x-4 text-sm text-gray-500">
                                {result.location && (
                                  <div className="flex items-center">
                                    <MapPin className="h-3 w-3 mr-1" />
                                    {result.location}
                                  </div>
                                )}
                                {result.lastUpdated && (
                                  <div className="flex items-center">
                                    <Clock className="h-3 w-3 mr-1" />
                                    {new Date(result.lastUpdated).toLocaleDateString()}
                                  </div>
                                )}
                                {result.status && (
                                  <Badge variant="secondary" className="text-xs">
                                    {result.status}
                                  </Badge>
                                )}
                              </div>
                              <div className="flex flex-wrap gap-1 mt-2">
                                {result.tags.map((tag) => (
                                  <Badge key={tag} variant="outline" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            <div className="flex flex-col items-end space-y-2">
                              <div className="text-sm text-gray-500">{result.relevance}% match</div>
                              <Button size="sm" variant="ghost" onClick={() => saveSearch(query)} className="text-xs">
                                <Bookmark className="h-3 w-3 mr-1" />
                                Save
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="recent">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Clock className="mr-2 h-4 w-4" />
                      Recent Searches
                    </CardTitle>
                    <CardDescription>Your recent search history</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {recentSearches.length === 0 ? (
                      <p className="text-gray-500 text-center py-4">No recent searches</p>
                    ) : (
                      <div className="space-y-2">
                        {recentSearches.map((search, index) => (
                          <div key={index} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="justify-start flex-1"
                              onClick={() => setQuery(search)}
                            >
                              <Clock className="h-3 w-3 mr-2" />
                              {search}
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => saveSearch(search)}>
                              <Bookmark className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="suggestions">
                <Card>
                  <CardHeader>
                    <CardTitle>Popular Searches</CardTitle>
                    <CardDescription>Common searches and helpful suggestions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        "Track package",
                        "Shipping rates",
                        "Nearest location",
                        "International shipping",
                        "Express delivery",
                        "Package pickup",
                        "Delivery status",
                        "Customer support",
                      ].map((suggestion) => (
                        <Button
                          key={suggestion}
                          variant="outline"
                          className="justify-start"
                          onClick={() => setQuery(suggestion)}
                        >
                          <Search className="h-3 w-3 mr-2" />
                          {suggestion}
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}

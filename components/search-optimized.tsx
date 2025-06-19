"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, Clock, Bookmark, Package, MapPin, Star, Loader2 } from "lucide-react"

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

interface SearchFilters {
  type: string
  category: string
  dateRange: string
  status: string
}

interface SearchOptimizedProps {
  onResultSelect?: (result: SearchResult) => void
  initialQuery?: string
}

export function SearchOptimized({ onResultSelect, initialQuery = "" }: SearchOptimizedProps) {
  const [query, setQuery] = useState(initialQuery)
  const [results, setResults] = useState<SearchResult[]>([])
  const [filters, setFilters] = useState<SearchFilters>({
    type: "all",
    category: "all",
    dateRange: "all",
    status: "all",
  })
  const [savedSearches, setSavedSearches] = useState<string[]>([])
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Memoized mock data to prevent recreation on every render
  const mockResults = useMemo<SearchResult[]>(
    () => [
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
    ],
    [],
  )

  // Optimized search function with proper error handling
  const performSearch = useCallback(
    async (searchQuery: string, searchFilters: SearchFilters) => {
      if (!searchQuery.trim()) {
        setResults([])
        setError(null)
        return
      }

      setIsLoading(true)
      setError(null)

      try {
        // Simulate API call with proper error handling
        await new Promise((resolve) => setTimeout(resolve, 300))

        const filteredResults = mockResults
          .filter((result) => {
            const matchesQuery =
              result.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
              result.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
              result.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

            const matchesType = searchFilters.type === "all" || result.type === searchFilters.type
            const matchesCategory = searchFilters.category === "all" || result.category === searchFilters.category

            return matchesQuery && matchesType && matchesCategory
          })
          .sort((a, b) => b.relevance - a.relevance)

        setResults(filteredResults)

        // Add to recent searches (avoid duplicates)
        if (!recentSearches.includes(searchQuery)) {
          setRecentSearches((prev) => [searchQuery, ...prev.slice(0, 4)])
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Search failed"
        setError(errorMessage)
        setResults([])
      } finally {
        setIsLoading(false)
      }
    },
    [mockResults, recentSearches],
  )

  // Debounced search effect with proper cleanup
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      performSearch(query, filters)
    }, 300)

    return () => clearTimeout(debounceTimer)
  }, [query, performSearch]) // Removed filters from dependencies to prevent excessive calls

  // Separate effect for filter changes (immediate search)
  useEffect(() => {
    if (query.trim()) {
      performSearch(query, filters)
    }
  }, [filters, performSearch, query])

  // Memoized save search function
  const saveSearch = useCallback(
    (searchQuery: string) => {
      if (searchQuery.trim() && !savedSearches.includes(searchQuery)) {
        setSavedSearches((prev) => [...prev, searchQuery])
      }
    },
    [savedSearches],
  )

  // Memoized result icon function
  const getResultIcon = useCallback((type: string) => {
    switch (type) {
      case "package":
        return <Package className="h-4 w-4 text-blue-600" aria-hidden="true" />
      case "location":
        return <MapPin className="h-4 w-4 text-green-600" aria-hidden="true" />
      case "service":
        return <Star className="h-4 w-4 text-purple-600" aria-hidden="true" />
      case "help":
        return <Search className="h-4 w-4 text-orange-600" aria-hidden="true" />
      default:
        return <Search className="h-4 w-4 text-gray-600" aria-hidden="true" />
    }
  }, [])

  // Memoized highlight function
  const highlightText = useCallback((text: string, searchQuery: string) => {
    if (!searchQuery) return text
    const regex = new RegExp(`(${searchQuery.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi")
    return text.replace(regex, "<mark>$1</mark>")
  }, [])

  // Handle result selection
  const handleResultClick = useCallback(
    (result: SearchResult) => {
      onResultSelect?.(result)
    },
    [onResultSelect],
  )

  return (
    <div className="space-y-6">
      {/* Search Input */}
      <div className="relative">
        <Search
          className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400"
          aria-hidden="true"
        />
        <Input
          placeholder="Search packages, locations, services, and more..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-10 h-12 text-lg"
          aria-label="Search Swift Courier services"
          aria-describedby={error ? "search-error" : undefined}
        />
        {isLoading && (
          <Loader2
            className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 animate-spin text-gray-400"
            aria-hidden="true"
          />
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div id="search-error" className="p-3 bg-red-50 border border-red-200 rounded-md" role="alert">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="mr-2 h-4 w-4" aria-hidden="true" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label htmlFor="type-filter" className="text-sm font-medium mb-2 block">
              Content Type
            </label>
            <Select value={filters.type} onValueChange={(value) => setFilters({ ...filters, type: value })}>
              <SelectTrigger id="type-filter">
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
            <label htmlFor="category-filter" className="text-sm font-medium mb-2 block">
              Category
            </label>
            <Select value={filters.category} onValueChange={(value) => setFilters({ ...filters, category: value })}>
              <SelectTrigger id="category-filter">
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
            <label htmlFor="date-filter" className="text-sm font-medium mb-2 block">
              Date Range
            </label>
            <Select value={filters.dateRange} onValueChange={(value) => setFilters({ ...filters, dateRange: value })}>
              <SelectTrigger id="date-filter">
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

          <div className="flex items-end">
            <Button
              variant="outline"
              onClick={() => setFilters({ type: "all", category: "all", dateRange: "all", status: "all" })}
              className="w-full"
            >
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Search Results */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Search Results {results.length > 0 && `(${results.length})`}</h2>
          {query && (
            <Button size="sm" variant="ghost" onClick={() => saveSearch(query)}>
              <Bookmark className="h-3 w-3 mr-1" aria-hidden="true" />
              Save Search
            </Button>
          )}
        </div>

        {isLoading ? (
          <div className="space-y-4" aria-label="Loading search results">
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
              <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" aria-hidden="true" />
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
          <div className="space-y-4" role="list" aria-label="Search results">
            {results.map((result) => (
              <Card
                key={result.id}
                className="hover:shadow-md transition-shadow cursor-pointer focus-within:ring-2 focus-within:ring-blue-500"
                onClick={() => handleResultClick(result)}
                role="listitem"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault()
                    handleResultClick(result)
                  }
                }}
              >
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
                            <MapPin className="h-3 w-3 mr-1" aria-hidden="true" />
                            {result.location}
                          </div>
                        )}
                        {result.lastUpdated && (
                          <div className="flex items-center">
                            <Clock className="h-3 w-3 mr-1" aria-hidden="true" />
                            <time dateTime={result.lastUpdated}>
                              {new Date(result.lastUpdated).toLocaleDateString()}
                            </time>
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
                    <div className="text-sm text-gray-500 ml-4">{result.relevance}% match</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Recent Searches */}
      {recentSearches.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="mr-2 h-4 w-4" aria-hidden="true" />
              Recent Searches
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {recentSearches.map((search, index) => (
                <Button key={index} variant="outline" size="sm" onClick={() => setQuery(search)} className="text-xs">
                  {search}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

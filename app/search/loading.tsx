import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="h-10 w-64 bg-gray-200 rounded animate-pulse mx-auto mb-4" />
          <div className="h-5 w-96 bg-gray-100 rounded animate-pulse mx-auto" />
        </div>

        {/* Search Bar */}
        <div className="h-12 bg-gray-100 rounded-lg animate-pulse mb-8" />

        {/* Results Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sidebar Filters */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <div className="h-6 w-32 bg-gray-200 rounded animate-pulse" />
              </CardHeader>
              <CardContent className="space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-10 bg-gray-100 rounded animate-pulse" />
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Results */}
          <div className="lg:col-span-2 space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="h-6 w-full bg-gray-200 rounded animate-pulse mb-3" />
                  <div className="h-4 w-full bg-gray-100 rounded animate-pulse mb-2" />
                  <div className="h-4 w-3/4 bg-gray-100 rounded animate-pulse" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

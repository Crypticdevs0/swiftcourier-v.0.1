import { Card, CardContent } from "@/components/ui/card"

export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="h-10 w-64 bg-gray-200 rounded animate-pulse mx-auto mb-4" />
          <div className="h-5 w-96 bg-gray-100 rounded animate-pulse mx-auto" />
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 h-10 bg-gray-100 rounded animate-pulse" />
          <div className="w-full md:w-48 h-10 bg-gray-100 rounded animate-pulse" />
          <div className="w-full md:w-48 h-10 bg-gray-100 rounded animate-pulse" />
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <div className="h-48 bg-gray-200 rounded-lg animate-pulse mb-4" />
                <div className="h-4 w-24 bg-gray-200 rounded animate-pulse mb-3" />
                <div className="h-6 w-48 bg-gray-200 rounded animate-pulse mb-2" />
                <div className="h-4 w-full bg-gray-100 rounded animate-pulse mb-4" />
                <div className="h-4 w-20 bg-gray-200 rounded animate-pulse mb-4" />
                <div className="h-10 bg-gray-100 rounded animate-pulse" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

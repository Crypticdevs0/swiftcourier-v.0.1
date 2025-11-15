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

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex-1">
                <div className="h-10 bg-gray-200 rounded animate-pulse mb-2" />
              </div>
            ))}
          </div>
        </div>

        {/* Form Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <div className="h-6 w-48 bg-gray-200 rounded animate-pulse" />
                </CardHeader>
                <CardContent className="space-y-4">
                  {Array.from({ length: 4 }).map((_, j) => (
                    <div key={j}>
                      <div className="h-4 w-32 bg-gray-200 rounded animate-pulse mb-2" />
                      <div className="h-10 bg-gray-100 rounded animate-pulse" />
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Summary Sidebar */}
          <div>
            <Card className="sticky top-4">
              <CardHeader>
                <div className="h-6 w-32 bg-gray-200 rounded animate-pulse" />
              </CardHeader>
              <CardContent className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="h-6 bg-gray-100 rounded animate-pulse" />
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header Skeleton */}
      <header className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-slate-200 rounded-lg animate-pulse" />
              <div className="space-y-2">
                <div className="w-48 h-6 bg-slate-200 rounded animate-pulse" />
                <div className="w-32 h-4 bg-slate-100 rounded animate-pulse" />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-64 h-10 bg-slate-100 rounded animate-pulse hidden md:block" />
              <div className="w-10 h-10 bg-slate-200 rounded animate-pulse" />
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto p-6">
        {/* Tabs Skeleton */}
        <div className="grid w-full grid-cols-6 bg-white p-1 shadow-sm rounded-lg mb-6 gap-1">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-10 bg-slate-100 rounded animate-pulse" />
          ))}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="h-4 w-32 bg-slate-200 rounded animate-pulse mb-2" />
                    <div className="h-8 w-24 bg-slate-200 rounded animate-pulse" />
                  </div>
                  <div className="w-8 h-8 bg-slate-200 rounded animate-pulse" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Content Skeleton */}
        <Card>
          <CardHeader>
            <div className="h-6 w-48 bg-slate-200 rounded animate-pulse mb-2" />
            <div className="h-4 w-96 bg-slate-100 rounded animate-pulse" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-12 bg-slate-100 rounded animate-pulse" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

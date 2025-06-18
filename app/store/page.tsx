import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ShoppingCart, Search, Star, Package, Truck, Shield } from "lucide-react"

export default function StorePage() {
  const products = [
    {
      id: 1,
      name: "Forever Stamps (Book of 20)",
      price: 13.2,
      image: "/placeholder.svg?height=200&width=200",
      category: "Stamps",
      rating: 4.8,
      inStock: true,
    },
    {
      id: 2,
      name: "Priority Mail Flat Rate Box - Medium",
      price: 16.25,
      image: "/placeholder.svg?height=200&width=200",
      category: "Shipping Supplies",
      rating: 4.9,
      inStock: true,
    },
    {
      id: 3,
      name: "Bubble Mailers (Pack of 25)",
      price: 24.99,
      image: "/placeholder.svg?height=200&width=200",
      category: "Packaging",
      rating: 4.7,
      inStock: true,
    },
    {
      id: 4,
      name: "Swift Courier Commemorative Stamps",
      price: 15.99,
      image: "/placeholder.svg?height=200&width=200",
      category: "Collectibles",
      rating: 4.6,
      inStock: false,
    },
    {
      id: 5,
      name: "Packing Tape (6-Pack)",
      price: 18.5,
      image: "/placeholder.svg?height=200&width=200",
      category: "Packaging",
      rating: 4.8,
      inStock: true,
    },
    {
      id: 6,
      name: "Express Mail Envelope",
      price: 28.75,
      image: "/placeholder.svg?height=200&width=200",
      category: "Shipping Supplies",
      rating: 4.9,
      inStock: true,
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Swift Store</h1>
          <p className="text-gray-600">Stamps, shipping supplies, and collectible merchandise</p>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input placeholder="Search products..." className="pl-10" />
          </div>
          <Select>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="stamps">Stamps</SelectItem>
              <SelectItem value="shipping">Shipping Supplies</SelectItem>
              <SelectItem value="packaging">Packaging</SelectItem>
              <SelectItem value="collectibles">Collectibles</SelectItem>
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="popular">Most Popular</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="rating">Highest Rated</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Featured Banner */}
        <Card className="mb-8 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-2">Free Shipping on Orders Over $35</h2>
                <p className="opacity-90">Stock up on all your shipping essentials</p>
              </div>
              <div className="mt-4 md:mt-0">
                <Badge variant="secondary" className="text-blue-600">
                  Limited Time
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {products.map((product) => (
            <Card key={product.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="p-0">
                <div className="aspect-square bg-gray-100 rounded-t-lg flex items-center justify-center">
                  <Package className="h-16 w-16 text-gray-400" />
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <Badge variant="outline" className="text-xs">
                    {product.category}
                  </Badge>
                  {!product.inStock && (
                    <Badge variant="destructive" className="text-xs">
                      Out of Stock
                    </Badge>
                  )}
                </div>

                <CardTitle className="text-lg mb-2">{product.name}</CardTitle>

                <div className="flex items-center mb-3">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.floor(product.rating) ? "text-yellow-400 fill-current" : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600 ml-2">({product.rating})</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-blue-600">${product.price.toFixed(2)}</span>
                  <Button size="sm" disabled={!product.inStock} className="flex items-center">
                    <ShoppingCart className="h-4 w-4 mr-1" />
                    Add to Cart
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Service Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6 text-center">
              <Truck className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <CardTitle className="mb-2">Free Shipping</CardTitle>
              <CardDescription>On orders over $35 within the continental US</CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <Shield className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <CardTitle className="mb-2">Secure Checkout</CardTitle>
              <CardDescription>Your payment information is always protected</CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <Package className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <CardTitle className="mb-2">Quality Guaranteed</CardTitle>
              <CardDescription>All products backed by our satisfaction guarantee</CardDescription>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

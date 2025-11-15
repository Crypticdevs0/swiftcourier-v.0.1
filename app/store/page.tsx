"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ShoppingCart, Search, Star, Package, Truck, Shield, Heart, Loader2 } from "lucide-react"

export default function StorePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortBy, setSortBy] = useState("popular")
  const [cartLoading, setCartLoading] = useState(false)
  const [cartItems, setCartItems] = useState<number[]>([])

  const products = [
    {
      id: 1,
      name: "Forever Stamps (Book of 20)",
      price: 13.2,
      category: "Stamps",
      rating: 4.8,
      reviews: 245,
      inStock: true,
      image: "📮",
      description: "Official USPS Forever stamps, valid for standard postage",
    },
    {
      id: 2,
      name: "Priority Mail Flat Rate Box - Medium",
      price: 16.25,
      category: "Shipping Supplies",
      rating: 4.9,
      reviews: 312,
      inStock: true,
      image: "📦",
      description: "Medium flat rate box with guaranteed rates",
    },
    {
      id: 3,
      name: "Bubble Mailers (Pack of 25)",
      price: 24.99,
      category: "Packaging",
      rating: 4.7,
      reviews: 189,
      inStock: true,
      image: "🛡️",
      description: "Protective bubble mailers for fragile items",
    },
    {
      id: 4,
      name: "Swift Courier Commemorative Stamps",
      price: 15.99,
      category: "Collectibles",
      rating: 4.6,
      reviews: 87,
      inStock: false,
      image: "🎫",
      description: "Limited edition Swift Courier collector stamps",
    },
    {
      id: 5,
      name: "Packing Tape (6-Pack)",
      price: 18.5,
      category: "Packaging",
      rating: 4.8,
      reviews: 456,
      inStock: true,
      image: "📏",
      description: "Heavy-duty packing tape, 2 inches x 55 yards",
    },
    {
      id: 6,
      name: "Express Mail Envelope",
      price: 28.75,
      category: "Shipping Supplies",
      rating: 4.9,
      reviews: 234,
      inStock: true,
      image: "✉️",
      description: "Official Express Mail flat-rate envelope",
    },
    {
      id: 7,
      name: "Foam Corners (Pack of 100)",
      price: 22.5,
      category: "Packaging",
      rating: 4.7,
      reviews: 156,
      inStock: true,
      image: "🧊",
      description: "Protective foam corners for box corners",
    },
    {
      id: 8,
      name: "International Shipping Labels",
      price: 19.99,
      category: "Shipping Supplies",
      rating: 4.8,
      reviews: 203,
      inStock: true,
      image: "🌍",
      description: "Pre-printed labels for international shipments",
    },
  ]

  const filteredAndSortedProducts = products
    .filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = selectedCategory === "all" || product.category === selectedCategory
      return matchesSearch && matchesCategory
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price
        case "price-high":
          return b.price - a.price
        case "rating":
          return b.rating - a.rating
        case "popular":
        default:
          return b.reviews - a.reviews
      }
    })

  const categories = Array.from(new Set(products.map((p) => p.category)))

  const handleAddToCart = async (productId: number) => {
    setCartLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 500))
    setCartItems([...cartItems, productId])
    setCartLoading(false)
  }

  const cartTotal = products
    .filter((p) => cartItems.includes(p.id))
    .reduce((sum, p) => sum + p.price, 0)

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Swift Store</h1>
          <p className="text-gray-600">Official stamps, shipping supplies, and collectible merchandise</p>
          <p className="text-sm text-blue-600 mt-2">
            <Truck className="inline h-4 w-4 mr-1" />
            Fast delivery on all orders
          </p>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="popular">Most Popular</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="rating">Highest Rated</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Products Grid */}
          <div className="lg:col-span-2">
            {filteredAndSortedProducts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredAndSortedProducts.map((product) => (
                  <Card key={product.id} className="hover:shadow-lg transition-shadow flex flex-col">
                    <CardContent className="p-4 flex-1 flex flex-col">
                      {/* Image Area */}
                      <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center mb-4 relative">
                        <div className="text-6xl">{product.image}</div>
                        {!product.inStock && (
                          <Badge variant="destructive" className="absolute top-2 right-2">
                            Out of Stock
                          </Badge>
                        )}
                      </div>

                      {/* Product Info */}
                      <div className="flex-1">
                        <Badge variant="outline" className="mb-2">
                          {product.category}
                        </Badge>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">{product.name}</h3>
                        <p className="text-sm text-gray-600 mb-4">{product.description}</p>

                        {/* Rating */}
                        <div className="flex items-center gap-2 mb-4">
                          <div className="flex">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < Math.floor(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-gray-600">
                            {product.rating} ({product.reviews} reviews)
                          </span>
                        </div>
                      </div>

                      {/* Price and Action */}
                      <div className="border-t pt-4">
                        <p className="text-2xl font-bold text-blue-600 mb-3">${product.price.toFixed(2)}</p>
                        <Button
                          className="w-full"
                          disabled={!product.inStock || cartLoading}
                          onClick={() => handleAddToCart(product.id)}
                        >
                          {cartLoading ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Adding...
                            </>
                          ) : (
                            <>
                              <ShoppingCart className="mr-2 h-4 w-4" />
                              Add to Cart
                            </>
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No products found matching your criteria.</p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Shopping Cart Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5" />
                  Shopping Cart
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {cartItems.length > 0 ? (
                  <>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {cartItems.map((itemId, index) => {
                        const product = products.find((p) => p.id === itemId)
                        return (
                          <div key={index} className="flex justify-between text-sm">
                            <span>{product?.name}</span>
                            <span className="font-medium">${product?.price.toFixed(2)}</span>
                          </div>
                        )
                      })}
                    </div>
                    <div className="border-t pt-4">
                      <div className="flex justify-between mb-4">
                        <span className="font-bold">Subtotal:</span>
                        <span className="font-bold">${cartTotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between mb-4 text-sm text-gray-600">
                        <span>Shipping:</span>
                        <span>$5.99</span>
                      </div>
                      <div className="border-t pt-4 flex justify-between mb-4">
                        <span className="font-bold">Total:</span>
                        <span className="font-bold text-lg text-blue-600">${(cartTotal + 5.99).toFixed(2)}</span>
                      </div>
                      <Button className="w-full mb-2">Proceed to Checkout</Button>
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => setCartItems([])}
                      >
                        Clear Cart
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <ShoppingCart className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                    <p className="text-gray-500">Your cart is empty</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Features */}
            <Card className="mt-4">
              <CardContent className="p-6 space-y-4">
                <div className="flex gap-3">
                  <Truck className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-sm">Fast Shipping</p>
                    <p className="text-xs text-gray-600">Ships within 1-2 business days</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Shield className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-sm">Secure Payment</p>
                    <p className="text-xs text-gray-600">100% encrypted transactions</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

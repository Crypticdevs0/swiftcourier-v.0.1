"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import {
  Menu,
  Package,
  Search,
  User,
  Bell,
  Settings,
  LogOut,
  LayoutDashboardIcon as Dashboard,
  Package2,
  Truck,
  Building2,
  HeadphonesIcon,
} from "lucide-react"
import { useAuth } from "@/hooks/useAuth"

export function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState(3) // Mock notification count
  const { user, logout, isAuthenticated, loading } = useAuth()
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await logout()
      router.push("/")
    } catch (error) {
      console.error("Failed to logout", error)
      // Optionally, show an error message to the user
    }
  }

  // Don't render anything while loading to prevent flash
  if (loading) {
    return (
      <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" prefetch={false} className="flex items-center space-x-2">
              <img
                src="https://cdn.builder.io/api/v1/image/assets%2F05799316402b4bab9e7c472c8fcd658c%2F1bc7206c245f486eb504f80badcf8fd2?format=webp&width=800"
                alt="Swift Courier logo"
                className="h-8 w-8 object-contain"
                width={32}
                height={32}
              />
              <span className="text-xl font-bold text-blue-600">Swift Courier</span>
            </Link>
            <div className="w-24 h-8 bg-gray-200 animate-pulse rounded" />
          </div>
        </div>
      </header>
    )
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 transition-all duration-300">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link
            href={isAuthenticated ? "/dashboard" : "/"}
            className="flex items-center space-x-2 transition-all duration-200 hover:scale-105"
          >
            <img
              src="https://cdn.builder.io/api/v1/image/assets%2F05799316402b4bab9e7c472c8fcd658c%2F1bc7206c245f486eb504f80badcf8fd2?format=webp&width=800"
              alt="Swift Courier logo"
              className="h-8 w-8 object-contain"
              width={32}
              height={32}
            />
            <span className="text-xl font-bold text-blue-600">Swift Courier</span>
          </Link>

          {/* Authenticated User Navigation */}
          {isAuthenticated ? (
            <>
              {/* Desktop Authenticated Navigation */}
              <NavigationMenu className="hidden lg:flex">
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <Link href="/dashboard" prefetch={false} legacyBehavior passHref>
                      <NavigationMenuLink className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50">
                        <Dashboard className="mr-2 h-4 w-4" />
                        Dashboard
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>

                  <NavigationMenuItem>
                    <NavigationMenuTrigger>
                      <Package2 className="mr-2 h-4 w-4" />
                      Ship & Track
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <div className="grid gap-3 p-6 w-[400px]">
                        <NavigationMenuLink asChild>
                          <Link
                            href="/shipping/create" prefetch={false}
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent"
                          >
                            <div className="text-sm font-medium leading-none">Create Shipment</div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              Create and manage your shipments
                            </p>
                          </Link>
                        </NavigationMenuLink>
                        <NavigationMenuLink asChild>
                          <Link
                            href="/track" prefetch={false}
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent"
                          >
                            <div className="text-sm font-medium leading-none">Track Packages</div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              Real-time package tracking
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      </div>
                    </NavigationMenuContent>
                  </NavigationMenuItem>

                  {user?.role === "business" || user?.role === "admin" ? (
                    <NavigationMenuItem>
                      <Link href="/business" prefetch={false} legacyBehavior passHref>
                        <NavigationMenuLink className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50">
                          <Building2 className="mr-2 h-4 w-4" />
                          Business
                        </NavigationMenuLink>
                      </Link>
                    </NavigationMenuItem>
                  ) : null}

                  <NavigationMenuItem>
                    <Link href="/support" prefetch={false} legacyBehavior passHref>
                      <NavigationMenuLink className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50">
                        <HeadphonesIcon className="mr-2 h-4 w-4" />
                        Support
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>

              {/* Authenticated User Actions */}
              <div className="flex items-center space-x-4">
                {/* Search - Hidden on small screens */}
                <div className="hidden md:flex items-center space-x-2">
                  <Label htmlFor="search-package" className="sr-only">
                    Search Package
                  </Label>
                  <Input id="search-package" placeholder="Track package..." className="w-48" />
                  <Button size="sm" variant="ghost">
                    <Search className="h-4 w-4" />
                  </Button>
                </div>

                {/* Notifications */}
                <Button variant="ghost" size="sm" className="relative">
                  <Bell className="h-4 w-4" />
                  {notifications > 0 && (
                    <Badge
                      variant="destructive"
                      className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs animate-pulse"
                    >
                      {notifications}
                    </Badge>
                  )}
                </Button>

                {/* User Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-medium">
                        {user?.name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || "U"}
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user?.name || "User"}</p>
                        <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                        {user?.role && (
                          <Badge variant="secondary" className="w-fit text-xs">
                            {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                          </Badge>
                        )}
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard" prefetch={false} className="cursor-pointer">
                        <Dashboard className="mr-2 h-4 w-4" />
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/profile" prefetch={false} className="cursor-pointer">
                        <User className="mr-2 h-4 w-4" />
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/settings" prefetch={false} className="cursor-pointer">
                        <Settings className="mr-2 h-4 w-4" />
                        Settings
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="cursor-pointer text-red-600 focus:text-red-600" onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Mobile Menu for Authenticated Users */}
                <Sheet open={isOpen} onOpenChange={setIsOpen}>
                  <SheetTrigger asChild className="lg:hidden">
                    <Button variant="ghost" size="sm" aria-label="Open menu">
                      <Menu className="h-5 w-5" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-80">
                    <div className="flex flex-col space-y-6 mt-8">
                      {/* User Info */}
                      <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium">
                          {user?.name?.charAt(0)?.toUpperCase() || "U"}
                        </div>
                        <div>
                          <p className="font-medium">{user?.name || "User"}</p>
                          <p className="text-sm text-muted-foreground">{user?.email}</p>
                        </div>
                      </div>

                      {/* Navigation Links */}
                      <div className="flex flex-col space-y-2">
                        <Link
                          href="/dashboard" prefetch={false}
                          className="flex items-center space-x-3 text-lg font-medium hover:text-blue-600 transition-colors p-2 rounded-md hover:bg-blue-50"
                          onClick={() => setIsOpen(false)}
                        >
                          <Dashboard className="h-5 w-5" />
                          <span>Dashboard</span>
                        </Link>
                        <Link
                          href="/track" prefetch={false}
                          className="flex items-center space-x-3 text-lg font-medium hover:text-blue-600 transition-colors p-2 rounded-md hover:bg-blue-50"
                          onClick={() => setIsOpen(false)}
                        >
                          <Truck className="h-5 w-5" />
                          <span>Track Package</span>
                        </Link>
                        <Link
                          href="/shipping/create" prefetch={false}
                          className="flex items-center space-x-3 text-lg font-medium hover:text-blue-600 transition-colors p-2 rounded-md hover:bg-blue-50"
                          onClick={() => setIsOpen(false)}
                        >
                          <Package2 className="h-5 w-5" />
                          <span>Create Shipment</span>
                        </Link>
                        {(user?.role === "business" || user?.role === "admin") && (
                          <Link
                            href="/business" prefetch={false}
                            className="flex items-center space-x-3 text-lg font-medium hover:text-blue-600 transition-colors p-2 rounded-md hover:bg-blue-50"
                            onClick={() => setIsOpen(false)}
                          >
                            <Building2 className="h-5 w-5" />
                            <span>Business</span>
                          </Link>
                        )}
                        <Link
                          href="/support" prefetch={false}
                          className="flex items-center space-x-3 text-lg font-medium hover:text-blue-600 transition-colors p-2 rounded-md hover:bg-blue-50"
                          onClick={() => setIsOpen(false)}
                        >
                          <HeadphonesIcon className="h-5 w-5" />
                          <span>Support</span>
                        </Link>
                      </div>

                      {/* Account Actions */}
                      <div className="border-t pt-4 space-y-2">
                        <Link
                          href="/profile" prefetch={false}
                          className="flex items-center space-x-3 text-lg font-medium hover:text-blue-600 transition-colors p-2 rounded-md hover:bg-blue-50"
                          onClick={() => setIsOpen(false)}
                        >
                          <User className="h-5 w-5" />
                          <span>Profile</span>
                        </Link>
                        <Link
                          href="/settings" prefetch={false}
                          className="flex items-center space-x-3 text-lg font-medium hover:text-blue-600 transition-colors p-2 rounded-md hover:bg-blue-50"
                          onClick={() => setIsOpen(false)}
                        >
                          <Settings className="h-5 w-5" />
                          <span>Settings</span>
                        </Link>
                        <button
                          onClick={() => {
                            setIsOpen(false)
                            handleLogout()
                          }}
                          className="flex items-center space-x-3 text-lg font-medium text-red-600 hover:text-red-700 transition-colors p-2 rounded-md hover:bg-red-50 w-full text-left"
                        >
                          <LogOut className="h-5 w-5" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </>
          ) : (
            <>
              {/* Guest Navigation */}
              <NavigationMenu className="hidden lg:flex">
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger>Ship</NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <div className="grid gap-3 p-6 w-[400px]">
                        <NavigationMenuLink asChild>
                          <Link
                            href="/shipping/domestic" prefetch={false}
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent"
                          >
                            <div className="text-sm font-medium leading-none">Domestic Shipping</div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              Ship within the country with various speed options
                            </p>
                          </Link>
                        </NavigationMenuLink>
                        <NavigationMenuLink asChild>
                          <Link
                            href="/shipping/international" prefetch={false}
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent"
                          >
                            <div className="text-sm font-medium leading-none">International Shipping</div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              Worldwide delivery with customs support
                            </p>
                          </Link>
                        </NavigationMenuLink>
                        <NavigationMenuLink asChild>
                          <Link
                            href="/swiftship" prefetch={false}
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent"
                          >
                            <div className="text-sm font-medium leading-none">SwiftShip</div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              Calculate, pay, and print shipping labels online
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      </div>
                    </NavigationMenuContent>
                  </NavigationMenuItem>

                  <NavigationMenuItem>
                    <NavigationMenuTrigger>Receive</NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <div className="grid gap-3 p-6 w-[400px]">
                        <NavigationMenuLink asChild>
                          <Link
                            href="/tracking/learn-more"
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent"
                          >
                            <div className="text-sm font-medium leading-none">Package Tracking</div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              Track your packages in real-time
                            </p>
                          </Link>
                        </NavigationMenuLink>
                        <NavigationMenuLink asChild>
                          <Link
                            href="/swift-preview" prefetch={false}
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent"
                          >
                            <div className="text-sm font-medium leading-none">Swift Preview</div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              Digital previews of incoming mail
                            </p>
                          </Link>
                        </NavigationMenuLink>
                        <NavigationMenuLink asChild>
                          <Link
                            href="/swift-box" prefetch={false}
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent"
                          >
                            <div className="text-sm font-medium leading-none">Swift Box</div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              Virtual mailbox services
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      </div>
                    </NavigationMenuContent>
                  </NavigationMenuItem>

                  <NavigationMenuItem>
                    <Link href="/store" prefetch={false} legacyBehavior passHref>
                      <NavigationMenuLink className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50">
                        Swift Store
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>

                  <NavigationMenuItem>
                    <Link href="/business" prefetch={false} legacyBehavior passHref>
                      <NavigationMenuLink className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50">
                        Business
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>

                  <NavigationMenuItem>
                    <Link href="/support" prefetch={false} legacyBehavior passHref>
                      <NavigationMenuLink className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50">
                        Support
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>

              {/* Guest User Actions */}
              <div className="flex items-center space-x-4">
                <div className="hidden md:flex items-center space-x-2">
                  <Label htmlFor="search" className="sr-only">
                    Search
                  </Label>
                  <Input id="search" placeholder="Search..." className="w-48" />
                  <Button size="sm" variant="ghost">
                    <Search className="h-4 w-4" />
                  </Button>
                </div>

                <Link href="/auth" prefetch={false}>
                  <Button variant="ghost" size="sm" className="transition-all duration-200 hover:scale-105">
                    <User className="h-4 w-4 mr-2" />
                    Sign In
                  </Button>
                </Link>

                {/* Mobile Menu for Guests */}
                <Sheet open={isOpen} onOpenChange={setIsOpen}>
                  <SheetTrigger asChild className="lg:hidden">
                    <Button variant="ghost" size="sm" aria-label="Open menu">
                      <Menu className="h-5 w-5" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-80">
                    <div className="flex flex-col space-y-4 mt-8">
                      <Link
                        href="/swiftship" prefetch={false}
                        className="text-lg font-medium hover:text-blue-600 transition-colors"
                        onClick={() => setIsOpen(false)}
                      >
                        SwiftShip
                      </Link>
                      <Link
                        href="/track" prefetch={false}
                        className="text-lg font-medium hover:text-blue-600 transition-colors"
                        onClick={() => setIsOpen(false)}
                      >
                        Track Package
                      </Link>
                      <Link
                        href="/store" prefetch={false}
                        className="text-lg font-medium hover:text-blue-600 transition-colors"
                        onClick={() => setIsOpen(false)}
                      >
                        Swift Store
                      </Link>
                      <Link
                        href="/business" prefetch={false}
                        className="text-lg font-medium hover:text-blue-600 transition-colors"
                        onClick={() => setIsOpen(false)}
                      >
                        Business
                      </Link>
                      <Link
                        href="/support" prefetch={false}
                        className="text-lg font-medium hover:text-blue-600 transition-colors"
                        onClick={() => setIsOpen(false)}
                      >
                        Support
                      </Link>
                      <Link
                        href="/auth" prefetch={false}
                        className="text-lg font-medium hover:text-blue-600 transition-colors"
                        onClick={() => setIsOpen(false)}
                      >
                        Sign In
                      </Link>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  )
}

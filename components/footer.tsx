import { Package, Facebook, Twitter, Instagram, Linkedin } from "lucide-react"
import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Package className="h-6 w-6 text-blue-400" />
              <span className="text-lg font-bold">Swift Courier</span>
            </div>
            <p className="text-gray-300 mb-4">
              Your trusted delivery partner since 2020. Fast, reliable, and secure delivery services nationwide.
            </p>
            <div className="flex space-x-4">
              <Facebook className="h-5 w-5 text-gray-400 hover:text-blue-400 cursor-pointer" />
              <Twitter className="h-5 w-5 text-gray-400 hover:text-blue-400 cursor-pointer" />
              <Instagram className="h-5 w-5 text-gray-400 hover:text-blue-400 cursor-pointer" />
              <Linkedin className="h-5 w-5 text-gray-400 hover:text-blue-400 cursor-pointer" />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/track" prefetch={false} className="text-gray-300 hover:text-white">
                  Track Package
                </Link>
              </li>
              <li>
                <Link href="/swiftship" prefetch={false} className="text-gray-300 hover:text-white">
                  SwiftShip
                </Link>
              </li>
              <li>
                <Link href="/locations" prefetch={false} className="text-gray-300 hover:text-white">
                  Find Locations
                </Link>
              </li>
              <li>
                <Link href="/schedule-pickup" prefetch={false} className="text-gray-300 hover:text-white">
                  Schedule Pickup
                </Link>
              </li>
              <li>
                <Link href="/rates" prefetch={false} className="text-gray-300 hover:text-white">
                  Calculate Rates
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Services</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/swift-preview" prefetch={false} className="text-gray-300 hover:text-white">
                  Swift Preview
                </Link>
              </li>
              <li>
                <Link href="/swift-box" prefetch={false} className="text-gray-300 hover:text-white">
                  Swift Box
                </Link>
              </li>
              <li>
                <Link href="/business" prefetch={false} className="text-gray-300 hover:text-white">
                  Business Services
                </Link>
              </li>
              <li>
                <Link href="/international" prefetch={false} className="text-gray-300 hover:text-white">
                  International
                </Link>
              </li>
              <li>
                <Link href="/store" prefetch={false} className="text-gray-300 hover:text-white">
                  Swift Store
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/support" prefetch={false} className="text-gray-300 hover:text-white">
                  Customer Service
                </Link>
              </li>
              <li>
                <Link href="/faq" prefetch={false} className="text-gray-300 hover:text-white">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/claims" prefetch={false} className="text-gray-300 hover:text-white">
                  File a Claim
                </Link>
              </li>
              <li>
                <Link href="/security" prefetch={false} className="text-gray-300 hover:text-white">
                  Security
                </Link>
              </li>
              <li>
                <Link href="/careers" prefetch={false} className="text-gray-300 hover:text-white">
                  Careers
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">© 2024 Swift Courier. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="/privacy" prefetch={false} className="text-gray-400 hover:text-white text-sm">
              Privacy Policy
            </Link>
            <Link href="/terms" prefetch={false} className="text-gray-400 hover:text-white text-sm">
              Terms of Service
            </Link>
            <Link href="/accessibility" prefetch={false} className="text-gray-400 hover:text-white text-sm">
              Accessibility
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

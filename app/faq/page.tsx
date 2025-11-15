"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Search, ChevronDown } from "lucide-react"

const faqs = [
  {
    category: "Shipping",
    items: [
      {
        question: "How long does standard shipping take?",
        answer: "Standard shipping typically takes 3-5 business days. Express shipping is 1-2 business days, and overnight shipping delivers by the next business day. Times are estimates and may vary based on location.",
      },
      {
        question: "What are your shipping rates?",
        answer: "Shipping rates depend on package weight, dimensions, and destination. Use our Rates Calculator to get an instant quote for your specific package and destination.",
      },
      {
        question: "Do you ship internationally?",
        answer: "Yes! We offer international shipping to over 220 countries. International shipping rates and delivery times vary by destination. Check our International Shipping page for more details.",
      },
      {
        question: "Can I track my package?",
        answer: "Absolutely. Every shipment includes tracking. You'll receive a tracking number via email, and you can track your package in real-time on our Track page.",
      },
      {
        question: "What if my package arrives damaged?",
        answer: "If your package arrives damaged, contact us immediately with photos of the damage. File a claim within 30 days of delivery, and we'll work to resolve it.",
      },
    ],
  },
  {
    category: "Accounts & Payments",
    items: [
      {
        question: "How do I create an account?",
        answer: "Click the Sign Up button at the top of the page. Provide your email, create a password, and fill in your basic information. Your account will be active immediately.",
      },
      {
        question: "What payment methods do you accept?",
        answer: "We accept all major credit cards (Visa, Mastercard, American Express), debit cards, and digital payment methods like PayPal and Apple Pay.",
      },
      {
        question: "Can I save my payment information?",
        answer: "Yes, you can securely save your payment methods in your account for faster checkout on future shipments. Your information is encrypted and PCI-DSS compliant.",
      },
      {
        question: "How do I reset my password?",
        answer: "Click the Forgot Password link on the login page. Enter your email address, and we'll send you a link to reset your password.",
      },
      {
        question: "Can I get a refund for my shipment?",
        answer: "Refund eligibility depends on the service purchased. Contact our support team, and we'll review your case. Refunds are typically processed within 5-7 business days.",
      },
    ],
  },
  {
    category: "Pickups & Dropoffs",
    items: [
      {
        question: "How do I schedule a pickup?",
        answer: "Use our Schedule a Pickup tool. Select your preferred date and time window, provide your address and package details, and we'll arrange a pickup at your convenience.",
      },
      {
        question: "Is there a fee for pickup?",
        answer: "Standard pickups are free for most customers. Express pickups (within 2 hours) may incur a small fee. Check the pricing during scheduling.",
      },
      {
        question: "Where can I drop off packages?",
        answer: "We have hundreds of drop-off locations. Use our Find Locations tool to find the nearest drop box or Swift Courier service center.",
      },
      {
        question: "What are your drop-off hours?",
        answer: "Drop-off hours vary by location. Most offices are open 8 AM - 6 PM weekdays, with limited weekend hours. Check your specific location for exact hours.",
      },
      {
        question: "Can I drop off after hours?",
        answer: "Yes! We have 24/7 secure drop boxes at many locations for convenient after-hours dropoffs.",
      },
    ],
  },
  {
    category: "Special Services",
    items: [
      {
        question: "What is signature confirmation?",
        answer: "Signature confirmation requires the recipient to sign for the package, ensuring secure delivery. This adds $2.50 to your shipment and is available for most services.",
      },
      {
        question: "Do you offer package insurance?",
        answer: "Yes, we offer optional insurance coverage. Insure your package for its declared value for $2.50. Claims must be filed within 30 days of delivery.",
      },
      {
        question: "Can I schedule multiple pickups?",
        answer: "Yes! You can set up recurring pickups for business customers. Contact our business team for volume discounts and recurring pickup schedules.",
      },
      {
        question: "What if my package is too large?",
        answer: "We handle packages up to 150 lbs and 108 inches in length. For oversized freight, contact our business services team for a custom quote.",
      },
      {
        question: "Do you offer white-label shipping solutions?",
        answer: "Yes, we offer white-label and API solutions for businesses. Visit our Business page or contact our sales team for more information.",
      },
    ],
  },
  {
    category: "Support & Claims",
    items: [
      {
        question: "How do I file a claim?",
        answer: "File a claim within 30 days of delivery on our File a Claim page. Provide your tracking number, claim type, package value, and description of the issue.",
      },
      {
        question: "What's the maximum claim amount?",
        answer: "Standard liability coverage is up to $100. For higher-value items, purchase additional insurance at checkout.",
      },
      {
        question: "How long does a claim take to process?",
        answer: "We aim to process claims within 5 business days. Complex claims may take up to 30 days. You'll receive updates via email.",
      },
      {
        question: "How do I contact customer support?",
        answer: "Contact us 24/7 on our Support page via email, phone, or live chat. Our team is here to help!",
      },
      {
        question: "Are you open on weekends?",
        answer: "Yes, we offer limited weekend support (Sat 9 AM - 4 PM, Sun 10 AM - 3 PM EST). Many locations offer 24/7 drop-off services.",
      },
    ],
  },
]

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null)

  const filteredFaqs = faqs.map((category) => ({
    ...category,
    items: category.items.filter(
      (item) =>
        item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.answer.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  })).filter((category) => category.items.length > 0)

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h1>
          <p className="text-gray-600">Find answers to common questions about shipping, accounts, pickups, and more</p>
        </div>

        {/* Search */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                placeholder="Search FAQ..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 text-base"
              />
            </div>
          </CardContent>
        </Card>

        {/* FAQ Accordion */}
        <div className="space-y-6">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((category) => (
              <Card key={category.category}>
                <CardHeader>
                  <CardTitle className="text-lg">{category.category}</CardTitle>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    {category.items.map((item, index) => (
                      <AccordionItem key={index} value={`${category.category}-${index}`}>
                        <AccordionTrigger className="text-left hover:no-underline hover:text-blue-600">
                          <span className="text-base font-medium">{item.question}</span>
                        </AccordionTrigger>
                        <AccordionContent className="text-gray-600 text-base leading-relaxed">
                          {item.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <p className="text-gray-500">No FAQs found matching your search. Try different keywords or contact our support team.</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Contact Section */}
        <Card className="mt-8 bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle>Didn't find what you're looking for?</CardTitle>
            <CardDescription>Our support team is ready to help</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-4">Contact our customer service team for personalized assistance.</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="font-semibold text-gray-900">Email</p>
                <p className="text-gray-600">support@swiftcourier.com</p>
              </div>
              <div>
                <p className="font-semibold text-gray-900">Phone</p>
                <p className="text-gray-600">1-800-SWIFT-123</p>
              </div>
              <div>
                <p className="font-semibold text-gray-900">Live Chat</p>
                <p className="text-gray-600">Available 24/7 on our Support page</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

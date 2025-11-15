import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle2, AlertCircle, Mail } from "lucide-react"

export default function AccessibilityPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Accessibility Statement</h1>
          <p className="text-gray-600">Swift Courier is committed to ensuring digital accessibility for people with disabilities.</p>
        </div>

        <div className="space-y-6">
          {/* Commitment */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Our Commitment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-gray-700 leading-relaxed">
              <p>
                Swift Courier is committed to providing a website and mobile applications that are accessible to all users, regardless of ability or disability. We believe that digital accessibility is essential for everyone and we're continuously working to improve the accessibility of our online services.
              </p>
              <p>
                We strive to conform to the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA standards and best practices.
              </p>
            </CardContent>
          </Card>

          {/* What We've Done */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">What We're Doing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-gray-700">
              <div className="space-y-3">
                <div className="flex gap-3">
                  <CheckCircle2 className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">Keyboard Navigation</p>
                    <p className="text-sm">All features are accessible via keyboard for users who cannot use a mouse.</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <CheckCircle2 className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">Screen Reader Support</p>
                    <p className="text-sm">Our website is optimized for screen readers used by people with visual impairments.</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <CheckCircle2 className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">Color Contrast</p>
                    <p className="text-sm">Text and interactive elements meet WCAG AA contrast requirements for readability.</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <CheckCircle2 className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">Resizable Text</p>
                    <p className="text-sm">Users can adjust text size in their browser without breaking the layout.</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <CheckCircle2 className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">Accessible Forms</p>
                    <p className="text-sm">All forms include proper labels and error messages for users with any ability.</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <CheckCircle2 className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">Responsive Design</p>
                    <p className="text-sm">Our site works well on all screen sizes, including mobile devices and magnified views.</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <CheckCircle2 className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">Video Accessibility</p>
                    <p className="text-sm">Videos include captions and transcripts for users who are deaf or hard of hearing.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Standards */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Accessibility Standards</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-gray-700 leading-relaxed">
              <p>
                We aim to conform to the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA, which is an internationally recognized set of recommendations for web accessibility developed by the World Wide Web Consortium (W3C).
              </p>
              <div>
                <p className="font-semibold mb-2">Key Principles (POUR):</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Perceivable:</strong> Information must be presentable in ways that users can perceive</li>
                  <li><strong>Operable:</strong> Components must be usable with keyboard and assistive technologies</li>
                  <li><strong>Understandable:</strong> Information and operations must be clear and predictable</li>
                  <li><strong>Robust:</strong> Content must be compatible with current and future assistive technologies</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Known Issues */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                Known Accessibility Issues
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-gray-700 leading-relaxed">
              <p>
                While we work continuously to improve accessibility, some areas may have limitations:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Interactive map features may have limited screen reader support (we're working on this)</li>
                <li>Some PDF documents may not be fully accessible</li>
                <li>Older browsers may not support all accessibility features</li>
              </ul>
              <p className="mt-4">
                We're actively working to address these issues and appreciate your feedback in helping us improve.
              </p>
            </CardContent>
          </Card>

          {/* Assistive Technology Support */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Assistive Technology Support</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-gray-700 leading-relaxed">
              <p>We've tested our website with the following assistive technologies:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="bg-gray-50 p-4 rounded">
                  <p className="font-semibold">Screen Readers</p>
                  <ul className="text-sm space-y-1 mt-2">
                    <li>• NVDA (Windows)</li>
                    <li>• JAWS (Windows)</li>
                    <li>• VoiceOver (Mac, iOS)</li>
                    <li>• TalkBack (Android)</li>
                  </ul>
                </div>
                <div className="bg-gray-50 p-4 rounded">
                  <p className="font-semibold">Magnification Software</p>
                  <ul className="text-sm space-y-1 mt-2">
                    <li>• ZoomText</li>
                    <li>• Built-in OS magnification</li>
                    <li>• Browser zoom</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Additional Resources */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Additional Resources</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-gray-700 leading-relaxed">
              <p>Learn more about web accessibility:</p>
              <ul className="list-disc pl-6 space-y-2 mt-2">
                <li><a href="https://www.w3.org/WAI/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Web Accessibility Initiative (WAI)</a> - Resources by W3C</li>
                <li><a href="https://www.wcag.org/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Web Content Accessibility Guidelines (WCAG)</a> - Official standards</li>
                <li><a href="https://www.ada.gov/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Americans with Disabilities Act (ADA)</a> - Legal information</li>
              </ul>
            </CardContent>
          </Card>

          {/* Feedback */}
          <Card className="bg-blue-50 border-blue-200">
            <CardHeader>
              <CardTitle className="text-xl">Your Feedback Matters</CardTitle>
              <CardDescription>Help us improve accessibility</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">
                If you experience any accessibility barriers while using our website or services, please let us know. Your feedback helps us make improvements for all users.
              </p>
              <div className="space-y-2">
                <p className="font-semibold text-gray-900">Contact our Accessibility Team:</p>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <span className="text-gray-700">accessibility@swiftcourier.com</span>
                </div>
                <p className="text-sm text-gray-600 mt-3">
                  Please include details about the accessibility issue, the page URL, and what assistive technology you're using. We'll respond within 5 business days.
                </p>
              </div>
              <Button size="lg" className="w-full mt-4">
                Report an Accessibility Issue
              </Button>
            </CardContent>
          </Card>

          {/* Statement */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Accessibility Statement Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-gray-700 leading-relaxed text-sm">
              <p>
                <strong>Date Statement Published:</strong> December 2024
              </p>
              <p>
                <strong>Date Statement Last Updated:</strong> December 2024
              </p>
              <p>
                <strong>Assessment Method:</strong> We assessed this website for compliance with WCAG 2.1 Level AA standards through automated testing, manual testing, and third-party audits.
              </p>
              <p>
                <strong>Scope:</strong> This statement applies to swift-courier.com and all associated subdomains.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

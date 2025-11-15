import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
          <p className="text-gray-600">Last Updated: December 2024</p>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">1. Introduction</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-gray-700 leading-relaxed">
              <p>
                Swift Courier ("we," "us," "our," or "Company") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our shipping services.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl">2. Information We Collect</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-gray-700 leading-relaxed">
              <div>
                <h4 className="font-semibold mb-2">Personal Information</h4>
                <p>
                  We collect information you provide directly to us, including:
                </p>
                <ul className="list-disc pl-6 space-y-1 mt-2">
                  <li>Name, email address, and phone number</li>
                  <li>Billing address and shipping address</li>
                  <li>Payment information (credit card, debit card, etc.)</li>
                  <li>Shipment details (contents, weight, dimensions)</li>
                  <li>Profile information and account credentials</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Automatically Collected Information</h4>
                <p>
                  When you visit our website, we automatically collect:
                </p>
                <ul className="list-disc pl-6 space-y-1 mt-2">
                  <li>IP address and browser type</li>
                  <li>Pages visited and time spent on our site</li>
                  <li>Referring website and links clicked</li>
                  <li>Device type and operating system</li>
                  <li>Cookies and similar tracking technologies</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl">3. How We Use Your Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-gray-700 leading-relaxed">
              <p>We use the information we collect to:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Process and fulfill your shipping requests</li>
                <li>Send you shipping confirmations and tracking updates</li>
                <li>Process payments and prevent fraud</li>
                <li>Improve our website and services</li>
                <li>Send promotional emails (you can opt-out anytime)</li>
                <li>Respond to your inquiries and customer service requests</li>
                <li>Comply with legal obligations and regulations</li>
                <li>Analyze usage patterns and provide customer analytics</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl">4. Information Sharing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-gray-700 leading-relaxed">
              <p>
                We do not sell your personal information. However, we may share your information with:
              </p>
              <ul className="list-disc pl-6 space-y-1 mt-2">
                <li>
                  <strong>Service Providers:</strong> Third parties who assist us in operating our website and conducting our business (payment processors, delivery partners)
                </li>
                <li>
                  <strong>Legal Requirements:</strong> When required by law or if we believe in good faith that disclosure is necessary
                </li>
                <li>
                  <strong>Business Transfers:</strong> If Swift Courier is merged or acquired, information may be transferred as part of that transaction
                </li>
                <li>
                  <strong>Your Consent:</strong> When you explicitly authorize sharing with third parties
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl">5. Data Security</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-gray-700 leading-relaxed">
              <p>
                We implement comprehensive security measures to protect your personal information, including:
              </p>
              <ul className="list-disc pl-6 space-y-1 mt-2">
                <li>SSL/TLS encryption for all data in transit</li>
                <li>PCI-DSS compliance for payment card information</li>
                <li>Secure password storage with hashing and salting</li>
                <li>Regular security audits and penetration testing</li>
                <li>Limited access to personal information by authorized personnel only</li>
              </ul>
              <p className="mt-3">
                While we strive to protect your information, no method of transmission over the Internet is 100% secure. We cannot guarantee absolute security.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl">6. Cookies and Tracking</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-gray-700 leading-relaxed">
              <p>
                We use cookies and similar tracking technologies to enhance your experience, including:
              </p>
              <ul className="list-disc pl-6 space-y-1 mt-2">
                <li><strong>Session Cookies:</strong> Temporary cookies that expire when you close your browser</li>
                <li><strong>Persistent Cookies:</strong> Cookies that remain on your device for a specified period</li>
                <li><strong>Analytics Cookies:</strong> To understand how visitors use our site</li>
                <li><strong>Marketing Cookies:</strong> To display personalized advertisements</li>
              </ul>
              <p className="mt-3">
                You can control cookies through your browser settings. Disabling cookies may affect functionality of our website.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl">7. Your Rights and Choices</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-gray-700 leading-relaxed">
              <p>You have the right to:</p>
              <ul className="list-disc pl-6 space-y-1 mt-2">
                <li>Access your personal information</li>
                <li>Correct inaccurate or incomplete information</li>
                <li>Request deletion of your personal information</li>
                <li>Opt-out of marketing communications</li>
                <li>Request a copy of your data in portable format</li>
                <li>Lodge a complaint with relevant authorities</li>
              </ul>
              <p className="mt-3">
                To exercise these rights, please contact us using the information provided in Section 10.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl">8. Data Retention</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-gray-700 leading-relaxed">
              <p>
                We retain your personal information for as long as necessary to provide our services and fulfill the purposes outlined in this Privacy Policy. Specific retention periods include:
              </p>
              <ul className="list-disc pl-6 space-y-1 mt-2">
                <li>Account information: Retained while your account is active, plus 1 year after closure</li>
                <li>Shipment records: Retained for 7 years for legal and audit purposes</li>
                <li>Transaction data: Retained for 7 years per legal requirements</li>
                <li>Marketing information: Retained until you opt-out</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl">9. Third-Party Links</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-gray-700 leading-relaxed">
              <p>
                Our website may contain links to third-party websites. We are not responsible for the privacy practices or content of these external sites. Please review their privacy policies before providing your information.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl">10. Contact Us</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-gray-700 leading-relaxed">
              <p>
                If you have questions about this Privacy Policy or our privacy practices, please contact us:
              </p>
              <div className="space-y-2 mt-4">
                <p><strong>Email:</strong> privacy@swiftcourier.com</p>
                <p><strong>Phone:</strong> 1-800-SWIFT-123</p>
                <p><strong>Mailing Address:</strong> Swift Courier, 123 Main Street, New York, NY 10001</p>
                <p><strong>Data Protection Officer:</strong> dpo@swiftcourier.com</p>
              </div>
              <p className="mt-4">
                We will respond to your inquiry within 30 days.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl">11. Changes to This Policy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-gray-700 leading-relaxed">
              <p>
                We may update this Privacy Policy periodically to reflect changes in our practices or applicable laws. We will notify you of significant changes via email or by posting the updated policy on our website. Your continued use of our services indicates acceptance of the updated Privacy Policy.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

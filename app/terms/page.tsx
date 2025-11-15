import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Terms of Service</h1>
          <p className="text-gray-600">Last Updated: December 2024</p>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">1. Acceptance of Terms</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-gray-700 leading-relaxed">
              <p>
                By accessing and using the Swift Courier website and services, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl">2. Use License</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-gray-700 leading-relaxed">
              <p>
                Permission is granted to temporarily download one copy of the materials (information or software) on Swift Courier's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Modifying or copying the materials</li>
                <li>Using the materials for any commercial purpose or for any public display</li>
                <li>Attempting to decompile or reverse engineer any software contained on the website</li>
                <li>Removing any copyright or other proprietary notations from the materials</li>
                <li>Transferring the materials to another person or "mirroring" the materials on any other server</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl">3. Disclaimer</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-gray-700 leading-relaxed">
              <p>
                The materials on Swift Courier's website are provided "as is." Swift Courier makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl">4. Limitations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-gray-700 leading-relaxed">
              <p>
                In no event shall Swift Courier or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on the Swift Courier website.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl">5. Accuracy of Materials</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-gray-700 leading-relaxed">
              <p>
                The materials appearing on Swift Courier's website could include technical, typographical, or photographic errors. Swift Courier does not warrant that any of the materials on the website are accurate, complete, or current. Swift Courier may make changes to the materials contained on the website at any time without notice.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl">6. Links</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-gray-700 leading-relaxed">
              <p>
                Swift Courier has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by Swift Courier of the site. Use of any such linked website is at the user's own risk.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl">7. Modifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-gray-700 leading-relaxed">
              <p>
                Swift Courier may revise these terms of service for the website at any time without notice. By using this website, you are agreeing to be bound by the then current version of these terms of service.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl">8. Governing Law</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-gray-700 leading-relaxed">
              <p>
                These terms and conditions of use are governed by and construed in accordance with the laws of the United States, and you irrevocably submit to the exclusive jurisdiction of the courts located in New York.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl">9. Shipping Policy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-gray-700 leading-relaxed">
              <p>
                Shipping rates are calculated based on package weight, dimensions, and destination. Delivery timeframes are estimates and not guaranteed. Swift Courier is not liable for delays caused by weather, traffic, or other unforeseen circumstances.
              </p>
              <p>
                All packages are insured for up to $100. Additional insurance is available for higher-value items.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl">10. Payment Terms</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-gray-700 leading-relaxed">
              <p>
                Payment must be received before shipment is processed, unless other arrangements have been made. We accept all major credit cards, debit cards, and digital payment methods. All charges are in US dollars.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl">11. Refunds and Returns</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-gray-700 leading-relaxed">
              <p>
                Refunds for unused shipping services may be requested within 7 days of purchase. A 10% processing fee may apply. Shipping fees for completed shipments are non-refundable.
              </p>
              <p>
                Claims for lost or damaged packages must be filed within 30 days of delivery.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl">12. Prohibited Activities</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-gray-700 leading-relaxed">
              <p>You agree not to use the Service to:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Ship illegal items or items that violate local, state, or federal law</li>
                <li>Ship hazardous materials without proper declaration and packaging</li>
                <li>Misrepresent the contents or value of a package</li>
                <li>Use the service for unlawful purposes or in violation of any laws</li>
                <li>Harass, abuse, or harm any person through the service</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl">13. Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-gray-700 leading-relaxed">
              <p>If you have any questions about these Terms of Service, please contact us:</p>
              <div className="space-y-1 mt-4">
                <p><strong>Email:</strong> legal@swiftcourier.com</p>
                <p><strong>Phone:</strong> 1-800-SWIFT-123</p>
                <p><strong>Mailing Address:</strong> Swift Courier, 123 Main Street, New York, NY 10001</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

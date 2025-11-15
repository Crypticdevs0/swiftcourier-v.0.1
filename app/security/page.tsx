import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Lock, AlertTriangle, CheckCircle2, Key, Zap } from "lucide-react"

export default function SecurityPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Security & Privacy</h1>
          <p className="text-gray-600">Swift Courier's commitment to protecting your data and maintaining the highest security standards</p>
        </div>

        <div className="space-y-6">
          {/* Security Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-blue-600" />
                Security Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">
                Swift Courier implements multi-layered security measures to protect customer data, transactions, and shipment information. Our security practices comply with industry standards and regulations.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="font-semibold text-green-900">SSL/TLS Encryption</p>
                  <p className="text-sm text-green-700 mt-1">All data in transit is encrypted with 256-bit encryption</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="font-semibold text-blue-900">PCI-DSS Compliant</p>
                  <p className="text-sm text-blue-700 mt-1">Level 1 compliance for secure payment processing</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <p className="font-semibold text-purple-900">Regular Audits</p>
                  <p className="text-sm text-purple-700 mt-1">Third-party security audits conducted quarterly</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Data Protection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5 text-green-600" />
                Data Protection
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">Encryption at Rest</p>
                    <p className="text-sm text-gray-600">All sensitive data is encrypted using AES-256 encryption when stored in our databases</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">Secure Backups</p>
                    <p className="text-sm text-gray-600">Daily automated backups are encrypted and stored in geographically distributed data centers</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">Access Controls</p>
                    <p className="text-sm text-gray-600">Role-based access control (RBAC) limits employee access to sensitive data on a need-to-know basis</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">Audit Logging</p>
                    <p className="text-sm text-gray-600">All access to sensitive data is logged and monitored for suspicious activity</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Incident Response */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-600" />
                Incident Response
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-gray-700">
              <p>
                Swift Courier maintains a comprehensive incident response program to quickly address any potential security issues.
              </p>
              <div className="space-y-3">
                <div className="p-4 bg-amber-50 rounded-lg">
                  <p className="font-semibold mb-2">24/7 Security Monitoring</p>
                  <p className="text-sm">Our security team monitors systems 24/7 for threats and suspicious activities</p>
                </div>
                <div className="p-4 bg-amber-50 rounded-lg">
                  <p className="font-semibold mb-2">Incident Notification</p>
                  <p className="text-sm">In the rare event of a security incident, affected customers will be notified within 72 hours as required by law</p>
                </div>
                <div className="p-4 bg-amber-50 rounded-lg">
                  <p className="font-semibold mb-2">Breach Contact</p>
                  <p className="text-sm">
                    For security issues, contact: <a href="mailto:security@swiftcourier.com" className="text-blue-600 hover:underline">security@swiftcourier.com</a>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Security Best Practices */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5 text-indigo-600" />
                Best Practices for Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-gray-700">
                <li className="flex gap-3">
                  <span className="text-indigo-600 font-bold">1.</span>
                  <span><strong>Strong Passwords:</strong> Use unique, complex passwords with uppercase, lowercase, numbers, and special characters</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-indigo-600 font-bold">2.</span>
                  <span><strong>Two-Factor Authentication:</strong> Enable 2FA on your account for added security</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-indigo-600 font-bold">3.</span>
                  <span><strong>Regular Updates:</strong> Keep your browser and operating system up to date</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-indigo-600 font-bold">4.</span>
                  <span><strong>Public WiFi:</strong> Avoid accessing sensitive data on public WiFi networks</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-indigo-600 font-bold">5.</span>
                  <span><strong>Phishing:</strong> Never click links in suspicious emails; verify URLs before entering credentials</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-indigo-600 font-bold">6.</span>
                  <span><strong>Session Management:</strong> Log out after each session, especially on shared devices</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Compliance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-yellow-600" />
                Compliance & Certifications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <p className="font-semibold mb-2">SOC 2 Type II</p>
                  <p className="text-sm text-gray-600">Annual certification of security controls and operations</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <p className="font-semibold mb-2">ISO 27001</p>
                  <p className="text-sm text-gray-600">International standard for information security management</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <p className="font-semibold mb-2">GDPR Compliant</p>
                  <p className="text-sm text-gray-600">Full compliance with EU General Data Protection Regulation</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <p className="font-semibold mb-2">CCPA Compliant</p>
                  <p className="text-sm text-gray-600">California Consumer Privacy Act compliance</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Security Team */}
          <Card className="bg-blue-50 border-blue-200">
            <CardHeader>
              <CardTitle>Security Concerns?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">
                If you discover a security vulnerability or have security concerns, please contact our security team immediately.
              </p>
              <div className="space-y-2">
                <p><strong>Email:</strong> <a href="mailto:security@swiftcourier.com" className="text-blue-600 hover:underline">security@swiftcourier.com</a></p>
                <p><strong>Phone:</strong> +1-800-SWIFT-SEC</p>
                <p><strong>Responsible Disclosure:</strong> We appreciate security researchers who responsibly disclose vulnerabilities. Please allow 30 days for us to respond.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/hooks/useAuth"
import {
  Bell,
  Lock,
  Moon,
  Sun,
  Globe,
  LogOut,
  AlertCircle,
  Check,
  ChevronRight,
} from "lucide-react"

export default function SettingsPage() {
  const { user, loading, logout } = useAuth()
  const router = useRouter()
  const [theme, setTheme] = useState("light")
  const [language, setLanguage] = useState("en")
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle")

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-12 bg-gray-200 rounded w-1/4"></div>
            <div className="space-y-4">
              <div className="h-32 bg-gray-200 rounded-lg"></div>
              <div className="h-32 bg-gray-200 rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    router.push("/auth")
    return null
  }

  const handleSave = async () => {
    setSaveStatus("saving")
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))
    setSaveStatus("saved")
    setTimeout(() => setSaveStatus("idle"), 2000)
  }

  const handleLogout = async () => {
    await logout()
    router.push("/")
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
          <p className="text-gray-600">Manage your account preferences and security settings</p>
        </div>

        {/* Save Status */}
        {saveStatus === "saved" && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 text-green-700">
            <Check className="h-5 w-5" />
            Settings saved successfully
          </div>
        )}

        <Tabs defaultValue="notifications" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="privacy">Privacy</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>

          {/* Notifications */}
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>Manage how and when you receive notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-center gap-3 flex-1">
                      <Bell className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-medium">Shipment Updates</p>
                        <p className="text-sm text-gray-600">
                          Get notified when your packages are picked up, in transit, or delivered
                        </p>
                      </div>
                    </div>
                    <input type="checkbox" defaultChecked className="h-5 w-5" />
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-center gap-3 flex-1">
                      <Bell className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-medium">Promotional Emails</p>
                        <p className="text-sm text-gray-600">
                          Receive updates about new services, discounts, and special offers
                        </p>
                      </div>
                    </div>
                    <input type="checkbox" className="h-5 w-5" />
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-center gap-3 flex-1">
                      <Bell className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-medium">Account Activity</p>
                        <p className="text-sm text-gray-600">
                          Get alerts about account changes, login attempts, and security updates
                        </p>
                      </div>
                    </div>
                    <input type="checkbox" defaultChecked className="h-5 w-5" />
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-center gap-3 flex-1">
                      <Bell className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-medium">SMS Text Messages</p>
                        <p className="text-sm text-gray-600">
                          Receive delivery updates and urgent alerts via text message
                        </p>
                      </div>
                    </div>
                    <input type="checkbox" className="h-5 w-5" />
                  </div>
                </div>

                <div className="border-t pt-4 flex justify-end">
                  <Button onClick={handleSave} disabled={saveStatus === "saving"}>
                    {saveStatus === "saving" ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Privacy */}
          <TabsContent value="privacy">
            <Card>
              <CardHeader>
                <CardTitle>Privacy Settings</CardTitle>
                <CardDescription>Control how your data is used and shared</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-center gap-3 flex-1">
                      <Globe className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-medium">Profile Visibility</p>
                        <p className="text-sm text-gray-600">Allow other users to find your profile</p>
                      </div>
                    </div>
                    <input type="checkbox" defaultChecked className="h-5 w-5" />
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-center gap-3 flex-1">
                      <Globe className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-medium">Analytics & Improvements</p>
                        <p className="text-sm text-gray-600">
                          Help us improve the service by sharing usage data
                        </p>
                      </div>
                    </div>
                    <input type="checkbox" defaultChecked className="h-5 w-5" />
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-center gap-3 flex-1">
                      <Globe className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-medium">Marketing & Communications</p>
                        <p className="text-sm text-gray-600">
                          Allow Swift Courier to send personalized offers based on your activity
                        </p>
                      </div>
                    </div>
                    <input type="checkbox" className="h-5 w-5" />
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex gap-3">
                    <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-blue-900">Data Privacy</p>
                      <p className="text-sm text-blue-800 mt-1">
                        Your data is encrypted and protected. View our{" "}
                        <a href="/privacy" className="underline font-medium hover:text-blue-700">
                          Privacy Policy
                        </a>{" "}
                        for more information.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4 flex justify-end">
                  <Button onClick={handleSave} disabled={saveStatus === "saving"}>
                    {saveStatus === "saving" ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Appearance */}
          <TabsContent value="appearance">
            <Card>
              <CardHeader>
                <CardTitle>Appearance Settings</CardTitle>
                <CardDescription>Customize how the application looks</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="text-sm font-medium mb-4 block">Theme</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button
                      onClick={() => setTheme("light")}
                      className={`p-4 border-2 rounded-lg transition-all ${
                        theme === "light"
                          ? "border-blue-600 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <Sun className="h-6 w-6 mx-auto mb-2" />
                      <p className="font-medium text-sm">Light</p>
                      <p className="text-xs text-gray-600 mt-1">Clean and bright</p>
                    </button>

                    <button
                      onClick={() => setTheme("dark")}
                      className={`p-4 border-2 rounded-lg transition-all ${
                        theme === "dark"
                          ? "border-blue-600 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <Moon className="h-6 w-6 mx-auto mb-2" />
                      <p className="font-medium text-sm">Dark</p>
                      <p className="text-xs text-gray-600 mt-1">Easy on the eyes</p>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-4 block">Language</label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full border rounded-lg p-2"
                  >
                    <option value="en">English</option>
                    <option value="es">Español</option>
                    <option value="fr">Français</option>
                    <option value="de">Deutsch</option>
                  </select>
                </div>

                <div className="border-t pt-4 flex justify-end">
                  <Button onClick={handleSave} disabled={saveStatus === "saving"}>
                    {saveStatus === "saving" ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security */}
          <TabsContent value="security">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Password & Authentication</CardTitle>
                  <CardDescription>Manage your security credentials</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Lock className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-medium">Change Password</p>
                        <p className="text-sm text-gray-600">Update your password regularly for security</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Change
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Lock className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-medium">Two-Factor Authentication</p>
                        <p className="text-sm text-gray-600">Add an extra layer of security</p>
                      </div>
                    </div>
                    <Badge variant="secondary">Not Enabled</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-red-200">
                <CardHeader>
                  <CardTitle className="text-red-600">Danger Zone</CardTitle>
                  <CardDescription>Irreversible and destructive actions</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg bg-red-50">
                    <div>
                      <p className="font-medium text-red-600">Sign Out</p>
                      <p className="text-sm text-red-600/70">Sign out of your account on this device</p>
                    </div>
                    <Button variant="destructive" onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign Out
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg bg-red-50">
                    <div>
                      <p className="font-medium text-red-600">Delete Account</p>
                      <p className="text-sm text-red-600/70">Permanently delete your account and all data</p>
                    </div>
                    <Button variant="destructive" disabled>
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

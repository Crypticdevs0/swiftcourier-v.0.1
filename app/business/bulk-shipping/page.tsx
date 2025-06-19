"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Upload, Download, FileSpreadsheet, AlertTriangle, Package } from "lucide-react"

export default function BulkShippingPage() {
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadResults, setUploadResults] = useState<any>(null)

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    setUploadProgress(0)

    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval)
          return 90
        }
        return prev + 10
      })
    }, 200)

    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/business/bulk-upload", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (data.success) {
        setUploadResults(data.results)
        setUploadProgress(100)
      }
    } catch (error) {
      console.error("Upload failed:", error)
    } finally {
      setIsUploading(false)
      clearInterval(progressInterval)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Bulk Shipping</h1>
          <p className="text-gray-600">Upload and process multiple shipments at once</p>
        </div>

        <Tabs defaultValue="upload" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="upload">Upload & Process</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="history">Upload History</TabsTrigger>
          </TabsList>

          {/* Upload & Process */}
          <TabsContent value="upload">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Upload Shipping Data</CardTitle>
                  <CardDescription>Upload a CSV or Excel file with your shipping information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">Drag and drop your file here, or click to browse</p>
                    <Input
                      type="file"
                      accept=".csv,.xlsx,.xls"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="file-upload"
                    />
                    <label htmlFor="file-upload">
                      <Button variant="outline" className="cursor-pointer">
                        Choose File
                      </Button>
                    </label>
                  </div>

                  {isUploading && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Processing file...</span>
                        <span>{uploadProgress}%</span>
                      </div>
                      <Progress value={uploadProgress} />
                    </div>
                  )}

                  <div className="text-sm text-gray-600">
                    <p>
                      <strong>Supported formats:</strong> CSV, Excel (.xlsx, .xls)
                    </p>
                    <p>
                      <strong>Maximum file size:</strong> 10MB
                    </p>
                    <p>
                      <strong>Maximum records:</strong> 1,000 per file
                    </p>
                  </div>
                </CardContent>
              </Card>

              {uploadResults && (
                <Card>
                  <CardHeader>
                    <CardTitle>Processing Results</CardTitle>
                    <CardDescription>Review your upload results</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <p className="text-2xl font-bold text-blue-600">{uploadResults.totalRows}</p>
                        <p className="text-sm text-gray-600">Total Rows</p>
                      </div>
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <p className="text-2xl font-bold text-green-600">{uploadResults.processed}</p>
                        <p className="text-sm text-gray-600">Processed</p>
                      </div>
                      <div className="text-center p-3 bg-red-50 rounded-lg">
                        <p className="text-2xl font-bold text-red-600">{uploadResults.errors}</p>
                        <p className="text-sm text-gray-600">Errors</p>
                      </div>
                      <div className="text-center p-3 bg-yellow-50 rounded-lg">
                        <p className="text-2xl font-bold text-yellow-600">{uploadResults.warnings}</p>
                        <p className="text-sm text-gray-600">Warnings</p>
                      </div>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="font-medium">Estimated Total Cost</p>
                      <p className="text-2xl font-bold text-green-600">${uploadResults.estimatedCost}</p>
                    </div>

                    {uploadResults.errors > 0 && (
                      <div className="space-y-2">
                        <h4 className="font-medium text-red-600 flex items-center">
                          <AlertTriangle className="h-4 w-4 mr-1" />
                          Errors ({uploadResults.errors})
                        </h4>
                        <div className="space-y-1 text-sm">
                          {uploadResults.errorDetails.map((error: any, index: number) => (
                            <p key={index} className="text-red-600">
                              Row {error.row}: {error.error}
                            </p>
                          ))}
                        </div>
                      </div>
                    )}

                    {uploadResults.warnings > 0 && (
                      <div className="space-y-2">
                        <h4 className="font-medium text-yellow-600 flex items-center">
                          <AlertTriangle className="h-4 w-4 mr-1" />
                          Warnings ({uploadResults.warnings})
                        </h4>
                        <div className="space-y-1 text-sm">
                          {uploadResults.warningDetails.slice(0, 3).map((warning: any, index: number) => (
                            <p key={index} className="text-yellow-600">
                              Row {warning.row}: {warning.warning}
                            </p>
                          ))}
                          {uploadResults.warnings > 3 && (
                            <p className="text-gray-500">... and {uploadResults.warnings - 3} more</p>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="space-y-2">
                      <Button className="w-full">
                        <Package className="mr-2 h-4 w-4" />
                        Process {uploadResults.processed} Shipments
                      </Button>
                      <Button variant="outline" className="w-full">
                        <Download className="mr-2 h-4 w-4" />
                        Download Error Report
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Templates */}
          <TabsContent value="templates">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileSpreadsheet className="mr-2 h-5 w-5" />
                    Domestic Shipping
                  </CardTitle>
                  <CardDescription>Template for US domestic shipments</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm mb-4">
                    <p>• Recipient information</p>
                    <p>• Package dimensions</p>
                    <p>• Service type selection</p>
                    <p>• Special instructions</p>
                  </div>
                  <Button variant="outline" className="w-full">
                    <Download className="mr-2 h-4 w-4" />
                    Download Template
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileSpreadsheet className="mr-2 h-5 w-5" />
                    International Shipping
                  </CardTitle>
                  <CardDescription>Template for international shipments</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm mb-4">
                    <p>• International addresses</p>
                    <p>• Customs declarations</p>
                    <p>• HS codes</p>
                    <p>• Country restrictions</p>
                  </div>
                  <Button variant="outline" className="w-full">
                    <Download className="mr-2 h-4 w-4" />
                    Download Template
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileSpreadsheet className="mr-2 h-5 w-5" />
                    Return Labels
                  </CardTitle>
                  <CardDescription>Template for return shipments</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm mb-4">
                    <p>• Return addresses</p>
                    <p>• Original tracking numbers</p>
                    <p>• Return reasons</p>
                    <p>• Prepaid options</p>
                  </div>
                  <Button variant="outline" className="w-full">
                    <Download className="mr-2 h-4 w-4" />
                    Download Template
                  </Button>
                </CardContent>
              </Card>
            </div>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Template Guidelines</CardTitle>
                <CardDescription>Important information for using bulk shipping templates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-2">Required Fields</h4>
                    <ul className="text-sm space-y-1 text-gray-600">
                      <li>• Recipient name and address</li>
                      <li>• Package weight and dimensions</li>
                      <li>• Service type (Standard, Express, Overnight)</li>
                      <li>• Sender information</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Optional Fields</h4>
                    <ul className="text-sm space-y-1 text-gray-600">
                      <li>• Insurance value</li>
                      <li>• Signature confirmation</li>
                      <li>• Special handling instructions</li>
                      <li>• Reference numbers</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Upload History */}
          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>Upload History</CardTitle>
                <CardDescription>View your previous bulk shipping uploads</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      id: 1,
                      filename: "december_shipments.xlsx",
                      date: "2024-12-19",
                      records: 147,
                      status: "Completed",
                      cost: 1847.5,
                    },
                    {
                      id: 2,
                      filename: "holiday_orders.csv",
                      date: "2024-12-18",
                      records: 89,
                      status: "Completed",
                      cost: 1124.3,
                    },
                    {
                      id: 3,
                      filename: "weekly_batch_12_16.xlsx",
                      date: "2024-12-16",
                      records: 203,
                      status: "Processing",
                      cost: 2456.8,
                    },
                  ].map((upload) => (
                    <div key={upload.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <FileSpreadsheet className="h-8 w-8 text-blue-600" />
                        <div>
                          <p className="font-medium">{upload.filename}</p>
                          <p className="text-sm text-gray-600">
                            {upload.records} records • {upload.date}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <Badge variant={upload.status === "Completed" ? "default" : "secondary"}>
                            {upload.status}
                          </Badge>
                          <p className="text-sm text-gray-600 mt-1">${upload.cost.toFixed(2)}</p>
                        </div>
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, Lock, User, Building2, AlertCircle, CheckCircle2 } from "lucide-react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"

export default function InternalLoginPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    // Clear error when user starts typing
    if (error) setError("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // Basic validation
    if (!formData.username || !formData.password) {
      setError("Please fill in all fields")
      setIsLoading(false)
      return
    }

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Mock authentication - replace with real authentication logic
      if (formData.username === "admin" && formData.password === "admin123") {
        setSuccess("Login successful! Redirecting...")
        setTimeout(() => {
          router.push("/admin/dashboard")
        }, 1000)
      } else if (formData.username === "officer" && formData.password === "officer123") {
        setSuccess("Login successful! Redirecting...")
        setTimeout(() => {
          router.push("/officer/areacode")
        }, 1000)
      } else {
        setError("Invalid username or password")
      }
    } catch (error) {
      setError("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-primary/10 rounded-full">
              <Building2 className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Internal Access</h1>
          <p className="text-gray-600">PT.YONGJIN JAVASUKA GARMENT</p>
        </motion.div>

        {/* Login Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="space-y-1 pb-6">
              <CardTitle className="text-xl font-semibold flex items-center gap-2">
                <Lock className="h-5 w-5 text-primary" />
                Sign In
              </CardTitle>
              <CardDescription>Enter your credentials to access the internal system</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Username Field */}
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="username"
                      name="username"
                      type="text"
                      placeholder="Enter your username"
                      value={formData.username}
                      onChange={handleChange}
                      className="pl-10"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={handleChange}
                      className="pl-10 pr-10"
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      disabled={isLoading}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* Error Alert */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  </motion.div>
                )}

                {/* Success Alert */}
                {success && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Alert className="border-green-200 bg-green-50 text-green-800">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      <AlertDescription>{success}</AlertDescription>
                    </Alert>
                  </motion.div>
                )}

                {/* Submit Button */}
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      Signing in...
                    </div>
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>

        {/* Demo Credentials */}
        <motion.div
          className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h3 className="text-sm font-medium text-blue-900 mb-2">Demo Credentials:</h3>
          <div className="text-xs text-blue-700 space-y-1">
            <div>
              <strong>Admin:</strong> username: <code className="bg-blue-100 px-1 rounded">admin</code>, password:{" "}
              <code className="bg-blue-100 px-1 rounded">admin123</code>
            </div>
            <div>
              <strong>Officer:</strong> username: <code className="bg-blue-100 px-1 rounded">officer</code>, password:{" "}
              <code className="bg-blue-100 px-1 rounded">officer123</code>
            </div>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div
          className="text-center mt-8 text-sm text-gray-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <p>© 2024 PT.YONGJIN JAVASUKA GARMENT</p>
          <p className="mt-1">Internal Access Portal</p>
        </motion.div>
      </div>
    </div>
  )
}

"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { EyeIcon, EyeOffIcon, LockKeyhole } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/utils/supabase/client"

export default function staffLogin() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [checkingSession, setCheckingSession] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const checkSessionAndRedirect = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (session && session.user) {
        // Query profiles table to get role
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", session.user.id)
          .single()
        if (profileData && profileData.role) {
          if (profileData.role === "compliance") {
            router.replace("/user/compliance")
          } else if (profileData.role === "developer") {
            router.replace("/user/developer")
          } else if (profileData.role === "management") {
            router.replace("/user/management")
          } else if (profileData.role === "hr") {
            router.replace("/user/hr")
          } else {
            router.replace("/user/dashboard")
          }
        }
      }
      setCheckingSession(false)
    }
    checkSessionAndRedirect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    console.log("Form submitted") // Debug: check if submit fires on mobile
    setIsLoading(true)
    setError("")

    try {
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (signInError) {
        setError(signInError.message)
        setIsLoading(false)
        return
      }

      if (!signInData.user) {
        setError("User not found")
        setIsLoading(false)
        return
      }

      // Query profiles table to get role
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", signInData.user.id)
        .single()

      if (profileError) {
        setError("Failed to fetch user profile")
        setIsLoading(false)
        return
      }

      if (!profileData || !profileData.role) {
        setError("User role not found")
        setIsLoading(false)
        return
      }

      // Redirect or handle based on role
      if (profileData.role === "compliance") {
        router.push("/user/compliance")
      } else if (profileData.role === "developer") {
        router.push("/user/developer") // example route, adjust as needed
      } else if (profileData.role === "management") {
        router.push("/user/management") // example route, adjust as needed
      } else if (profileData.role === "hr") {
        router.push("/user/hr") // example route, adjust as needed
      } else {
        // Default fallback
        router.push("/user/dashboard")
      }
    } catch (error) {
      setError("An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  if (checkingSession) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4 bg-muted/30">
        <div className="flex flex-col items-center gap-4">
          <svg className="animate-spin h-8 w-8 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
          </svg>
          <div className="text-lg font-semibold animate-pulse">Loading...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-muted/30">
      <Card className="w-full max-w-md shadow-lg border-primary/20 backdrop-blur-sm bg-background/95">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <LockKeyhole className="h-6 w-6 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-center">user Login</CardTitle>
          <CardDescription className="text-center">
            Enter your credentials to access the user portal
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md mb-4">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                  suppressHydrationWarning={true}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isLoading}
                    className="pr-10"
                    suppressHydrationWarning={true}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                    suppressHydrationWarning={true}
                  >
                    {showPassword ? (
                      <EyeOffIcon className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <EyeIcon className="h-4 w-4 text-muted-foreground" />
                    )}
                    <span className="sr-only">
                      {showPassword ? "Hide password" : "Show password"}
                    </span>
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="remember"
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    suppressHydrationWarning={true}
                  />
                  <Label htmlFor="remember" className="text-sm font-medium">
                    Remember me
                  </Label>
                </div>
                <Link
                  href="/guest"
                  className="text-sm font-medium text-primary hover:underline"
                >
                  Guest Mode?
                </Link>
              </div>
              <Button
                type="submit"
                className="relative w-full z-[999]"
                style={{ touchAction: "manipulation" }}
                disabled={isLoading}
                suppressHydrationWarning={true}
              >
                {isLoading ? "Signing in..." : "Sign in"}
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4 border-t px-6 py-4 bg-muted/10">
          <div className="text-center text-sm text-muted-foreground">
            This portal is restricted to authorized personnel only.
          </div>
          <div className="text-center text-xs text-muted-foreground">
            © 2025 PT.YONGJIN JAVASUKA GARMENT. All rights reserved.
          </div>
          <div className="text-center text-xs text-muted-foreground">
            ⚡ Powered & Created By Garyudo
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

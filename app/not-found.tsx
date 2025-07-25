import Link from "next/link"
import { Home, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center p-8 max-w-md mx-auto">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-gray-300 dark:text-gray-700">404</h1>
        </div>

        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Page Not Found</h2>

        <p className="text-gray-600 dark:text-gray-400 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild variant="default">
            <Link href="/" className="inline-flex items-center gap-2">
              <Home className="w-4 h-4" />
              Go Home
            </Link>
          </Button>

          <Button asChild variant="outline">
            <Link href="javascript:history.back()" className="inline-flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Go Back
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

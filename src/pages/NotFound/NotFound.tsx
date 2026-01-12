import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Home, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="text-center space-y-6 max-w-md">
        {/* 404 Number */}
        <div className="space-y-2">
          <h1 className="text-9xl font-bold text-primary/20">404</h1>
          <h2 className="text-3xl font-semibold text-accent">Page Not Found</h2>
        </div>

        {/* Error Message */}
        <div className="space-y-2">
          <p className="text-muted-foreground text-lg">
            Oops! The page you're looking for doesn't exist.
          </p>
          <p className="text-sm text-muted-foreground">
            The page might have been moved, deleted, or you entered the wrong URL.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Button
            onClick={() => navigate(-1)}
            variant="outline"
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </Button>
          <Button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2"
          >
            <Home className="h-4 w-4" />
            Go to Dashboard
          </Button>
        </div>
      </div>
    </div>
  )
}

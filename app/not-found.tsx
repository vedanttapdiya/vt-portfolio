export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-black p-6">
      <div className="text-center max-w-md mx-auto">
        <h1 className="text-4xl font-bold text-white mb-4">404 - Page Not Found</h1>
        <p className="text-zinc-400 mb-8">The page you're looking for doesn't exist or has been moved.</p>
        <div className="flex justify-center">
          <a href="/" className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md transition-colors">
            Return Home
          </a>
        </div>
      </div>
    </div>
  )
}

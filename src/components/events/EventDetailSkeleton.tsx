export function EventDetailSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 animate-pulse">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <div className="h-6 w-20 bg-gray-200 rounded"></div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {/* Image skeleton */}
          <div className="w-full h-64 bg-gray-200"></div>
          
          <div className="p-6">
            {/* Title */}
            <div className="h-8 w-3/4 bg-gray-200 rounded mb-4"></div>

            {/* Quick info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-5 h-5 bg-gray-200 rounded"></div>
                  <div className="flex-1">
                    <div className="h-4 w-20 bg-gray-200 rounded mb-1"></div>
                    <div className="h-5 w-32 bg-gray-200 rounded"></div>
                  </div>
                </div>
              ))}
            </div>

            {/* Description */}
            <div className="mb-6">
              <div className="h-6 w-24 bg-gray-200 rounded mb-2"></div>
              <div className="space-y-2">
                <div className="h-4 w-full bg-gray-200 rounded"></div>
                <div className="h-4 w-full bg-gray-200 rounded"></div>
                <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="h-10 w-48 bg-gray-200 rounded"></div>
          <div className="h-12 w-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    </div>
  );
}
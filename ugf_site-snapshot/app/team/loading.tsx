export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-4 font-mono text-gray-100">
      <div className="flex flex-col space-y-16">
        {/* Large Headline Loading Skeleton */}
        <div className="mb-16 text-center">
          <div className="max-w-5xl mx-auto space-y-4">
            <div className="h-12 md:h-16 lg:h-20 bg-gray-700 w-full rounded animate-pulse"></div>
            <div className="h-12 md:h-16 lg:h-20 bg-gray-700 w-5/6 mx-auto rounded animate-pulse"></div>
            <div className="h-12 md:h-16 lg:h-20 bg-gray-700 w-4/5 mx-auto rounded animate-pulse"></div>
            <div className="h-12 md:h-16 lg:h-20 bg-gray-700 w-3/4 mx-auto rounded animate-pulse"></div>
          </div>
        </div>

        {/* Management Team Section Loading Skeleton */}
        <div className="mb-16">
          <div className="p-8 shadow-md max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={`management-${i}`} className="animate-pulse">
                  <div className="bg-gray-700 aspect-square rounded-lg mb-4"></div>
                  <div className="bg-gray-700 h-6 w-3/4 rounded mb-2"></div>
                  <div className="bg-gray-700 h-4 w-1/2 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Students Section Loading Skeleton */}
        <div className="mb-16">
          {/* Filter Section Loading Skeleton */}
          <div className="mb-8">
            {/* Top row with search bar */}
            <div className="flex flex-wrap items-center justify-between mb-4">
              <div className="relative w-full md:w-64 mt-4 md:mt-0">
                <div className="bg-gray-700 h-10 w-full rounded animate-pulse"></div>
              </div>
            </div>

            {/* Filter buttons row */}
            <div className="flex flex-wrap gap-2">
              {[...Array(6)].map((_, i) => (
                <div
                  key={`filter-${i}`}
                  className="bg-gray-700 h-10 w-24 rounded animate-pulse mb-4"
                ></div>
              ))}
            </div>

            {/* Office and School dropdowns */}
            <div className="flex flex-wrap gap-4 mb-4">
              <div className="bg-gray-700 h-10 w-48 rounded animate-pulse"></div>
              <div className="bg-gray-700 h-10 w-48 rounded animate-pulse"></div>
            </div>
          </div>

          {/* Team Members Grid Loading Skeleton */}
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(12)].map((_, i) => (
              <div
                key={`member-${i}`}
                className="relative overflow-hidden rounded-lg shadow-lg bg-gray-800 animate-pulse"
              >
                <div className="bg-gray-700 aspect-square rounded-lg"></div>
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gray-800">
                  <div className="bg-gray-700 h-6 w-3/4 rounded mb-1"></div>
                  <div className="bg-gray-700 h-4 w-1/2 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Alumni Section Loading Skeleton (initially hidden) */}
        <div className="mt-16 pt-8" id="alumni-section">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div className="bg-gray-700 h-8 w-48 rounded animate-pulse"></div>
            <div className="bg-gray-700 h-10 w-full md:w-64 rounded animate-pulse"></div>
          </div>

          <div className="bg-gray-800 shadow-lg overflow-hidden">
            {/* Table header */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 p-4 bg-gray-700">
              <div className="bg-gray-600 h-4 w-12 rounded animate-pulse"></div>
              <div className="hidden md:block bg-gray-600 h-4 w-16 rounded animate-pulse"></div>
              <div className="bg-gray-600 h-4 w-16 rounded animate-pulse"></div>
              <div className="hidden md:block bg-gray-600 h-4 w-24 rounded animate-pulse"></div>
              <div className="hidden md:block bg-gray-600 h-4 w-16 rounded animate-pulse"></div>
            </div>

            {/* Table rows */}
            <div className="divide-y divide-gray-700">
              {[...Array(8)].map((_, i) => (
                <div
                  key={`alumni-${i}`}
                  className="grid grid-cols-2 md:grid-cols-5 gap-4 p-4 animate-pulse"
                >
                  <div className="bg-gray-700 h-4 w-3/4 rounded"></div>
                  <div className="hidden md:block bg-gray-700 h-4 w-1/2 rounded"></div>
                  <div className="bg-gray-700 h-4 w-2/3 rounded"></div>
                  <div className="hidden md:block bg-gray-700 h-4 w-3/4 rounded"></div>
                  <div className="hidden md:block bg-gray-700 h-4 w-4 rounded"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Jump to top button */}
          <div className="flex justify-center mt-6">
            <div className="bg-gray-700 h-10 w-32 rounded animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

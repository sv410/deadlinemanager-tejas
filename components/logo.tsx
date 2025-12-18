export function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="relative h-10 w-10">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500 via-amber-500 to-orange-600 rounded-xl rotate-6 opacity-20 blur-md" />
        <div className="relative h-full w-full bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl flex items-center justify-center shadow-xl shadow-orange-500/40">
          <svg
            width="22"
            height="22"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-black"
          >
            <path
              d="M10 2L10 10M10 10L16 10M10 10L6 14"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path d="M4 16L16 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.4" />
          </svg>
        </div>
      </div>
      <span className="font-bold text-xl bg-gradient-to-r from-foreground via-orange-500 to-amber-500 bg-clip-text text-transparent">
        DeadlineSync
      </span>
    </div>
  )
}

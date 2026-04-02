"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, BookOpen, Search, Library } from "lucide-react"
import { cn } from "@/lib/utils"

const items = [
  { href: "/", label: "Home", icon: Home },
  { href: "/courses", label: "Courses", icon: BookOpen },
  { href: "/my-courses", label: "My Courses", icon: Library },
  { href: "/courses?q=", label: "Search", icon: Search },
]

export default function MobileBottomNav() {
  const pathname = usePathname()

  return (
    <nav className="sm:hidden fixed bottom-0 inset-x-0 z-50 border-t border-gray-200 bg-white/90 backdrop-blur">
      <div className="mx-auto max-w-md grid grid-cols-4">
        {items.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (href !== "/" && pathname.startsWith(href))
          return (
            <Link
              key={href + label}
              href={href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 py-3 text-xs",
                active ? "text-blue-700" : "text-gray-500"
              )}
            >
              <Icon className={cn("w-5 h-5", active ? "text-blue-700" : "text-gray-500")} />
              <span className={cn("font-medium", active && "font-semibold")}>{label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

import type { Metadata } from "next"
import "./globals.css"
import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"
import MobileBottomNav from "@/components/layout/MobileBottomNav"

export const metadata: Metadata = {
  title: "Blue Educational | Dentistry Courses",
  description:
    "Dentistry-focused learning platform: clinical fundamentals, radiology, endodontics, prosthodontics, and more — learn at your own pace.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-gray-50 text-gray-900 antialiased">
        <Header />
        <main className="flex-1 pb-20 sm:pb-0">{children}</main>
        <Footer />
        <MobileBottomNav />
      </body>
    </html>
  )
}

"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { COURSES } from "@/data/courses"
import { isPurchased, purchaseCourse } from "@/lib/purchases/store"
import { formatPrice } from "@/lib/courses/helpers"
import { CheckCircle2, CreditCard, Lock, ArrowLeft } from "lucide-react"
import type { Course } from "@/types/course"

type Step = "review" | "payment" | "confirmation"

export default function CheckoutPage() {
  const params = useParams()
  const router = useRouter()
  const slug = typeof params.slug === "string" ? params.slug : ""

  const [course, setCourse] = useState<Course | null>(null)
  const [step, setStep] = useState<Step>("review")
  const [cardNumber, setCardNumber] = useState("")
  const [expiry, setExpiry] = useState("")
  const [cvv, setCvv] = useState("")
  const [cardName, setCardName] = useState("")

  useEffect(() => {
    const found = COURSES.find((c) => c.slug === slug) ?? null
    if (!found) {
      router.replace("/courses")
      return
    }
    // If already purchased, redirect
    if (isPurchased(found.id)) {
      router.replace("/my-courses")
      return
    }
    setCourse(found)
  }, [slug, router])

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const discount = course.originalPrice
    ? Math.round(((course.originalPrice - course.price) / course.originalPrice) * 100)
    : 0

  const handleCompleteOrder = () => {
    purchaseCourse(course.id)
    setStep("confirmation")
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Back link */}
        {step !== "confirmation" && (
          <Link
            href={`/courses/${course.slug}`}
            className="inline-flex items-center gap-1 text-sm text-blue-600 hover:underline mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to course
          </Link>
        )}

        {/* Step indicator */}
        <div className="flex items-center gap-2 mb-8">
          {(["review", "payment", "confirmation"] as Step[]).map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                  step === s
                    ? "bg-blue-600 text-white"
                    : ["review", "payment"].indexOf(step) > i
                    ? "bg-green-500 text-white"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                {["review", "payment"].indexOf(step) > i ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : (
                  i + 1
                )}
              </div>
              <span
                className={`text-sm font-medium capitalize hidden sm:block ${
                  step === s ? "text-blue-600" : "text-gray-400"
                }`}
              >
                {s}
              </span>
              {i < 2 && <div className="w-8 h-px bg-gray-300" />}
            </div>
          ))}
        </div>

        {/* Step 1: Review */}
        {step === "review" && (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h1 className="text-xl font-bold text-gray-900">Order Review</h1>
            </div>
            <div className="p-6 space-y-6">
              {/* Course summary */}
              <div className="flex gap-4">
                <div className="relative w-24 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                  <Image
                    src={course.thumbnail}
                    alt={course.title}
                    fill
                    unoptimized
                    className="object-cover"
                  />
                </div>
                <div>
                  <h2 className="font-semibold text-gray-900 text-sm leading-snug">{course.title}</h2>
                  <p className="text-xs text-gray-500 mt-1">{course.instructor.name}</p>
                  <p className="text-xs text-gray-500">{course.level}</p>
                </div>
              </div>

              {/* Price breakdown */}
              <div className="border border-gray-200 rounded-xl p-4 space-y-3">
                <h3 className="font-semibold text-gray-800 text-sm">Price Summary</h3>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Original price</span>
                  <span className="line-through text-gray-400">
                    {formatPrice(course.originalPrice ?? course.price)}
                  </span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Discount ({discount}% off)</span>
                    <span>-{formatPrice((course.originalPrice ?? course.price) - course.price)}</span>
                  </div>
                )}
                <div className="border-t border-gray-200 pt-3 flex justify-between font-bold text-gray-900">
                  <span>Total</span>
                  <span>{formatPrice(course.price)}</span>
                </div>
              </div>

              <button
                onClick={() => setStep("payment")}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors"
              >
                Proceed to Payment
              </button>
              <p className="text-xs text-center text-gray-400">
                30-Day Money-Back Guarantee. No questions asked.
              </p>
            </div>
          </div>
        )}

        {/* Step 2: Payment */}
        {step === "payment" && (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h1 className="text-xl font-bold text-gray-900">Payment Details</h1>
              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <Lock className="w-3.5 h-3.5" />
                Secure checkout
              </div>
            </div>
            <div className="p-6 space-y-5">
              {/* Demo notice */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-700">
                <strong>Demo mode:</strong> This is a simulated checkout. No real payment will be
                processed.
              </div>

              {/* Card form */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Cardholder Name
                  </label>
                  <input
                    type="text"
                    placeholder="Jane Smith"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Card Number
                  </label>
                  <div className="relative">
                    <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="4242 4242 4242 4242"
                      value={cardNumber}
                      onChange={(e) =>
                        setCardNumber(
                          e.target.value
                            .replace(/\D/g, "")
                            .replace(/(.{4})/g, "$1 ")
                            .trim()
                            .slice(0, 19)
                        )
                      }
                      className="w-full h-10 pl-10 pr-3 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      value={expiry}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, "").slice(0, 4)
                        setExpiry(val.length > 2 ? `${val.slice(0, 2)}/${val.slice(2)}` : val)
                      }}
                      className="w-full h-10 px-3 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">CVV</label>
                    <input
                      type="text"
                      placeholder="123"
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
                      className="w-full h-10 px-3 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Order total */}
              <div className="border-t border-gray-200 pt-4 flex justify-between font-bold text-gray-900 text-lg">
                <span>Total</span>
                <span>{formatPrice(course.price)}</span>
              </div>

              <button
                onClick={handleCompleteOrder}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <Lock className="w-4 h-4" />
                Complete Purchase
              </button>

              <button
                onClick={() => setStep("review")}
                className="w-full text-gray-500 hover:text-gray-700 text-sm py-2 transition-colors"
              >
                Back to review
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Confirmation */}
        {step === "confirmation" && (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 text-center space-y-6">
            <div className="flex justify-center">
              <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10 text-green-500" />
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Purchase Successful!
              </h1>
              <p className="text-gray-500 text-sm">
                You now have full access to{" "}
                <span className="font-semibold text-gray-700">{course.title}</span>.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/my-courses"
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors"
              >
                Go to My Courses
              </Link>
              <Link
                href={`/watch/${course.slug}/${course.sections[0]?.lessons[0]?.slug ?? ""}`}
                className="border border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold py-3 px-6 rounded-xl transition-colors"
              >
                Start Learning
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

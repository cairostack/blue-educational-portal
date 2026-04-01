export interface Lesson {
  id: string
  slug: string
  title: string
  description: string
  duration: number // in seconds
  videoUrl?: string
  isPreview: boolean
  order: number
}

export interface Section {
  id: string
  title: string
  order: number
  lessons: Lesson[]
}

export interface Instructor {
  id: string
  name: string
  avatar: string
  bio: string
  title: string
  rating: number
  totalStudents: number
  totalCourses: number
}

export interface Course {
  id: string
  slug: string
  title: string
  description: string
  shortDescription: string
  thumbnail: string
  previewVideo?: string
  instructor: Instructor
  price: number
  originalPrice?: number
  rating: number
  reviewCount: number
  studentCount: number
  level: "Beginner" | "Intermediate" | "Advanced"
  category: string
  tags: string[]
  language: string
  lastUpdated: string
  duration: number // total seconds
  lessonCount: number
  sections: Section[]
  whatYouLearn: string[]
  requirements: string[]
  isBestseller?: boolean
  isFeatured?: boolean
}

export interface PurchasedCourse {
  courseId: string
  purchasedAt: string
  progress: number // 0-100
  completedLessons: string[] // lesson IDs
  lastWatchedLessonId?: string
  lastWatchedAt?: string
}

export interface CheckoutState {
  step: "review" | "payment" | "confirmation"
  courseId: string
}

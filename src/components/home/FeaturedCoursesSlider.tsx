"use client"

import * as React from "react"
import { Swiper, SwiperSlide } from "swiper/react"
import { Pagination } from "swiper/modules"
import "swiper/css"
import "swiper/css/pagination"

import type { Course } from "@/types/course"
import CourseCard from "@/components/courses/CourseCard"

export default function FeaturedCoursesSlider({ courses }: { courses: Course[] }) {
  return (
    <div className="-mx-4 sm:mx-0">
      <Swiper
        modules={[Pagination]}
        pagination={{ clickable: true }}
        spaceBetween={16}
        slidesPerView={1.1}
        breakpoints={{
          640: { slidesPerView: 2.1 },
          1024: { slidesPerView: 3.1 },
          1280: { slidesPerView: 4 },
        }}
        className="px-4 sm:px-0 pb-10"
      >
        {courses.map((course) => (
          <SwiperSlide key={course.id} className="h-auto">
            <CourseCard course={course} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}

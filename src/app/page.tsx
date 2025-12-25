"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Hero } from "@/components/sections/hero"
import { TrustStrip } from "@/components/sections/trust-strip"
import { Services } from "@/components/sections/services"
import { Process } from "@/components/sections/process"
import { WhyUs } from "@/components/sections/why-us"
import { Industries } from "@/components/sections/industries"
import { CTA } from "@/components/sections/cta"
import { Loader2 } from "lucide-react"

export default function Home() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!user) {
    return null // Will redirect
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Hero />
      <TrustStrip />
      <Services />
      <Process />
      <WhyUs />
      <Industries />
      <CTA />
    </div>
  );
}

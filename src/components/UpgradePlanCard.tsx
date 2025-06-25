"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { openRazorpay } from "@/utils/razorpay"
import { useAuth } from "@/hooks/useAuth"
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore"
import { db } from "@/firebase"
import { toast } from "sonner"

const UpgradePlanCard = () => {
  const { user } = useAuth()
  const [isMember, setIsMember] = useState(false)

  useEffect(() => {
    const checkMembership = async () => {
      if (!user?.id) return
      const docRef = doc(db, "memberships", user.id)
      const snap = await getDoc(docRef)
      if (snap.exists()) {
        const data = snap.data()
        if (data.status === "active" && new Date(data.expiry.toDate?.() || data.expiry) > new Date()) {
          setIsMember(true)
        }
      }
    }  

    checkMembership()
  }, [user])

  const handleUpgrade = () => {
    if (!user?.email || !user?.id) {
      toast.error("Please log in to upgrade your plan.")
      return
    }

    openRazorpay({
      amount: 499,
      name: "Gym Premium Membership",
      description: "Access to premium features and unlimited regions",
      email: user.email,
      onSuccess: async (response) => {
        try {
          await setDoc(doc(db, "memberships", user.id), {
            userId: user.id,
            email: user.email,
            status: "active",
            paymentId: response.razorpay_payment_id,
            upgradedAt: serverTimestamp(),
            plan: "Premium",
            expiry: new Date(new Date().setMonth(new Date().getMonth() + 1))
          })

          toast.success("Membership activated successfully!")
          setIsMember(true)
        } catch (err) {
          console.error("Error saving membership:", err)
          toast.error("Payment succeeded, but membership was not saved.")
        }
      }
    })
  }

  if (isMember) {
    return (
      <div className="pt-6 mt-6 border-t border-border">
        <div className="bg-green-50 dark:bg-green-900/10 p-4 rounded-lg border border-green-300 dark:border-green-800">
          <h3 className="font-semibold text-green-700 dark:text-green-300 mb-1">You're a Premium Member!</h3>
          <p className="text-sm text-green-600 dark:text-green-400">Enjoy all premium benefits and unlimited regions.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="pt-6 mt-6 border-t border-border">
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg p-4 border border-primary/20">
        <h3 className="font-semibold text-foreground mb-2">Upgrade Plan</h3>
        <p className="text-sm text-muted-foreground mb-3">
          Get access to premium features and unlimited regions.
        </p>
        <Button
          size="sm"
          onClick={handleUpgrade}
          className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
        >
          Upgrade Now – ₹499
        </Button>
      </div>
    </div>
  )
}

export default UpgradePlanCard
  
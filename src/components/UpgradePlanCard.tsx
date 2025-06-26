"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/hooks/useAuth"
import { doc, getDoc } from "firebase/firestore"
import { db } from "@/firebase"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"
import { Badge } from "@/components/ui/badge"

const UpgradePlanCard = () => {
  const { user } = useAuth()
  const [membership, setMembership] = useState<{ plan: string; expiry: Date } | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    const checkMembership = async () => {
      if (!user?.id) return
      const docRef = doc(db, "memberships", user.id)
      const snap = await getDoc(docRef)

      if (snap.exists()) {
        const data = snap.data()
        const expiryDate = data.expiry?.toDate?.() || new Date(data.expiry)
        if (data.status === "active" && expiryDate > new Date()) {
          setMembership({ plan: data.plan, expiry: expiryDate })
        }
      }
    }

    checkMembership()
  }, [user])

  return (
    <div className="pt-6 mt-6 border-t border-border">
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg p-4 border border-primary/20">
        <h3 className="font-semibold text-foreground mb-2">Membership Status</h3>

        {membership ? (
          <div className="flex flex-col space-y-2">
            <p className="text-sm text-muted-foreground">
              You're subscribed to the <strong>{membership.plan}</strong> plan.
            </p>
            <Badge variant="outline" className="w-fit text-xs">
              Expires on {membership.expiry.toDateString()}
            </Badge>
          </div>
        ) : (
          <div className="flex flex-col space-y-3">
            <p className="text-sm text-muted-foreground">
              You don’t have an active membership. Upgrade now to unlock all features!
            </p>
            <Button
              size="sm"
              onClick={() => navigate("/plans")}
              className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
            >
              View Plans
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

export default UpgradePlanCard
  
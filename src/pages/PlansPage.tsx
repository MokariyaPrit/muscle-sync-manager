"use client";

import { useEffect, useState } from "react";
import { db } from "@/firebase";
import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
  collection,
  addDoc,
} from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { openRazorpay } from "@/utils/razorpay";

const plans = [
  {
    id: "basic",
    name: "Basic",
    price: 499,
    duration: 3,
    badge: null,
    priority: 1,
    benefits: [
      "Access to local gym region",
      "Book 5 classes/month",
      "Standard support",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    price: 1199,
    duration: 6,
    badge: "Most Popular",
    priority: 2,
    benefits: [
      "Access to all regions",
      "Book unlimited classes",
      "Priority support",
      "Progress tracking dashboard",
    ],
  },
  {
    id: "elite",
    name: "Elite",
    price: 1999,
    duration: 12,
    badge: "Save 25%",
    priority: 3,
    benefits: [
      "All Pro benefits",
      "1-on-1 coaching sessions",
      "Exclusive diet plans",
      "Early access to events",
    ],
  },
];

const PlansPage = () => {
  const { user } = useAuth();
  const [activePlan, setActivePlan] = useState("");
  const [activePriority, setActivePriority] = useState(0);

  useEffect(() => {
    const fetchMembership = async () => {
      if (!user?.id) return;
      const snap = await getDoc(doc(db, "memberships", user.id));
      if (snap.exists()) {
        const data = snap.data();
        const expiry = data.expiry?.toDate?.() || new Date(data.expiry);
        if (data.status === "active" && expiry > new Date()) {
          setActivePlan(data.plan);
          const current = plans.find((p) => p.name === data.plan);
          setActivePriority(current?.priority || 0);
        }
      }
    };

    fetchMembership();
  }, [user]);

  const handlePlanClick = async (plan: (typeof plans)[0]) => {
    if (!user?.id || !user.email) {
      toast.error("Please log in");
      return;
    }

    if (activePlan) {
      toast.error("You already have an active plan.");
      return;
    }

    // Open Razorpay
    openRazorpay({
      amount: plan.price,
      name: `Gym ${plan.name} Membership`,
      description: `${plan.name} plan for ${plan.duration} month(s)`,
      email: user.email,
      onSuccess: async (res) => {
        const expiry = new Date(new Date().setMonth(new Date().getMonth() + plan.duration));
        const data = {
          userId: user.id,
          email: user.email,
          status: "active",
          paymentId: res.razorpay_payment_id,
          upgradedAt: serverTimestamp(),
          plan: plan.name,
          expiry,
        };

        try {
          await setDoc(doc(db, "memberships", user.id), data);
          await addDoc(collection(db, "memberships", user.id, "history"), data);
          toast.success(`${plan.name} Plan Activated`);
          setActivePlan(plan.name);
          setActivePriority(plan.priority);
        } catch (err) {
          console.error("Firestore error:", err);
          toast.error("Payment succeeded, but saving failed.");
        }
      },
    });
  };

  return (
    <div className="max-w-4xl mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Choose Your Membership Plan</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <motion.div
            key={plan.id}
            className="bg-white dark:bg-muted p-6 rounded-lg shadow border relative"
            whileHover={{ scale: 1.04 }}
            transition={{ duration: 0.3 }}
          >
            {plan.badge && (
              <Badge className="absolute top-2 right-2 bg-amber-500 text-white">
                {plan.badge}
              </Badge>
            )}

            <h2 className="text-xl font-semibold mb-2">{plan.name}</h2>
            <p className="text-sm text-muted-foreground mb-2">
              Duration: {plan.duration} {plan.duration > 1 ? "months" : "month"}
            </p>
            <p className="text-2xl font-bold mb-4">₹{plan.price}</p>

            <ul className="text-sm text-muted-foreground space-y-1 mb-4">
              {plan.benefits.map((benefit, idx) => (
                <li key={idx} className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-primary mr-2" />
                  {benefit}
                </li>
              ))}
            </ul>

            {activePlan ? (
              <Button disabled variant="outline" className="w-full text-gray-500">
                {activePlan === plan.name ? (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Already Subscribed
                  </>
                ) : (
                  "Cannot change plan"
                )}
              </Button>
            ) : (
              <Button onClick={() => handlePlanClick(plan)} className="w-full">
                Choose {plan.name}
              </Button>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default PlansPage;
   
"use client"

import { useState, useEffect } from "react"
import { collection, query, where, getDocs, Timestamp } from "firebase/firestore"
import { db } from "@/firebase"
import { useAuth } from "@/hooks/useAuth"
import { StatsCard } from "@/components/ui/stats-card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { UserManagement } from "@/components/UserManagement"
import BookingRequests from "@/components/BookingRequests"
import { ClassScheduler } from "@/components/ClassScheduler"
import {
  Users,
  Calendar,
  Activity,
  TrendingUp,
  MapPin,
  Clock,
  UserCheck,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  Settings,
} from "lucide-react"

const recentActivities = [
  { id: 1, action: "New member enrolled", user: "Sarah Wilson", time: "5 minutes ago", type: "success" },
  { id: 2, action: "Class capacity reached", user: "System", time: "12 minutes ago", type: "warning" },
  { id: 3, action: "Equipment maintenance", user: "Tech Team", time: "1 hour ago", type: "info" },
  { id: 4, action: "Staff shift updated", user: "Manager", time: "2 hours ago", type: "info" },
]

const ManagerDashboard = () => {
  const [selectedTab, setSelectedTab] = useState("overview")
  const { user } = useAuth()
  const region = user?.region || "—"

  const [memberCount, setMemberCount] = useState<number>(0)
  const [growth, setGrowth] = useState<number>(0)
  const [growthDirection, setGrowthDirection] = useState<"up" | "down" | null>(null)
  const [newUsersThisMonth, setNewUsersThisMonth] = useState<number>(0)
  const [classesToday, setClassesToday] = useState<number>(0)
  const [pendingRequests, setPendingRequests] = useState<number>(0)

  useEffect(() => {
    if (!user?.region) return

    const fetchStats = async () => {
      const now = new Date()
      const firstDayOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1)
      const firstDayOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)

      const thisMonthStart = firstDayOfCurrentMonth.toISOString()
      const lastMonthStart = firstDayOfLastMonth.toISOString()

      const [totalSnap, currentSnap, lastSnap] = await Promise.all([
        getDocs(query(collection(db, "users"), where("region", "==", region), where("role", "==", "customer"))),
        getDocs(query(collection(db, "users"), where("region", "==", region), where("role", "==", "customer"), where("createdAt", ">=", thisMonthStart))),
        getDocs(query(collection(db, "users"), where("region", "==", region), where("role", "==", "customer"), where("createdAt", ">=", lastMonthStart), where("createdAt", "<", thisMonthStart))),
      ])

      setMemberCount(totalSnap.size)
      setNewUsersThisMonth(currentSnap.size)

      const growthRate = lastSnap.size === 0 ? 100 : ((currentSnap.size - lastSnap.size) / lastSnap.size) * 100
      setGrowth(Math.round(growthRate))
      setGrowthDirection(growthRate >= 0 ? "up" : "down")
    }

const fetchClassesToday = async () => {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const end = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);

  const q = query(
    collection(db, "classes"),
    where("region", "==", region),
    where("date", ">=", Timestamp.fromDate(start)),
    where("date", "<", Timestamp.fromDate(end))
  );

  const snap = await getDocs(q);
  setClassesToday(snap.size);
};
  
    const fetchPendingBookings = async () => {
      const q = query(collection(db, "bookings"), where("region", "==", region), where("status", "==", "pending"))
      const snap = await getDocs(q)
      setPendingRequests(snap.size)
    }

    fetchStats()
    fetchClassesToday()
    fetchPendingBookings()
  }, [user])

  const statsData = [
    {
      title: "Region Members",
      value: memberCount.toString(),
      icon: <Users className="h-4 w-4" />,
      subtitle: "Total active customers",
    },
    {
      title: "Growth",
      value: `${growth}% (${newUsersThisMonth})`,
      icon: <TrendingUp className="h-4 w-4" />,
      subtitle: "from last month",
      trend: {
        value: `${growth}%`,
        isPositive: growthDirection === "up",
      },
    },
    {
      title: "Classes Today",
      value: classesToday.toString(),
      icon: <Calendar className="h-4 w-4" />,
      subtitle: "scheduled today",
    },
    {
      title: "Pending Requests",
      value: pendingRequests.toString(),
      icon: <AlertTriangle className="h-4 w-4" />,
      subtitle: "awaiting approval",
    },
  ]

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case "info":
        return <Activity className="h-4 w-4 text-blue-500" />
      default:
        return <Activity className="h-4 w-4 text-gray-500" />
    }
  }

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="animate-fade-in">
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Manager Dashboard
          </h1>
          <p className="text-muted-foreground mt-1 text-sm md:text-base">Manage your region operations efficiently</p>
        </div>
        <div className="flex items-center gap-2 text-xs md:text-sm text-muted-foreground bg-card/70 px-3 py-1 rounded-lg backdrop-blur-sm border">
          <MapPin className="h-4 w-4 text-primary" />
          {region}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {statsData.map((stat, i) => (
          <div key={stat.title} className="animate-fade-in" style={{ animationDelay: `${i * 100}ms` }}>
            <StatsCard {...stat} />
          </div>
        ))}
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4 mt-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="members">Members</TabsTrigger>
          <TabsTrigger value="bookings">Bookings</TabsTrigger>
          <TabsTrigger value="classes">Classes</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                Recent Regional Activities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map(activity => (
                  <div key={activity.id} className="flex items-center gap-3 p-3 border rounded-lg">
                    {getActivityIcon(activity.type)}
                    <div className="flex-1">
                      <p className="text-sm font-medium">{activity.action}</p>
                      <p className="text-xs text-muted-foreground">by {activity.user}</p>
                    </div>
                    <span className="text-xs text-muted-foreground">{activity.time}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="members">
          <UserManagement />
        </TabsContent>

        <TabsContent value="bookings">
          <BookingRequests />
        </TabsContent>

        <TabsContent value="classes">
          <ClassScheduler />
        </TabsContent>
      </Tabs>
    </>
  )
}

export default ManagerDashboard
  
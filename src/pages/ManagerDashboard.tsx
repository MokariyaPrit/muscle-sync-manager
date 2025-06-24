"use client"

import { useState } from "react"
import { UserManagement } from "@/components/UserManagement"
import BookingRequests from "@/components/BookingRequests"
import { ClassScheduler } from "@/components/ClassScheduler"
import { StatsCard } from "@/components/ui/stats-card"
import { CollapsibleCard } from "@/components/ui/collapsible-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
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

// Mock data for regional health and analytics
const regionalHealth = {
  regionStatus: "active",
  memberCapacity: 85,
  staffOnDuty: 8,
  totalStaff: 12,
  lastUpdate: "2024-01-15 10:30 AM",
  equipmentStatus: "operational",
}

const recentActivities = [
  { id: 1, action: "New member enrolled", user: "Sarah Wilson", time: "5 minutes ago", type: "success" },
  { id: 2, action: "Class capacity reached", user: "System", time: "12 minutes ago", type: "warning" },
  { id: 3, action: "Equipment maintenance", user: "Tech Team", time: "1 hour ago", type: "info" },
  { id: 4, action: "Staff shift updated", user: "Manager", time: "2 hours ago", type: "info" },
]

const ManagerDashboard = () => {
  const [selectedTab, setSelectedTab] = useState("overview")

  const statsData = [
    {
      title: "Region Members",
      value: "312",
      icon: <Users className="h-4 w-4" />,
      trend: { value: "+5%", isPositive: true },
      subtitle: "from last month",
    },
    {
      title: "Classes Today",
      value: "8",
      icon: <Calendar className="h-4 w-4" />,
      subtitle: "2 pending approval",
    },
    {
      title: "Attendance Rate",
      value: "85%",
      icon: <Activity className="h-4 w-4" />,
      trend: { value: "+3%", isPositive: true },
      subtitle: "this week",
    },
    {
      title: "Region Revenue",
      value: "₹85,000",
      icon: <TrendingUp className="h-4 w-4" />,
      trend: { value: "+7%", isPositive: true },
      subtitle: "this month",
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
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="animate-fade-in">
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Manager Dashboard
          </h1>
          <p className="text-muted-foreground mt-1 text-sm md:text-base">Manage your region operations efficiently</p>
        </div>
        <div className="flex items-center gap-2 text-xs md:text-sm text-muted-foreground bg-card/70 px-3 py-1 rounded-lg backdrop-blur-sm border">
          <MapPin className="h-4 w-4 text-primary" />
          Regional View
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {statsData.map((stat, index) => (
          <div key={stat.title} className="animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
            <StatsCard {...stat} />
          </div>
        ))}
      </div>

      {/* Regional Health Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            Regional Health Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Region Status</p>
              <div className="flex items-center gap-2 mt-1">
                <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                <span className="text-sm font-semibold capitalize">{regionalHealth.regionStatus}</span>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Member Capacity</p>
              <div className="mt-1">
                <p className="text-lg font-semibold">{regionalHealth.memberCapacity}%</p>
                <Progress value={regionalHealth.memberCapacity} className="mt-1" />
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Staff on Duty</p>
              <p className="text-lg font-semibold">
                {regionalHealth.staffOnDuty}/{regionalHealth.totalStaff}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Equipment</p>
              <div className="flex items-center gap-2 mt-1">
                <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                <span className="text-sm font-semibold capitalize">{regionalHealth.equipmentStatus}</span>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Last Update</p>
              <p className="text-sm font-semibold">{regionalHealth.lastUpdate}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Region</p>
              <Badge className="mt-1 bg-primary/10 text-primary">North Zone</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs for different manager sections */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="members">Members</TabsTrigger>
          <TabsTrigger value="bookings">Bookings</TabsTrigger>
          <TabsTrigger value="classes">Classes</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Recent Activities */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                Recent Regional Activities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity) => (
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

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Regional Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Button className="h-20 flex flex-col gap-2">
                  <Users className="h-6 w-6" />
                  Add Member
                </Button>
                <Button variant="outline" className="h-20 flex flex-col gap-2">
                  <Calendar className="h-6 w-6" />
                  Schedule Class
                </Button>
                <Button variant="outline" className="h-20 flex flex-col gap-2">
                  <UserCheck className="h-6 w-6" />
                  Staff Schedule
                </Button>
                <Button variant="outline" className="h-20 flex flex-col gap-2">
                  <BarChart3 className="h-6 w-6" />
                  Regional Report
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Regional Performance */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Monthly Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Member Retention</span>
                    <span className="text-sm font-semibold">92%</span>
                  </div>
                  <Progress value={92} />

                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Class Attendance</span>
                    <span className="text-sm font-semibold">85%</span>
                  </div>
                  <Progress value={85} />

                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Revenue Target</span>
                    <span className="text-sm font-semibold">78%</span>
                  </div>
                  <Progress value={78} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  Today's Schedule
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-2 border rounded">
                    <div>
                      <p className="text-sm font-medium">Morning Yoga</p>
                      <p className="text-xs text-muted-foreground">07:00 AM - Studio A</p>
                    </div>
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                      Active
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 border rounded">
                    <div>
                      <p className="text-sm font-medium">HIIT Training</p>
                      <p className="text-xs text-muted-foreground">06:00 PM - Gym Floor</p>
                    </div>
                    <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400">
                      Upcoming
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 border rounded">
                    <div>
                      <p className="text-sm font-medium">Pilates</p>
                      <p className="text-xs text-muted-foreground">08:00 PM - Studio B</p>
                    </div>
                    <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
                      Scheduled
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="members" className="space-y-6">
          <CollapsibleCard
            title="Regional Member Management"
            icon={<Users className="h-5 w-5 text-primary" />}
            defaultOpen={true}
          >
            <UserManagement />
          </CollapsibleCard>
        </TabsContent>

        <TabsContent value="bookings" className="space-y-6">
          <CollapsibleCard
            title="Regional Booking Requests"
            icon={<Calendar className="h-5 w-5 text-primary/80" />}
            defaultOpen={true}
          >
            <BookingRequests />
          </CollapsibleCard>
        </TabsContent>

        <TabsContent value="classes" className="space-y-6">
          <CollapsibleCard
            title="Regional Class Scheduler"
            icon={<Settings className="h-5 w-5 text-primary/60" />}
            defaultOpen={true}
          >
            <ClassScheduler />
          </CollapsibleCard>
        </TabsContent>
      </Tabs>
    </>
  )
}

export default ManagerDashboard
  
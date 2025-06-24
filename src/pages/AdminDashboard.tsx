// AdminDashboard.tsx
"use client"

import { useState, useEffect } from "react"
import { UserManagement } from "@/components/UserManagement"
import BookingRequests from "@/components/BookingRequests"
import { ClassScheduler } from "@/components/ClassScheduler"
import { StatsCard } from "@/components/ui/stats-card"
import { CollapsibleCard } from "@/components/ui/collapsible-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Users, Calendar, Settings, BarChart3, Activity, UserCheck, AlertTriangle, CheckCircle } from "lucide-react"
import { db } from '@/firebase'
import { collection, getDocs, query, where, Timestamp } from 'firebase/firestore'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { format } from 'date-fns'

const recentActivities = [
  { id: 1, action: "New member registered", user: "John Doe", time: "2 minutes ago", type: "success" },
  { id: 2, action: "Class booking cancelled", user: "Jane Smith", time: "5 minutes ago", type: "warning" },
  { id: 3, action: "Payment processed", user: "Mike Johnson", time: "10 minutes ago", type: "success" },
  { id: 4, action: "Staff member added", user: "Admin", time: "15 minutes ago", type: "info" },
]

const AdminDashboard = () => {
  const [selectedTab, setSelectedTab] = useState("overview")
  const [region, setRegion] = useState<string>('all')
  const [dateFilter, setDateFilter] = useState<string>('')
  const [totalCustomers, setTotalCustomers] = useState<number>(0)
  const [totalManagers, setTotalManagers] = useState<number>(0)
  const [totalClasses, setTotalClasses] = useState<number>(0)
  const [pendingRequests, setPendingRequests] = useState<number>(0)

  const fetchData = async () => {
    const regionFilter = region !== 'all' ? where('region', '==', region) : null
    const todayStart = new Date()
    todayStart.setHours(0, 0, 0, 0)
    const todayTimestamp = Timestamp.fromDate(todayStart)

    const userQuery = regionFilter ? query(collection(db, 'users'), regionFilter) : collection(db, 'users')
    const usersSnapshot = await getDocs(userQuery)
    setTotalCustomers(usersSnapshot.docs.filter(doc => doc.data().role === 'customer').length)
    setTotalManagers(usersSnapshot.docs.filter(doc => doc.data().role === 'manager').length)

    const bookingQuery = regionFilter ? query(collection(db, 'bookings'), regionFilter) : collection(db, 'bookings')
    const bookingsSnapshot = await getDocs(bookingQuery)
    setPendingRequests(bookingsSnapshot.docs.filter(doc => doc.data().status === 'pending').length)

    const classQuery = regionFilter ? query(collection(db, 'classes'), regionFilter) : collection(db, 'classes')
    const classSnapshot = await getDocs(classQuery)
    const filteredClasses = dateFilter
      ? classSnapshot.docs.filter(doc => format(doc.data().date.toDate(), 'yyyy-MM-dd') === dateFilter)
      : classSnapshot.docs
    setTotalClasses(filteredClasses.length)
  }

  useEffect(() => {
    fetchData()
  }, [region, dateFilter])

  const statsData = [
    {
      title: "Total Members",
      value: `${totalCustomers}`,
      icon: <Users className="h-4 w-4" />,
      subtitle: region === 'all' ? "All regions" : `Region: ${region}`,
    },
    {
      title: "Active Classes",
      value: `${totalClasses}`,
      icon: <Calendar className="h-4 w-4" />,
      subtitle: dateFilter ? `On ${dateFilter}` : "Across all dates",
    },
    {
      title: "Staff Members",
      value: `${totalManagers}`,
      icon: <Settings className="h-4 w-4" />,
      subtitle: region === 'all' ? "All regions" : `Region: ${region}`,
    },
    {
      title: "Pending Requests",
      value: `${pendingRequests}`,
      icon: <BarChart3 className="h-4 w-4" />,
      subtitle: region === 'all' ? "All regions" : `Region: ${region}`,
    },
  ]

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "success": return <CheckCircle className="h-4 w-4 text-green-500" />
      case "warning": return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case "info": return <Activity className="h-4 w-4 text-blue-500" />
      default: return <Activity className="h-4 w-4 text-gray-500" />
    }
  } 

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-primary">Admin Dashboard</h1>
          <p className="text-muted-foreground text-sm">Manage your gym operations with ease</p>
        </div>
        <div className="flex gap-2">
          <Select value={region} onValueChange={setRegion}>
            <SelectTrigger className="w-[140px]"><SelectValue placeholder="Region" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="gujarat">Gujarat</SelectItem>
              <SelectItem value="maharashtra">Maharashtra</SelectItem>
              <SelectItem value="madhya pradesh">Madhya Pradesh</SelectItem>
              <SelectItem value="rajasthan">Rajasthan</SelectItem>
            </SelectContent>
          </Select> 
          <Input type="date" value={dateFilter} onChange={e => setDateFilter(e.target.value)} className="w-[140px]" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mt-4">
        {statsData.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4 mt-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="users">User Management</TabsTrigger>
          <TabsTrigger value="bookings">Bookings</TabsTrigger>
          <TabsTrigger value="classes">Classes</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                Recent Activities
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
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <CollapsibleCard title="User Management" icon={<Users className="h-5 w-5 text-primary" />} defaultOpen={true}>
            <UserManagement />
          </CollapsibleCard>
        </TabsContent>

        <TabsContent value="bookings" className="space-y-6">
          <CollapsibleCard title="Booking Requests" icon={<Calendar className="h-5 w-5 text-primary/80" />} defaultOpen={true}>
            <BookingRequests />
          </CollapsibleCard>
        </TabsContent>

        <TabsContent value="classes" className="space-y-6">
          <CollapsibleCard title="Class Scheduler" icon={<Settings className="h-5 w-5 text-primary/60" />} defaultOpen={true}>
            <ClassScheduler />
          </CollapsibleCard>
        </TabsContent>
      </Tabs>
    </>
  )
}

export default AdminDashboard
  
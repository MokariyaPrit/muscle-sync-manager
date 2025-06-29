// CustomerDashboard.tsx
"use client"

import { Suspense, useEffect, useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import BookClass from "@/components/BookClass"
import { MyUpcomingClasses } from "@/components/MyUpcomingClasses "
import { Calendar, Activity, Target, Award, Clock, MapPin, X, CheckCircle, AlertCircle } from "lucide-react"
import { toast } from "sonner"
import { db } from "@/firebase"
import { collection, getDocs, query, where } from "firebase/firestore"
import { format } from "date-fns"
import { useAuth } from "@/hooks/useAuth"

const CustomerDashboard = () => {
  const { user } = useAuth()
  const [bookingRequests, setBookingRequests] = useState<any[]>([])

  const handleCancelRequest = (requestId: string) => {
    setBookingRequests((prev) => prev.filter((request) => request.id !== requestId))
    toast.success("Booking request cancelled successfully")
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed": return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
      case "pending": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
      case "cancelled": return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed": return <CheckCircle className="h-4 w-4" />
      case "pending": return <Clock className="h-4 w-4" />
      case "cancelled": return <X className="h-4 w-4" />
      default: return <AlertCircle className="h-4 w-4" />
    }
  }

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        if (!user?.id) return
        const q = query(collection(db, "bookings"), where("userId", "==", user.id))
        const snapshot = await getDocs(q)
        const list = snapshot.docs.map((doc) => {
          const data = doc.data()
          return {
            id: doc.id,
            className: data.className,
            instructor: data.instructor,
            date: data.date?.toDate ? format(data.date.toDate(), "yyyy-MM-dd") : "",
            time: data.time,
            location: data.location || "",
            status: data.status || "pending"
          }
        })
        setBookingRequests(list)
      } catch (err) {
        console.error("Error fetching bookings", err)
      }
    }
    fetchBookings()
  }, [user])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">My Fitness Journey</h1>
        <p className="text-muted-foreground">Track your progress and manage your fitness activities</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Classes This Month</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">+3 from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Workout Hours</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">28.5</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fitness Goal</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">75%</div>
            <p className="text-xs text-muted-foreground">Progress this month</p>
            <Progress value={75} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Achievements</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">Badges earned</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="book-class" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="book-class">Book Classes</TabsTrigger>
          <TabsTrigger value="my-bookings">My Bookings</TabsTrigger>
          <TabsTrigger value="upcoming-classes">Upcoming Classes</TabsTrigger>
        </TabsList>

        <TabsContent value="book-class" className="space-y-4">
          <BookClass />
        </TabsContent>

        <TabsContent value="my-bookings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                My Booking Requests
              </CardTitle>
            </CardHeader>
            <CardContent>
              {bookingRequests.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No booking requests found</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {bookingRequests.map((request) => (
                    <div key={request.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold">{request.className}</h3>
                          <Badge className={getStatusColor(request.status)}>
                            {getStatusIcon(request.status)}
                            <span className="ml-1 capitalize">{request.status}</span>
                          </Badge>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {request.date} at {request.time}
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {request.location}
                          </div>
                          <div>Instructor: {request.instructor || "N/A"}</div>
                        </div>
                      </div>
                      {request.status === "pending" && (
                        <Button variant="outline" size="sm" onClick={() => handleCancelRequest(request.id)} className="text-red-600 hover:text-red-700 hover:bg-red-50">
                          <X className="h-4 w-4 mr-1" /> Cancel
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="upcoming-classes" className="space-y-4">
          <Suspense fallback={<div>Loading classes...</div>}>
            <MyUpcomingClasses />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default CustomerDashboard
  
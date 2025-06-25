"use client"

import { useEffect, useState, useMemo } from "react"
import { useAuth } from "@/hooks/useAuth"
import { db } from "@/firebase"
import { collection, getDocs, query, where } from "firebase/firestore"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Calendar,
  Clock,
  MapPin,
  User,
  Dumbbell,
  Heart,
  Zap,
  Target,
  Activity,
  Loader2,
  CheckCircle,
  Star,
} from "lucide-react"
import { startOfWeek, addDays, isSameDay } from "date-fns"

interface ClassSchedule {
  id: string
  title: string
  instructor: string
  startTime: string
  endTime: string
  dayOfWeek: number
  region: string
  location: string
  capacity: number
  description: string
  category: string
  difficulty: string
  isDefault: boolean
}

const CustomerScheduleView = () => {
  const { user } = useAuth()
  const [schedules, setSchedules] = useState<ClassSchedule[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedDay, setSelectedDay] = useState<number | null>(null)

  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

  const filteredSchedules = useMemo(() => {
    return schedules.filter((schedule) => schedule.region === user?.region)
  }, [schedules, user?.region])

  const stats = useMemo(() => {
    const total = filteredSchedules.length
    const today = new Date().getDay()
    const todayClasses = filteredSchedules.filter((s) => s.dayOfWeek === (today === 0 ? 7 : today)).length
    return { total, todayClasses }
  }, [filteredSchedules])

  useEffect(() => {
    fetchSchedules()
  }, [user])

  const fetchSchedules = async () => {
    if (!user?.region) return

    try {
      setLoading(true)
      const schedulesQuery = query(collection(db, "weeklySchedules"), where("region", "==", user.region))
      const snapshot = await getDocs(schedulesQuery)
      const schedulesData: ClassSchedule[] = []

      snapshot.forEach((doc) => {
        const data = doc.data()
        schedulesData.push({
          id: doc.id,
          title: data.title || "",
          instructor: data.instructor || "",
          startTime: data.startTime || "",
          endTime: data.endTime || "",
          dayOfWeek: data.dayOfWeek || 1,
          region: data.region || "",
          location: data.location || "",
          capacity: data.capacity || 20,
          description: data.description || "",
          category: data.category || "",
          difficulty: data.difficulty || "Beginner",
          isDefault: data.isDefault || false,
        })
      })

      setSchedules(schedulesData)
    } catch (error) {
      console.error("Error fetching schedules:", error)
    } finally {
      setLoading(false)
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case "cardio":
        return <Heart className="w-4 h-4" />
      case "strength":
        return <Dumbbell className="w-4 h-4" />
      case "yoga":
        return <Target className="w-4 h-4" />
      case "hiit":
        return <Zap className="w-4 h-4" />
      default:
        return <Activity className="w-4 h-4" />
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "beginner":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
      case "intermediate":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
      case "advanced":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
    }
  }

  const getClassesForDay = (dayIndex: number) => {
    return filteredSchedules
      .filter((schedule) => schedule.dayOfWeek === dayIndex)
      .sort((a, b) => a.startTime.localeCompare(b.startTime))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Loading Your Classes</h3>
            <p className="text-muted-foreground">Getting the latest schedule for you...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Customer Header */}
      <div className="text-center space-y-4">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Your Weekly Classes
          </h1>
          <p className="text-lg text-muted-foreground">
            Discover amazing fitness classes in <span className="font-semibold text-primary">{user?.region}</span>
          </p>
        </div>

        {/* Welcome Banner */}
        <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10">
          <CardContent className="p-6">
            <div className="flex items-center justify-center gap-4">
              <div className="p-3 bg-primary/10 rounded-full">
                <Star className="h-8 w-8 text-primary" />
              </div>
              <div className="text-center">
                <h3 className="text-xl font-semibold text-primary">Welcome to FitZone Pro!</h3>
                <p className="text-muted-foreground">
                  All classes are <span className="font-semibold text-green-600">drop-in friendly</span> - no
                  registration required!
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="text-center">
          <CardContent className="p-6">
            <div className="space-y-2">
              <Calendar className="h-8 w-8 mx-auto text-primary" />
              <p className="text-3xl font-bold">{stats.total}</p>
              <p className="text-sm text-muted-foreground">Classes This Week</p>
            </div>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="p-6">
            <div className="space-y-2">
              <Clock className="h-8 w-8 mx-auto text-green-500" />
              <p className="text-3xl font-bold text-green-600">{stats.todayClasses}</p>
              <p className="text-sm text-muted-foreground">Classes Today</p>
            </div>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="p-6">
            <div className="space-y-2">
              <MapPin className="h-8 w-8 mx-auto text-purple-500" />
              <p className="text-2xl font-bold text-purple-600">{user?.region}</p>
              <p className="text-sm text-muted-foreground">Your Location</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Day Selector */}
      <Card>
        <CardHeader>
          <CardTitle className="text-center">Select a Day</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
            {daysOfWeek.map((day, index) => {
              const dayIndex = index + 1
              const isToday = isSameDay(addDays(startOfWeek(new Date(), { weekStartsOn: 1 }), index), new Date())
              const classCount = getClassesForDay(dayIndex).length

              return (
                <Button
                  key={day}
                  variant={selectedDay === dayIndex ? "default" : "outline"}
                  className={`h-20 flex flex-col gap-1 ${isToday ? "ring-2 ring-primary" : ""}`}
                  onClick={() => setSelectedDay(selectedDay === dayIndex ? null : dayIndex)}
                >
                  <span className="font-semibold">{day.slice(0, 3)}</span>
                  <span className="text-xs opacity-70">{classCount} classes</span>
                  {isToday && <div className="w-2 h-2 bg-primary rounded-full" />}
                </Button>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Classes Display */}
      {selectedDay ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              {daysOfWeek[selectedDay - 1]} Classes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {getClassesForDay(selectedDay).map((classItem) => (
                <Card key={classItem.id} className="border-l-4 border-l-primary">
                  <CardContent className="p-6">
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <h3 className="text-xl font-semibold">{classItem.title}</h3>
                          {classItem.isDefault && (
                            <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400">
                              Regular Class
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <User className="w-4 h-4" />
                          <span>Instructor: {classItem.instructor}</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-primary" />
                          <span className="font-medium">
                            {classItem.startTime} - {classItem.endTime}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <MapPin className="w-4 h-4" />
                          <span>{classItem.location}</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          {getCategoryIcon(classItem.category)}
                          <span className="font-medium">{classItem.category}</span>
                        </div>
                        <Badge className={getDifficultyColor(classItem.difficulty)}>{classItem.difficulty}</Badge>
                      </div>
                    </div>

                    {classItem.description && (
                      <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                        <p className="text-sm text-muted-foreground">{classItem.description}</p>
                      </div>
                    )}

                    <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                      <div className="flex items-center gap-2 text-green-700 dark:text-green-400">
                        <CheckCircle className="w-4 h-4" />
                        <span className="font-medium">Drop-in Welcome - No booking required!</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-12 text-center">
            <Calendar className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">Select a Day</h3>
            <p className="text-muted-foreground">Choose a day above to see available classes</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default CustomerScheduleView

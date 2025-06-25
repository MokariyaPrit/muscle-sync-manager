"use client"

import { useEffect, useState, useMemo, useCallback } from "react"
import { useAuth } from "@/hooks/useAuth"
import { db } from "@/firebase"
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from "firebase/firestore"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Calendar,
  Clock,
  MapPin,
  Plus,
  Edit,
  Trash2,
  MoreHorizontal,
  User,
  Dumbbell,
  Heart,
  Zap,
  Target,
  Activity,
  Loader2,
  Save,
  AlertTriangle,
  Settings,
  BarChart3,
  Globe,
  TrendingUp,
} from "lucide-react"
import { format, startOfWeek, addDays, isSameDay } from "date-fns"
import { toast } from "sonner"

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
  createdBy: string
  createdAt: any
  updatedAt: any
}

interface FormData {
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
}

const AdminScheduleView = () => {
  const { user } = useAuth()
  const [schedules, setSchedules] = useState<ClassSchedule[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedRegion, setSelectedRegion] = useState<string>("")
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [editingClass, setEditingClass] = useState<ClassSchedule | null>(null)
  const [deletingClass, setDeletingClass] = useState<ClassSchedule | null>(null)
  const [saving, setSaving] = useState(false)

  const [formData, setFormData] = useState<FormData>({
    title: "",
    instructor: "",
    startTime: "",
    endTime: "",
    dayOfWeek: 1,
    region: "",
    location: "",
    capacity: 20,
    description: "",
    category: "",
    difficulty: "Beginner",
  })

  const regions = ["Gujarat", "Maharashtra", "Madhya Pradesh", "Rajasthan"]
  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
  const categories = ["Cardio", "Strength", "Yoga", "Pilates", "HIIT", "Dance", "Martial Arts", "Swimming"]
  const difficulties = ["Beginner", "Intermediate", "Advanced"]

  const filteredSchedules = useMemo(() => {
    if (!selectedRegion) return schedules
    return schedules.filter((schedule) => schedule.region === selectedRegion)
  }, [schedules, selectedRegion])

  const globalStats = useMemo(() => {
    const total = schedules.length
    const defaultCount = schedules.filter((s) => s.isDefault).length
    const customCount = schedules.filter((s) => !s.isDefault).length
    const regionStats = regions.map((region) => ({
      region,
      count: schedules.filter((s) => s.region === region).length,
    }))
    return { total, defaultCount, customCount, regionStats }
  }, [schedules])

  const regionStats = useMemo(() => {
    if (!selectedRegion) return { total: 0, defaultCount: 0, customCount: 0 }
    const regionSchedules = schedules.filter((s) => s.region === selectedRegion)
    return {
      total: regionSchedules.length,
      defaultCount: regionSchedules.filter((s) => s.isDefault).length,
      customCount: regionSchedules.filter((s) => !s.isDefault).length,
    }
  }, [schedules, selectedRegion])

  useEffect(() => {
    if (regions.length > 0) {
      setSelectedRegion(regions[0])
    }
  }, [])

  useEffect(() => {
    fetchSchedules()
  }, [])

  const fetchSchedules = async () => {
    try {
      setLoading(true)
      const snapshot = await getDocs(collection(db, "weeklySchedules"))
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
          createdBy: data.createdBy || "",
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
        })
      })

      setSchedules(schedulesData)
    } catch (error) {
      console.error("Error fetching schedules:", error)
      toast.error("Failed to fetch schedules")
    } finally {
      setLoading(false)
    }
  }

  const resetForm = useCallback(() => {
    setFormData({
      title: "",
      instructor: "",
      startTime: "",
      endTime: "",
      dayOfWeek: 1,
      region: selectedRegion,
      location: "",
      capacity: 20,
      description: "",
      category: "",
      difficulty: "Beginner",
    })
  }, [selectedRegion])

  const openAddDialog = useCallback(() => {
    resetForm()
    setShowAddDialog(true)
  }, [resetForm])

  const openEditDialog = useCallback((classItem: ClassSchedule) => {
    setFormData({
      title: classItem.title,
      instructor: classItem.instructor,
      startTime: classItem.startTime,
      endTime: classItem.endTime,
      dayOfWeek: classItem.dayOfWeek,
      region: classItem.region,
      location: classItem.location,
      capacity: classItem.capacity,
      description: classItem.description,
      category: classItem.category,
      difficulty: classItem.difficulty,
    })
    setEditingClass(classItem)
    setShowEditDialog(true)
  }, [])

  const openDeleteDialog = useCallback((classItem: ClassSchedule) => {
    setDeletingClass(classItem)
    setShowDeleteDialog(true)
  }, [])

  const handleSaveClass = async () => {
    if (!formData.title || !formData.instructor || !formData.startTime || !formData.endTime) {
      toast.error("Please fill in all required fields")
      return
    }

    try {
      setSaving(true)

      if (editingClass) {
        const classRef = doc(db, "weeklySchedules", editingClass.id)
        await updateDoc(classRef, {
          ...formData,
          updatedAt: serverTimestamp(),
        })
        toast.success("Class updated successfully!")
        setShowEditDialog(false)
        setEditingClass(null)
      } else {
        const classData = {
          ...formData,
          isDefault: false,
          createdBy: user?.id || "",
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        }
        await addDoc(collection(db, "weeklySchedules"), classData)
        toast.success("Class added successfully!")
        setShowAddDialog(false)
      }

      resetForm()
      fetchSchedules()
    } catch (error) {
      console.error("Error saving class:", error)
      toast.error("Failed to save class")
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteClass = async () => {
    if (!deletingClass) return

    if (deletingClass.isDefault) {
      toast.error("Cannot delete default classes")
      return
    }

    try {
      setSaving(true)
      await deleteDoc(doc(db, "weeklySchedules", deletingClass.id))
      toast.success("Class deleted successfully!")
      setShowDeleteDialog(false)
      setDeletingClass(null)
      fetchSchedules()
    } catch (error) {
      console.error("Error deleting class:", error)
      toast.error("Failed to delete class")
    } finally {
      setSaving(false)
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

  const getClassesForDay = useCallback(
    (dayIndex: number) => {
      return filteredSchedules
        .filter((schedule) => schedule.dayOfWeek === dayIndex)
        .sort((a, b) => a.startTime.localeCompare(b.startTime))
    },
    [filteredSchedules],
  )

  const ClassForm = () => {
    const handleInputChange = (field: keyof FormData, value: string | number) => {
      setFormData((prev) => ({ ...prev, [field]: value }))
    }

    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="title">Class Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              placeholder="e.g., Morning Yoga"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="instructor">Instructor *</Label>
            <Input
              id="instructor"
              value={formData.instructor}
              onChange={(e) => handleInputChange("instructor", e.target.value)}
              placeholder="Instructor name"
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Day of Week</Label>
            <Select
              value={formData.dayOfWeek.toString()}
              onValueChange={(value) => handleInputChange("dayOfWeek", Number.parseInt(value))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {daysOfWeek.map((day, index) => (
                  <SelectItem key={index + 1} value={(index + 1).toString()}>
                    {day}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="startTime">Start Time *</Label>
            <Input
              id="startTime"
              type="time"
              value={formData.startTime}
              onChange={(e) => handleInputChange("startTime", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="endTime">End Time *</Label>
            <Input
              id="endTime"
              type="time"
              value={formData.endTime}
              onChange={(e) => handleInputChange("endTime", e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Region *</Label>
            <Select value={formData.region} onValueChange={(value) => handleInputChange("region", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select region" />
              </SelectTrigger>
              <SelectContent>
                {regions.map((region) => (
                  <SelectItem key={region} value={region}>
                    {region}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Category</Label>
            <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Difficulty</Label>
            <Select value={formData.difficulty} onValueChange={(value) => handleInputChange("difficulty", value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {difficulties.map((difficulty) => (
                  <SelectItem key={difficulty} value={difficulty}>
                    {difficulty}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => handleInputChange("location", e.target.value)}
              placeholder="e.g., Studio A"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="capacity">Capacity</Label>
            <Input
              id="capacity"
              type="number"
              value={formData.capacity}
              onChange={(e) => handleInputChange("capacity", Number.parseInt(e.target.value) || 20)}
              min="1"
              max="100"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => handleInputChange("description", e.target.value)}
            placeholder="Class description..."
            rows={3}
          />
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Loading Admin Dashboard</h3>
            <p className="text-muted-foreground">Fetching global schedule data...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Admin Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Global Schedule Management
          </h1>
          <p className="text-muted-foreground">Manage classes across all regions and locations</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={selectedRegion} onValueChange={setSelectedRegion}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select region" />
            </SelectTrigger>
            <SelectContent>
              {regions.map((region) => (
                <SelectItem key={region} value={region}>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    {region}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={openAddDialog} size="lg">
            <Plus className="w-5 h-5 mr-2" />
            Add New Class
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Global Overview</TabsTrigger>
          <TabsTrigger value="schedule">Schedule Management</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Global Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Classes</p>
                    <p className="text-2xl font-bold">{globalStats.total}</p>
                  </div>
                  <Globe className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Default Classes</p>
                    <p className="text-2xl font-bold text-blue-600">{globalStats.defaultCount}</p>
                  </div>
                  <Settings className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Custom Classes</p>
                    <p className="text-2xl font-bold text-green-600">{globalStats.customCount}</p>
                  </div>
                  <Plus className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Active Regions</p>
                    <p className="text-2xl font-bold text-purple-600">{regions.length}</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Regional Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Regional Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {globalStats.regionStats.map((stat) => (
                  <Card key={stat.region} className="border-l-4 border-l-primary">
                    <CardContent className="p-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold">{stat.region}</h3>
                          <Badge variant="outline">{stat.count} classes</Badge>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="w-4 h-4" />
                          <span>Active location</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="schedule" className="space-y-6">
          {/* Region-specific Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Region Classes</p>
                    <p className="text-2xl font-bold">{regionStats.total}</p>
                  </div>
                  <Calendar className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Default</p>
                    <p className="text-2xl font-bold text-blue-600">{regionStats.defaultCount}</p>
                  </div>
                  <Settings className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Custom</p>
                    <p className="text-2xl font-bold text-green-600">{regionStats.customCount}</p>
                  </div>
                  <Plus className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Weekly Schedule Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            {daysOfWeek.map((day, dayIndex) => {
              const dayClasses = getClassesForDay(dayIndex + 1)
              const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 })
              const currentDate = addDays(weekStart, dayIndex)
              const isToday = isSameDay(currentDate, new Date())

              return (
                <Card key={day} className={`${isToday ? "ring-2 ring-primary" : ""}`}>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center justify-between">
                      <span className={isToday ? "text-primary" : ""}>{day}</span>
                      <Badge variant={isToday ? "default" : "outline"} className="text-xs">
                        {format(currentDate, "MMM dd")}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {dayClasses.length === 0 ? (
                      <div className="text-center py-6 text-muted-foreground">
                        <Calendar className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">No classes</p>
                      </div>
                    ) : (
                      dayClasses.map((classItem) => (
                        <Card key={classItem.id} className="group bg-muted/30">
                          <CardContent className="p-3 space-y-2">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <h4 className="font-semibold text-sm">{classItem.title}</h4>
                                  {classItem.isDefault && (
                                    <Badge className="text-xs bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400">
                                      Default
                                    </Badge>
                                  )}
                                </div>
                                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                  <User className="w-3 h-3" />
                                  {classItem.instructor}
                                </div>
                              </div>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
                                  >
                                    <MoreHorizontal className="h-3 w-3" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => openEditDialog(classItem)}>
                                    <Edit className="w-4 h-4 mr-2" />
                                    Edit
                                  </DropdownMenuItem>
                                  {!classItem.isDefault && (
                                    <>
                                      <DropdownMenuSeparator />
                                      <DropdownMenuItem
                                        onClick={() => openDeleteDialog(classItem)}
                                        className="text-red-600"
                                      >
                                        <Trash2 className="w-4 h-4 mr-2" />
                                        Delete
                                      </DropdownMenuItem>
                                    </>
                                  )}
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>

                            <div className="flex items-center gap-1 text-xs">
                              <Clock className="w-3 h-3 text-primary" />
                              <span>
                                {classItem.startTime} - {classItem.endTime}
                              </span>
                            </div>

                            {classItem.location && (
                              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <MapPin className="w-3 h-3" />
                                {classItem.location}
                              </div>
                            )}

                            <div className="flex items-center justify-between">
                              {classItem.category && (
                                <Badge variant="outline" className="text-xs">
                                  {getCategoryIcon(classItem.category)}
                                  <span className="ml-1">{classItem.category}</span>
                                </Badge>
                              )}
                              <Badge className={`text-xs ${getDifficultyColor(classItem.difficulty)}`}>
                                {classItem.difficulty}
                              </Badge>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Class Distribution by Category</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {categories.map((category) => {
                    const count = schedules.filter((s) => s.category === category).length
                    const percentage = schedules.length > 0 ? (count / schedules.length) * 100 : 0
                    return (
                      <div key={category} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {getCategoryIcon(category)}
                            <span className="font-medium">{category}</span>
                          </div>
                          <span className="text-sm text-muted-foreground">{count} classes</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full transition-all duration-300"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Difficulty Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {difficulties.map((difficulty) => {
                    const count = schedules.filter((s) => s.difficulty === difficulty).length
                    const percentage = schedules.length > 0 ? (count / schedules.length) * 100 : 0
                    return (
                      <div key={difficulty} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{difficulty}</span>
                          <span className="text-sm text-muted-foreground">{count} classes</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all duration-300 ${
                              difficulty === "Beginner"
                                ? "bg-green-500"
                                : difficulty === "Intermediate"
                                  ? "bg-yellow-500"
                                  : "bg-red-500"
                            }`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Add Class Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Class</DialogTitle>
          </DialogHeader>
          <ClassForm />
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)} disabled={saving}>
              Cancel
            </Button>
            <Button onClick={handleSaveClass} disabled={saving}>
              {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
              Add Class
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Class Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Class</DialogTitle>
          </DialogHeader>
          <ClassForm />
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)} disabled={saving}>
              Cancel
            </Button>
            <Button onClick={handleSaveClass} disabled={saving}>
              {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
              Update Class
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              Delete Class
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deletingClass?.title}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={saving}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteClass} disabled={saving} className="bg-red-600 hover:bg-red-700">
              {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Trash2 className="w-4 h-4 mr-2" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default AdminScheduleView

"use client"
import { useAuth } from "@/hooks/useAuth"
import CustomerScheduleView from "@/components/schedule/CustomerScheduleView"
import ManagerScheduleView from "@/components/schedule/ManagerScheduleView"
import AdminScheduleView from "@/components/schedule/AdminScheduleView"

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

const WeeklySchedule = () => {
  const { user } = useAuth()

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <h3 className="text-lg font-semibold">Access Denied</h3>
          <p className="text-muted-foreground">Please log in to view the schedule.</p>
        </div>
      </div>
    )
  }

  switch (user.role) {
    case "customer":
      return <CustomerScheduleView />
    case "manager":
      return <ManagerScheduleView />
    case "admin":
      return <AdminScheduleView />
    default:
      return (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-4">
            <h3 className="text-lg font-semibold">Invalid Role</h3>
            <p className="text-muted-foreground">Your account role is not recognized.</p>
          </div>
        </div>
      )
  }
}

export default WeeklySchedule
  
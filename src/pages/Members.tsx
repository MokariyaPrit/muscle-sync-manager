"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/hooks/useAuth"
import { db } from "@/firebase"
import { collection, getDocs, query, where } from "firebase/firestore"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
  Users,
  Search,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  UserPlus,
  Download,
  Calendar,
  MapPin,
  Mail,
  Crown,
  AlertCircle,
  CheckCircle,
  Clock,
  Loader2,
} from "lucide-react"
import { format } from "date-fns"
import { toast } from "sonner"

interface User {
  id: string
  name: string
  email: string
  role: string
  region: string
  createdAt: any
  photoURL?: string
  phone?: string
}

interface Membership {
  userId: string
  email: string
  status: string
  plan: string
  expiry: any
  upgradedAt: any
  paymentId: string
}

interface MemberData extends User {
  membership?: Membership
  membershipStatus: "active" | "expired" | "none"
}

const Members = () => {
  const { user } = useAuth()
  const [members, setMembers] = useState<MemberData[]>([])
  const [filteredMembers, setFilteredMembers] = useState<MemberData[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [regionFilter, setRegionFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [roleFilter, setRoleFilter] = useState("all")
  const [selectedMember, setSelectedMember] = useState<MemberData | null>(null)
  const [showMemberDetails, setShowMemberDetails] = useState(false)

  const regions = ["Gujarat", "Maharashtra", "Madhya Pradesh", "Rajasthan"]
  const roles = ["admin", "manager", "customer"]
  const statuses = ["active", "expired", "none"]

  useEffect(() => {
    fetchMembers()
  }, [user])

  useEffect(() => {
    filterMembers()
  }, [members, searchTerm, regionFilter, statusFilter, roleFilter])

  const fetchMembers = async () => {
    if (!user?.id) return

    try {
      setLoading(true)

      // Fetch users based on role
      let usersQuery
      if (user.role === "admin") {
        // Admin can see all users
        usersQuery = collection(db, "users")
      } else if (user.role === "manager") {
        // Manager can only see users from their region
        usersQuery = query(collection(db, "users"), where("region", "==", user.region))
      } else {
        // Customers shouldn't access this page, but just in case
        setLoading(false)
        return
      }

      const usersSnapshot = await getDocs(usersQuery)
      const usersData: User[] = []

      usersSnapshot.forEach((doc) => {
        const data = doc.data() as any
        usersData.push({
          id: doc.id,
          name: data.name || "Unknown",
          email: data.email || "",
          role: data.role || "customer",
          region: data.region || "Unknown",
          createdAt: data.createdAt,
          photoURL: data.photoURL,
          phone: data.phone,
        })
      })

      // Fetch memberships for all users
      const membershipsSnapshot = await getDocs(collection(db, "memberships"))
      const membershipsMap = new Map<string, Membership>()

      membershipsSnapshot.forEach((doc) => {
        const data = doc.data()
        membershipsMap.set(doc.id, {
          userId: doc.id,
          email: data.email || "",
          status: data.status || "none",
          plan: data.plan || "Basic",
          expiry: data.expiry,
          upgradedAt: data.upgradedAt,
          paymentId: data.paymentId || "",
        })
      })

      // Combine user data with membership data
      const membersData: MemberData[] = usersData.map((userData) => {
        const membership = membershipsMap.get(userData.id)
        let membershipStatus: "active" | "expired" | "none" = "none"

        if (membership) {
          const expiryDate = membership.expiry?.toDate?.() || new Date(membership.expiry)
          if (membership.status === "active" && expiryDate > new Date()) {
            membershipStatus = "active"
          } else if (membership.status === "active" && expiryDate <= new Date()) {
            membershipStatus = "expired"
          }
        }

        return {
          ...userData,
          membership,
          membershipStatus,
        }
      })

      setMembers(membersData)
    } catch (error) {
      console.error("Error fetching members:", error)
      toast.error("Failed to fetch members data")
    } finally {
      setLoading(false)
    }
  }

  const filterMembers = () => {
    let filtered = members

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (member) =>
          member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          member.email.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Region filter
    if (regionFilter !== "all") {
      filtered = filtered.filter((member) => member.region.toLowerCase() === regionFilter.toLowerCase())
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((member) => member.membershipStatus === statusFilter)
    }

    // Role filter
    if (roleFilter !== "all") {
      filtered = filtered.filter((member) => member.role === roleFilter)
    }

    setFilteredMembers(filtered)
  }

  const getStatusBadge = (status: "active" | "expired" | "none") => {
    switch (status) {
      case "active":
        return (
          <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
            <CheckCircle className="w-3 h-3 mr-1" />
            Active
          </Badge>
        )
      case "expired":
        return (
          <Badge className="bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400">
            <AlertCircle className="w-3 h-3 mr-1" />
            Expired
          </Badge>
        )
      case "none":
        return (
          <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400">
            <Clock className="w-3 h-3 mr-1" />
            No Plan
          </Badge>
        )
    }
  }

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "admin":
        return (
          <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400">
            <Crown className="w-3 h-3 mr-1" />
            Admin
          </Badge>
        )
      case "manager":
        return (
          <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
            <Users className="w-3 h-3 mr-1" />
            Manager
          </Badge>
        )
      case "customer":
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">Customer</Badge>
      default:
        return <Badge variant="outline">{role}</Badge>
    }
  }

  const exportMembers = () => {
    const csvContent = [
      ["Name", "Email", "Role", "Region", "Membership Status", "Plan", "Expiry Date"].join(","),
      ...filteredMembers.map((member) =>
        [
          member.name,
          member.email,
          member.role,
          member.region,
          member.membershipStatus,
          member.membership?.plan || "None",
          member.membership?.expiry
            ? format(member.membership.expiry.toDate?.() || new Date(member.membership.expiry), "PPP")
            : "N/A",
        ].join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `members-${format(new Date(), "yyyy-MM-dd")}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
    toast.success("Members data exported successfully!")
  }

  const MemberDetailsDialog = ({ member }: { member: MemberData }) => (
    <DialogContent className="max-w-2xl">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-3">
          <Avatar className="h-12 w-12">
            <AvatarImage src={member.photoURL || "/placeholder.svg"} alt={member.name} />
            <AvatarFallback className="bg-primary/10 text-primary">
              {member.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-xl font-semibold">{member.name}</h3>
            <p className="text-muted-foreground">{member.email}</p>
          </div>
        </DialogTitle>
      </DialogHeader>

      <div className="space-y-6">
        {/* Basic Info */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Role</label>
            <div>{getRoleBadge(member.role)}</div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Region</label>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              <span>{member.region}</span>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Email</label>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-muted-foreground" />
              <span>{member.email}</span>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Joined</label>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span>
                {member.createdAt
                  ? format(member.createdAt.toDate?.() || new Date(member.createdAt), "PPP")
                  : "Unknown"}
              </span>
            </div>
          </div>
        </div>

        {/* Membership Info */}
        <div className="border-t pt-4">
          <h4 className="font-semibold mb-3">Membership Information</h4>
          {member.membership ? (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Status</label>
                <div>{getStatusBadge(member.membershipStatus)}</div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Plan</label>
                <span className="font-medium">{member.membership.plan}</span>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Expiry Date</label>
                <span>
                  {member.membership.expiry
                    ? format(member.membership.expiry.toDate?.() || new Date(member.membership.expiry), "PPP")
                    : "N/A"}
                </span>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Payment ID</label>
                <span className="font-mono text-sm">{member.membership.paymentId || "N/A"}</span>
              </div>
            </div>
          ) : (
            <div className="text-center py-4 text-muted-foreground">
              <AlertCircle className="mx-auto h-8 w-8 mb-2" />
              <p>No active membership found</p>
            </div>
          )}
        </div>
      </div>
    </DialogContent>
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Loading members data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Members Management</h1>
          <p className="text-muted-foreground">
            {user?.role === "admin" ? "Manage all members across regions" : `Manage members in ${user?.region}`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={exportMembers} variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
          <Button size="sm">
            <UserPlus className="w-4 h-4 mr-2" />
            Add Member
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Members</p>
                <p className="text-2xl font-bold">{filteredMembers.length}</p>
              </div>
              <Users className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Memberships</p>
                <p className="text-2xl font-bold text-green-600">
                  {filteredMembers.filter((m) => m.membershipStatus === "active").length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Expired</p>
                <p className="text-2xl font-bold text-red-600">
                  {filteredMembers.filter((m) => m.membershipStatus === "expired").length}
                </p>
              </div>
              <AlertCircle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">No Plan</p>
                <p className="text-2xl font-bold text-gray-600">
                  {filteredMembers.filter((m) => m.membershipStatus === "none").length}
                </p>
              </div>
              <Clock className="h-8 w-8 text-gray-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search members by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            {user?.role === "admin" && (
              <Select value={regionFilter} onValueChange={setRegionFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="All Regions" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Regions</SelectItem>
                  {regions.map((region) => (
                    <SelectItem key={region} value={region}>
                      {region}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                {statuses.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="All Roles" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                {roles.map((role) => (
                  <SelectItem key={role} value={role}>
                    {role.charAt(0).toUpperCase() + role.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Members Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Members ({filteredMembers.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredMembers.length === 0 ? (
            <div className="text-center py-10">
              <Users className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No members found</h3>
              <p className="text-muted-foreground">Try adjusting your search or filter criteria.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Member</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Region</TableHead>
                    <TableHead>Membership</TableHead>
                    <TableHead>Plan</TableHead>
                    <TableHead>Expiry</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMembers.map((member) => (
                    <TableRow key={member.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={member.photoURL || "/placeholder.svg"} alt={member.name} />
                            <AvatarFallback className="bg-primary/10 text-primary text-xs">
                              {member.name.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{member.name}</div>
                            <div className="text-sm text-muted-foreground">{member.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{getRoleBadge(member.role)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-muted-foreground" />
                          {member.region}
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(member.membershipStatus)}</TableCell>
                      <TableCell>{member.membership?.plan || "None"}</TableCell>
                      <TableCell>
                        {member.membership?.expiry
                          ? format(
                              member.membership.expiry.toDate?.() || new Date(member.membership.expiry),
                              "MMM dd, yyyy",
                            )
                          : "N/A"}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <Dialog>
                              <DialogTrigger asChild>
                                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                  <Eye className="w-4 h-4 mr-2" />
                                  View Details
                                </DropdownMenuItem>
                              </DialogTrigger>
                              <MemberDetailsDialog member={member} />
                            </Dialog>
                            <DropdownMenuItem>
                              <Edit className="w-4 h-4 mr-2" />
                              Edit Member
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete Member
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default Members
  
"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/useAuth"
import { db } from "@/firebase"
import { doc, getDoc, updateDoc } from "firebase/firestore"
import axios from "axios"
import { toast } from "sonner"

interface FormData {
  name: string
  phone?: string
  region: string
  profileUrl?: string
  file?: FileList
}

const ProfileUpdate = () => {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<FormData>()

  const profileUrl = watch("profileUrl")

  useEffect(() => {
    const loadUserData = async () => {
      if (!user?.id) return
      const snap = await getDoc(doc(db, "users", user.id))
      if (snap.exists()) {
        const data = snap.data()
        setValue("name", data.name || "")
        setValue("phone", data.phone || "")
        setValue("region", data.region || "")
        setValue("profileUrl", data.profileUrl || "")
      }
    }
    loadUserData()
  }, [user, setValue])

  const uploadToCloudinary = async (file: File) => {
    const formData = new FormData()
    formData.append("file", file)
    formData.append("upload_preset", "unsigned_profiles")
    formData.append("folder", "profiles")

    const res = await axios.post("https://api.cloudinary.com/v1_1/dtejkrcj0/image/upload", formData)
    return res.data.secure_url as string
  }

  const onSubmit = async (data: FormData) => {
    if (!user?.id) return
    setLoading(true)
    try {
      let imageUrl = data.profileUrl || ""
      if (data.file && data.file.length > 0) {
        imageUrl = await uploadToCloudinary(data.file[0])
      }

      await updateDoc(doc(db, "users", user.id), {
        name: data.name,
        phone: data.phone || "",
        profileUrl: imageUrl
      })

      toast.success("Profile updated successfully")
    } catch (err) {
      console.error("Profile update failed", err)
      toast.error("Update failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-xl mx-auto py-10">
      <h1 className="text-2xl font-semibold mb-6">Update Profile</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

        {/* Email (read-only) */}
        <div>
          <label className="block mb-1 font-medium">Email</label>
          <Input value={user?.email || ""} readOnly disabled className="bg-gray-100 dark:bg-gray-800" />
        </div>

        {/* Name */}
        <div>
          <label className="block mb-1 font-medium">Name</label>
          <Input {...register("name", { required: true })} />
          {errors.name && <p className="text-sm text-red-500">Name is required</p>}
        </div>

        {/* Phone */}
        <div>
          <label className="block mb-1 font-medium">Phone</label>
          <Input type="tel" {...register("phone")} />
        </div>

        {/* Region (read-only) */}
        <div>
          <label className="block mb-1 font-medium">Region</label>
          <Input {...register("region")} disabled className="bg-gray-100 dark:bg-gray-800" />
        </div>

        {/* Profile Picture Upload */}
        <div>
          <label className="block mb-1 font-medium">Profile Picture</label>
          {profileUrl && <img src={profileUrl} alt="Profile" className="w-20 h-20 rounded-full mb-2" />}
          <Input type="file" accept="image/*" {...register("file")} />
        </div>

        {/* Submit */}
        <Button type="submit" disabled={loading}>
          {loading ? "Updating..." : "Update Profile"}
        </Button>
      </form>
    </div>
  )
}

export default ProfileUpdate
  
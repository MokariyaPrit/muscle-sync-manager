"use client"

import type React from "react"
import { useState } from "react"
import { createUserWithEmailAndPassword } from "firebase/auth"
import { auth, db } from "@/firebase"
import { doc, setDoc } from "firebase/firestore"
import { Link, useNavigate } from "react-router-dom"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Dumbbell, User, Mail, Lock, MapPin, Shield, Eye, EyeOff, ArrowRight, Loader2, CheckCircle } from "lucide-react"
import { toast } from "sonner"

const Signup = () => {
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    password: "",
    confirmPassword: "",
    role: "customer",
    region: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [step, setStep] = useState(1)
  const navigate = useNavigate()

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setError("")
  }

  const validateStep1 = () => {
    if (!formData.name.trim()) return "Name is required"
    if (!formData.email.trim()) return "Email is required"
    if (!/\S+@\S+\.\S+/.test(formData.email)) return "Please enter a valid email"
    return null
  }

  const validateStep2 = () => {
    if (formData.password.length < 6) return "Password must be at least 6 characters"
    if (formData.password !== formData.confirmPassword) return "Passwords do not match"
    return null
  }

  const validateStep3 = () => {
    if (!formData.role) return "Please select a role"
    if (!formData.region) return "Please select a region"
    return null
  }

  const handleNext = () => {
    let validationError = null
    if (step === 1) validationError = validateStep1()
    if (step === 2) validationError = validateStep2()

    if (validationError) {
      setError(validationError)
      return
    }

    setError("")
    setStep(step + 1)
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()

    const validationError = validateStep3()
    if (validationError) {
      setError(validationError)
      return
    }

    try {
      setLoading(true)
      setError("")

      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password)
      const user = userCredential.user

      const normalizedRole = formData.role.toLowerCase()
      const normalizedRegion = formData.region.toLowerCase()

      await setDoc(doc(db, "users", user.uid), {
        email: formData.email,
        name: formData.name,
        role: "customer",
        region: normalizedRegion,
        createdAt: new Date().toISOString(),
      })

      localStorage.setItem(
        "gym_user",
        JSON.stringify({
          id: user.uid,
          email: formData.email,
          name: formData.name,
          role: normalizedRole,
          region: normalizedRegion,
        }),
      )

      toast.success("Account created successfully! Redirecting to login...")
      setTimeout(() => navigate("/login"), 1500)
    } catch (err: any) {
      console.error(err)
      setError(err.message || "Signup failed. Please try again.")
      toast.error("Signup failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const progressValue = (step / 3) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-muted/40 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <Link to="/" className="inline-flex items-center space-x-3 mb-6 group">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
              <Dumbbell className="h-7 w-7 text-primary" />
            </div>
            <span className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              FitZone Pro
            </span>
          </Link>
          <h1 className="text-3xl font-bold text-foreground mb-2">Join FitZone Pro</h1>
          <p className="text-muted-foreground">Create your account to start your fitness journey</p>
        </div>

        {/* Signup Card */}
        <Card className="backdrop-blur-sm bg-card/95 border shadow-xl animate-scale-in">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-2xl font-bold text-center text-foreground">Create Account</CardTitle>
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Step {step} of 3</span>
                <span>{Math.round(progressValue)}% Complete</span>
              </div>
              <Progress value={progressValue} className="h-2" />
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={step === 3 ? handleSignup : (e) => e.preventDefault()} className="space-y-6">
              {error && (
                <Alert className="border-destructive/50 text-destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Step 1: Basic Information */}
              {step === 1 && (
                <div className="space-y-4 animate-fade-in">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium">
                      Full Name
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="name"
                        type="text"
                        value={formData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        className="pl-10 h-12 bg-background/50 border-border focus:border-primary transition-colors"
                        placeholder="Enter your full name"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium">
                      Email Address
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        className="pl-10 h-12 bg-background/50 border-border focus:border-primary transition-colors"
                        placeholder="Enter your email"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Password */}
              {step === 2 && (
                <div className="space-y-4 animate-fade-in">
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-medium">
                      Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={(e) => handleInputChange("password", e.target.value)}
                        className="pl-10 pr-10 h-12 bg-background/50 border-border focus:border-primary transition-colors"
                        placeholder="Create a password"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-12 px-3 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-sm font-medium">
                      Confirm Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        value={formData.confirmPassword}
                        onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                        className="pl-10 pr-10 h-12 bg-background/50 border-border focus:border-primary transition-colors"
                        placeholder="Confirm your password"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-12 px-3 hover:bg-transparent"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Role and Region */}
              {step === 3 && (
                <div className="space-y-4 animate-fade-in">
                  {/* <div className="space-y-2">
                    <Label className="text-sm font-medium">Role</Label>
                    <Select value={formData.role} onValueChange={(value) => handleInputChange("role", value)}>
                      <SelectTrigger className="h-12 bg-background/50 border-border focus:border-primary">
                        <div className="flex items-center">
                          <Shield className="mr-2 h-4 w-4 text-muted-foreground" />
                          <SelectValue placeholder="Select your role" />
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">
                          <div className="flex items-center">
                            <Shield className="mr-2 h-4 w-4" />
                            Admin
                          </div>
                        </SelectItem>
                        <SelectItem value="manager">
                          <div className="flex items-center">
                            <User className="mr-2 h-4 w-4" />
                            Manager
                          </div>
                        </SelectItem>
                        <SelectItem value="customer">
                          <div className="flex items-center">
                            <Dumbbell className="mr-2 h-4 w-4" />
                            Customer
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div> */}
{/* 
<div className="space-y-2">
  <Label className="text-sm font-medium">Role</Label>
  <Input value="Customer" readOnly className="bg-muted cursor-not-allowed" />
</div> */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Region</Label>
                    <Select value={formData.region} onValueChange={(value) => handleInputChange("region", value)}>
                      <SelectTrigger className="h-12 bg-background/50 border-border focus:border-primary">
                        <div className="flex items-center">
                          <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                          <SelectValue placeholder="Select your region" />
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Gujarat">Gujarat</SelectItem>
                        <SelectItem value="Maharashtra">Maharashtra</SelectItem>
                        <SelectItem value="Madhya Pradesh">Madhya Pradesh</SelectItem>
                        <SelectItem value="Rajasthan">Rajasthan</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3">
                {step > 1 && (
                  <Button type="button" variant="outline" onClick={() => setStep(step - 1)} className="flex-1 h-12">
                    Back
                  </Button>
                )}
                {step < 3 ? (
                  <Button
                    type="button"
                    onClick={handleNext}
                    className="flex-1 h-12 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
                  >
                    Next
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={loading}
                    className="flex-1 h-12 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating Account...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Create Account
                      </>
                    )}
                  </Button>
                )}
              </div>
            </form>

            {/* Footer */}
            <div className="mt-8 text-center">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">Already have an account?</span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-4">
                <Link
                  to="/login"
                  className="font-medium text-primary hover:text-primary/80 transition-colors underline-offset-4 hover:underline"
                >
                  Sign in instead
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Signup
  
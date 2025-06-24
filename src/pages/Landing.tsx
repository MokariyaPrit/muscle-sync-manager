"use client"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dumbbell,
  Users,
  Calendar,
  Trophy,
  ArrowRight,
  Star,
  CheckCircle,
  Zap,
  Target,
  Heart,
  Shield,
  Clock,
  Award,
  TrendingUp,
  Play,
} from "lucide-react"

const Landing = () => {
  const features = [
    {
      icon: <Users className="w-8 h-8" />,
      title: "Expert Trainers",
      description: "Certified professionals with years of experience to guide your fitness transformation",
      color: "from-blue-500 to-blue-600",
    },
    {
      icon: <Calendar className="w-8 h-8" />,
      title: "Flexible Scheduling",
      description: "24/7 access with smart booking system that adapts to your busy lifestyle",
      color: "from-purple-500 to-purple-600",
    },
    {
      icon: <Trophy className="w-8 h-8" />,
      title: "Proven Results",
      description: "95% of our members achieve their fitness goals within the first 6 months",
      color: "from-green-500 to-green-600",
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Smart Equipment",
      description: "State-of-the-art IoT-enabled equipment that tracks your progress automatically",
      color: "from-yellow-500 to-yellow-600",
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Wellness Focus",
      description: "Holistic approach combining fitness, nutrition, and mental wellness programs",
      color: "from-red-500 to-red-600",
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Safe Environment",
      description: "Sanitized equipment, safety protocols, and emergency medical support available",
      color: "from-indigo-500 to-indigo-600",
    },
  ]

  const stats = [
    { number: "10K+", label: "Active Members", icon: <Users className="w-5 h-5" /> },
    { number: "50+", label: "Expert Trainers", icon: <Award className="w-5 h-5" /> },
    { number: "24/7", label: "Access Hours", icon: <Clock className="w-5 h-5" /> },
    { number: "95%", label: "Success Rate", icon: <TrendingUp className="w-5 h-5" /> },
  ]

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Marketing Executive",
      content: "FitZone Pro transformed my life! Lost 30 pounds and gained incredible confidence.",
      rating: 5,
      image: "/placeholder.svg?height=60&width=60",
    },
    {
      name: "Mike Chen",
      role: "Software Engineer",
      content: "The smart equipment and flexible scheduling fit perfectly with my tech lifestyle.",
      rating: 5,
      image: "/placeholder.svg?height=60&width=60",
    },
    {
      name: "Emily Rodriguez",
      role: "Teacher",
      content: "Amazing community and trainers. Best investment I've made for my health!",
      rating: 5,
      image: "/placeholder.svg?height=60&width=60",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-muted/40">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-background/80 border-b border-border">
        <nav className="flex items-center justify-between max-w-7xl mx-auto px-6 py-4">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
              <Dumbbell className="h-6 w-6 text-primary" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              FitZone Pro
            </span>
          </Link>
          <div className="flex items-center space-x-4">
            <Link to="/register">
              <Button variant="outline" className="hidden sm:inline-flex">
                Sign Up
              </Button>
            </Link>
            <Link to="/login">
              <Button className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70">
                Login
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="px-6 py-20 lg:py-32">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 animate-fade-in">
              <div className="space-y-4">
                <Badge className="bg-primary/10 text-primary border-primary/20">
                  <Star className="w-3 h-3 mr-1" />
                  #1 Rated Fitness Platform
                </Badge>
                <h1 className="text-5xl lg:text-7xl font-bold text-foreground leading-tight">
                  Transform Your
                  <span className="block bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
                    Fitness Journey
                  </span>
                </h1>
                <p className="text-xl text-muted-foreground max-w-2xl leading-relaxed">
                  Join thousands of members who've achieved their fitness goals with our cutting-edge facilities, expert
                  guidance, and supportive community. Your transformation starts here.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/register">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    Start Your Journey
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Button size="lg" variant="outline" className="group">
                  <Play className="mr-2 w-5 h-5 group-hover:scale-110 transition-transform" />
                  Watch Demo
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-8">
                {stats.map((stat, index) => (
                  <div
                    key={stat.label}
                    className="text-center space-y-2 animate-fade-in"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-center justify-center text-primary mb-1">{stat.icon}</div>
                    <div className="text-2xl font-bold text-foreground">{stat.number}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative animate-scale-in" style={{ animationDelay: "0.2s" }}>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/10 rounded-3xl blur-3xl"></div>
                <Card className="relative bg-card/50 backdrop-blur-sm border-border shadow-2xl">
                  <CardContent className="p-8">
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold">Today's Workout</h3>
                        <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Active
                        </Badge>
                      </div>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                              <Target className="w-4 h-4 text-primary" />
                            </div>
                            <span className="font-medium">Strength Training</span>
                          </div>
                          <span className="text-sm text-muted-foreground">45 min</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                              <Heart className="w-4 h-4 text-primary" />
                            </div>
                            <span className="font-medium">Cardio Blast</span>
                          </div>
                          <span className="text-sm text-muted-foreground">30 min</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                              <Zap className="w-4 h-4 text-primary" />
                            </div>
                            <span className="font-medium">Cool Down</span>
                          </div>
                          <span className="text-sm text-muted-foreground">15 min</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <Badge className="bg-primary/10 text-primary border-primary/20">Features</Badge>
            <h2 className="text-4xl lg:text-5xl font-bold text-foreground">Why Choose FitZone Pro?</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Experience the future of fitness with our comprehensive platform designed for your success
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card
                key={feature.title}
                className="group hover:shadow-xl transition-all duration-300 border-border bg-card/50 backdrop-blur-sm animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-6 space-y-4">
                  <div
                    className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.color} flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300`}
                  >
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <Badge className="bg-primary/10 text-primary border-primary/20">Testimonials</Badge>
            <h2 className="text-4xl lg:text-5xl font-bold text-foreground">What Our Members Say</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Real stories from real people who transformed their lives with FitZone Pro
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card
                key={testimonial.name}
                className="bg-card/50 backdrop-blur-sm border-border hover:shadow-lg transition-all duration-300 animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-6 space-y-4">
                  <div className="flex space-x-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-muted-foreground italic">"{testimonial.content}"</p>
                  <div className="flex items-center space-x-3">
                    <img
                      src={testimonial.image || "/placeholder.svg"}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <div className="font-semibold text-foreground">{testimonial.name}</div>
                      <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-20 bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-4xl lg:text-5xl font-bold text-foreground">Ready to Start Your Transformation?</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Join thousands of members who've already transformed their lives. Your fitness journey begins with a single
            step.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button
                size="lg"
                className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-200"
              >
                Get Started Today
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline">
                I'm Already a Member
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-12 bg-muted/50 border-t border-border">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                  <Dumbbell className="h-5 w-5 text-primary" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  FitZone Pro
                </span>
              </div>
              <p className="text-muted-foreground">Transforming lives through fitness, one member at a time.</p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-4">Quick Links</h3>
              <div className="space-y-2 text-muted-foreground">
                <div>About Us</div>
                <div>Classes</div>
                <div>Trainers</div>
                <div>Membership</div>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-4">Support</h3>
              <div className="space-y-2 text-muted-foreground">
                <div>Help Center</div>
                <div>Contact Us</div>
                <div>Privacy Policy</div>
                <div>Terms of Service</div>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-4">Connect</h3>
              <div className="space-y-2 text-muted-foreground">
                <div>Facebook</div>
                <div>Instagram</div>
                <div>Twitter</div>
                <div>YouTube</div>
              </div>
            </div>
          </div>
          <div className="border-t border-border pt-8 text-center text-muted-foreground">
            <p>&copy; 2024 FitZone Pro. All rights reserved. Built with ❤️ for fitness enthusiasts.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Landing
  
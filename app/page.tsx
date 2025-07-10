import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Calendar,
  Users,
  Shield,
  Smartphone,
  CheckCircle,
  ArrowRight,
  Coffee,
  Zap,
  Heart,
  Star,
  ChefHat,
  Timer,
  Bell,
  TrendingUp,
} from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
      {/* Floating Header */}
      <header className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-white/90 backdrop-blur-xl rounded-full border border-orange-200 shadow-lg px-6 py-3">
        <div className="flex items-center justify-between min-w-[600px]">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center shadow-lg">
              <Coffee className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              ShiftFlow
            </span>
          </div>
          <nav className="flex items-center space-x-6">
            <Link href="#magic" className="text-gray-700 hover:text-orange-600 transition-colors font-medium">
              See the Magic
            </Link>
            <Link href="#pricing" className="text-gray-700 hover:text-orange-600 transition-colors font-medium">
              Pricing
            </Link>
            <Button
              size="sm"
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 rounded-full px-6"
            >
              <Link href="/auth/signup">Try Free</Link>
            </Button>
          </nav>
        </div>
      </header>

      {/* Hero Section - Coffee Shop Inspired */}
      <section className="pt-32 pb-20 px-4 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-orange-200/30 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-red-200/30 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-amber-100/20 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto text-center max-w-6xl relative z-10">
          {/* Animated Badge */}
          <div className="inline-flex items-center bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 mb-8 border border-orange-200 shadow-lg">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <ChefHat className="w-4 h-4 text-orange-600" />
              <span className="text-sm font-medium text-gray-700">Trusted by 500+ restaurants</span>
            </div>
          </div>

          {/* Main Headline */}
          <h1 className="text-6xl md:text-8xl font-black text-gray-900 mb-8 leading-none">
            <span className="block">Stop the</span>
            <span className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 bg-clip-text text-transparent block">
              Scheduling
            </span>
            <span className="block">Chaos</span>
          </h1>

          {/* Subheadline */}
          <p className="text-2xl md:text-3xl text-gray-600 mb-12 font-light max-w-4xl mx-auto leading-relaxed">
            Your coffee shop deserves better than sticky notes and group chats.
            <span className="text-orange-600 font-medium"> ShiftFlow turns scheduling madness into pure magic.</span>
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
            <Button
              size="lg"
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white text-xl px-12 py-8 rounded-2xl shadow-2xl hover:shadow-orange-500/25 transition-all duration-300 transform hover:scale-105"
            >
              <Link href="/auth/signup" className="flex items-center">
                <Zap className="mr-3 w-6 h-6" />
                Start Your Magic Trial
                <ArrowRight className="ml-3 w-6 h-6" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-xl px-12 py-8 rounded-2xl border-2 border-orange-300 hover:bg-orange-50 transition-all duration-300 bg-transparent"
            >
              <Link href="#demo" className="flex items-center text-orange-700">
                <Heart className="mr-3 w-6 h-6" />
                See It In Action
              </Link>
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center items-center gap-8 text-gray-500">
            <div className="flex items-center space-x-2">
              <Star className="w-5 h-5 text-yellow-500 fill-current" />
              <span className="font-medium">4.9/5 rating</span>
            </div>
            <div className="flex items-center space-x-2">
              <Timer className="w-5 h-5 text-green-500" />
              <span className="font-medium">2-minute setup</span>
            </div>
            <div className="flex items-center space-x-2">
              <Shield className="w-5 h-5 text-blue-500" />
              <span className="font-medium">Bank-level security</span>
            </div>
          </div>
        </div>
      </section>

      {/* The Magic Section */}
      <section id="magic" className="py-20 px-4 bg-white relative">
        <div className="container mx-auto">
          <div className="text-center mb-20">
            <Badge variant="secondary" className="mb-4 bg-orange-100 text-orange-700 px-4 py-2">
              <Zap className="w-4 h-4 mr-2" />
              The Magic Happens Here
            </Badge>
            <h2 className="text-5xl md:text-6xl font-black text-gray-900 mb-6">
              From Chaos to
              <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent block">
                Coffee Shop Zen
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Watch your scheduling nightmares transform into smooth operations that your team actually loves
            </p>
          </div>

          {/* Feature Cards - Unique Layout */}
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
            {/* Left Side - Main Feature */}
            <div className="relative">
              <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-3xl p-8 text-white shadow-2xl transform rotate-2 hover:rotate-0 transition-transform duration-300">
                <div className="bg-white/20 rounded-2xl p-6 backdrop-blur-sm">
                  <Calendar className="w-12 h-12 mb-4" />
                  <h3 className="text-3xl font-bold mb-4">Drag, Drop, Done!</h3>
                  <p className="text-lg opacity-90 mb-6">
                    Create perfect schedules in seconds. Our smart calendar knows your team's preferences, availability,
                    and even suggests optimal shift patterns.
                  </p>
                  <div className="flex items-center space-x-4">
                    <div className="flex -space-x-2">
                      <div className="w-8 h-8 bg-white rounded-full border-2 border-orange-300"></div>
                      <div className="w-8 h-8 bg-orange-200 rounded-full border-2 border-orange-300"></div>
                      <div className="w-8 h-8 bg-orange-100 rounded-full border-2 border-orange-300"></div>
                    </div>
                    <span className="text-sm font-medium">+247 happy managers</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Feature Grid */}
            <div className="grid grid-cols-2 gap-6">
              <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 bg-gradient-to-br from-blue-50 to-blue-100">
                <CardHeader className="pb-4">
                  <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mb-3">
                    <Bell className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-lg">Smart Alerts</CardTitle>
                  <CardDescription className="text-sm">
                    No more "Did you see my text?" Your team gets notified instantly.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 bg-gradient-to-br from-green-50 to-green-100">
                <CardHeader className="pb-4">
                  <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center mb-3">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-lg">Team Harmony</CardTitle>
                  <CardDescription className="text-sm">
                    Everyone sees what they need. No more, no less. Perfect balance.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 bg-gradient-to-br from-purple-50 to-purple-100">
                <CardHeader className="pb-4">
                  <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center mb-3">
                    <Smartphone className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-lg">Mobile Magic</CardTitle>
                  <CardDescription className="text-sm">
                    Works perfectly on phones. Your baristas will love it.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 bg-gradient-to-br from-orange-50 to-orange-100">
                <CardHeader className="pb-4">
                  <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center mb-3">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-lg">Smart Insights</CardTitle>
                  <CardDescription className="text-sm">
                    See patterns, optimize costs, make data-driven decisions.
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section - Unique Design */}
      <section
        id="pricing"
        className="py-20 px-4 bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white relative overflow-hidden"
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[length:50px_50px]"></div>
        </div>

        <div className="container mx-auto relative z-10">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4 bg-white/10 text-white border-white/20">
              <Coffee className="w-4 h-4 mr-2" />
              Pricing That Makes Sense
            </Badge>
            <h2 className="text-5xl md:text-6xl font-black mb-6">
              Start Free,
              <span className="bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent block">
                Scale Smart
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              No surprises, no hidden fees. Just honest pricing for honest businesses.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Free Trial */}
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-300">
              <CardHeader className="text-center pb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl text-white">Try It Free</CardTitle>
                <CardDescription className="text-gray-300">Perfect for testing the waters</CardDescription>
                <div className="text-4xl font-black text-white mt-4">
                  $0
                  <span className="text-lg font-normal text-gray-400">/14 days</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center text-gray-300">
                    <CheckCircle className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                    Up to 10 team members
                  </li>
                  <li className="flex items-center text-gray-300">
                    <CheckCircle className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                    All core scheduling features
                  </li>
                  <li className="flex items-center text-gray-300">
                    <CheckCircle className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                    Mobile app access
                  </li>
                  <li className="flex items-center text-gray-300">
                    <CheckCircle className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                    Email support
                  </li>
                </ul>
                <Button className="w-full bg-white/10 hover:bg-white/20 border border-white/20 text-white">
                  Start Free Trial
                </Button>
              </CardContent>
            </Card>

            {/* Pro Plan - Featured */}
            <Card className="bg-gradient-to-br from-orange-500 to-red-500 border-0 shadow-2xl scale-105 relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-yellow-400 text-black px-4 py-1 text-sm font-bold">
                MOST POPULAR
              </div>
              <CardHeader className="text-center pb-8">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                  <Coffee className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl text-white">Coffee Shop Pro</CardTitle>
                <CardDescription className="text-orange-100">Everything you need to thrive</CardDescription>
                <div className="text-4xl font-black text-white mt-4">
                  $29
                  <span className="text-lg font-normal text-orange-100">/month</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center text-white">
                    <CheckCircle className="w-5 h-5 text-yellow-300 mr-3 flex-shrink-0" />
                    Up to 50 team members
                  </li>
                  <li className="flex items-center text-white">
                    <CheckCircle className="w-5 h-5 text-yellow-300 mr-3 flex-shrink-0" />
                    Advanced scheduling & automation
                  </li>
                  <li className="flex items-center text-white">
                    <CheckCircle className="w-5 h-5 text-yellow-300 mr-3 flex-shrink-0" />
                    Real-time notifications
                  </li>
                  <li className="flex items-center text-white">
                    <CheckCircle className="w-5 h-5 text-yellow-300 mr-3 flex-shrink-0" />
                    Analytics & insights
                  </li>
                  <li className="flex items-center text-white">
                    <CheckCircle className="w-5 h-5 text-yellow-300 mr-3 flex-shrink-0" />
                    Priority support
                  </li>
                </ul>
                <Button className="w-full bg-white text-orange-600 hover:bg-orange-50 font-bold">
                  Start Free Trial
                </Button>
              </CardContent>
            </Card>

            {/* Enterprise */}
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-300">
              <CardHeader className="text-center pb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <ChefHat className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl text-white">Restaurant Chain</CardTitle>
                <CardDescription className="text-gray-300">For multi-location operations</CardDescription>
                <div className="text-4xl font-black text-white mt-4">
                  Custom
                  <span className="text-lg font-normal text-gray-400">/month</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center text-gray-300">
                    <CheckCircle className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                    Unlimited team members
                  </li>
                  <li className="flex items-center text-gray-300">
                    <CheckCircle className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                    Multi-location management
                  </li>
                  <li className="flex items-center text-gray-300">
                    <CheckCircle className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                    Custom integrations
                  </li>
                  <li className="flex items-center text-gray-300">
                    <CheckCircle className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                    Dedicated account manager
                  </li>
                </ul>
                <Button className="w-full bg-white/10 hover:bg-white/20 border border-white/20 text-white">
                  Let's Talk
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Final CTA - Coffee Shop Vibe */}
      <section className="py-20 px-4 bg-gradient-to-r from-amber-100 via-orange-100 to-red-100 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-32 h-32 bg-orange-300/30 rounded-full blur-2xl"></div>
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-red-300/30 rounded-full blur-2xl"></div>
        </div>

        <div className="container mx-auto text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-5xl md:text-6xl font-black text-gray-900 mb-6">
              Ready to End the
              <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent block">
                Scheduling Madness?
              </span>
            </h2>
            <p className="text-2xl text-gray-700 mb-12 font-light">
              Join 500+ coffee shops and restaurants who've already discovered the magic
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button
                size="lg"
                className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white text-xl px-12 py-8 rounded-2xl shadow-2xl hover:shadow-orange-500/25 transition-all duration-300 transform hover:scale-105"
              >
                <Link href="/auth/signup" className="flex items-center">
                  <Coffee className="mr-3 w-6 h-6" />
                  Start Your Magic Trial
                  <ArrowRight className="ml-3 w-6 h-6" />
                </Link>
              </Button>
            </div>

            <p className="text-gray-600 mt-6">
              ✨ No credit card required • ⚡ 2-minute setup • 🎯 14 days of pure magic
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-12">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center">
                  <Coffee className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                  ShiftFlow
                </span>
              </div>
              <p className="text-gray-400 text-lg leading-relaxed max-w-md">
                Transforming scheduling chaos into coffee shop zen, one shift at a time.
              </p>
              <div className="flex items-center space-x-4 mt-6">
                <div className="flex items-center space-x-2 text-sm text-gray-400">
                  <Heart className="w-4 h-4 text-red-400" />
                  <span>Made with love for coffee shops</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-bold mb-6 text-lg">Product</h3>
              <ul className="space-y-3 text-gray-400">
                <li>
                  <Link href="#magic" className="hover:text-orange-400 transition-colors">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#pricing" className="hover:text-orange-400 transition-colors">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="/demo" className="hover:text-orange-400 transition-colors">
                    Demo
                  </Link>
                </li>
                <li>
                  <Link href="/integrations" className="hover:text-orange-400 transition-colors">
                    Integrations
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold mb-6 text-lg">Support</h3>
              <ul className="space-y-3 text-gray-400">
                <li>
                  <Link href="/help" className="hover:text-orange-400 transition-colors">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-orange-400 transition-colors">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="/community" className="hover:text-orange-400 transition-colors">
                    Community
                  </Link>
                </li>
                <li>
                  <Link href="/status" className="hover:text-orange-400 transition-colors">
                    Status
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400">&copy; 2025 ShiftFlow. Crafted with ☕ and lots of love.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="/privacy" className="text-gray-400 hover:text-orange-400 transition-colors">
                Privacy
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-orange-400 transition-colors">
                Terms
              </Link>
              <Link href="/cookies" className="text-gray-400 hover:text-orange-400 transition-colors">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

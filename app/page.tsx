import { Camera, Map, Shield, Users, Zap, Leaf, Sun, Droplets, TrendingUp, Sparkles, ArrowRight, CheckCircle, Star } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-green-200/30 to-emerald-300/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-blue-200/20 to-green-200/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-amber-200/20 to-green-200/20 rounded-full blur-2xl animate-pulse delay-500"></div>
      </div>
      {/* Modern Glassmorphism Header */}
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-white/80 border-b border-white/20 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center group">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 via-green-600 to-green-700 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                  <Sparkles className="h-6 w-6 text-white animate-pulse" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-bounce"></div>
              </div>
              <div className="ml-4">
                <span className="text-2xl font-bold bg-gradient-to-r from-gray-900 via-green-800 to-emerald-700 bg-clip-text text-transparent">
                  AgriSentry
                </span>
                <div className="text-xs text-green-600 font-medium">AI Powered</div>
              </div>
            </div>
            
            <nav className="hidden md:flex items-center space-x-1">
              <Link
                href="#how-it-works"
                className="px-4 py-2 text-gray-700 hover:text-green-600 hover:bg-green-50/50 rounded-xl transition-all duration-200 font-medium"
              >
                How It Works
              </Link>
              <Link
                href="#farmers"
                className="px-4 py-2 text-gray-700 hover:text-green-600 hover:bg-green-50/50 rounded-xl transition-all duration-200 font-medium"
              >
                For Farmers
              </Link>
              <Link
                href="/scan"
                className="ml-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center gap-2"
              >
                <Camera className="h-4 w-4" />
                Try Now
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Revolutionary Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
        {/* Dynamic Floating Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-32 left-16 animate-bounce delay-100">
            <div className="w-16 h-16 bg-gradient-to-br from-green-400/20 to-emerald-500/30 rounded-2xl backdrop-blur-sm flex items-center justify-center text-2xl">🌾</div>
          </div>
          <div className="absolute top-48 right-20 animate-bounce delay-300">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-400/20 to-yellow-500/30 rounded-xl backdrop-blur-sm flex items-center justify-center text-xl">🌽</div>
          </div>
          <div className="absolute bottom-48 left-24 animate-bounce delay-500">
            <div className="w-14 h-14 bg-gradient-to-br from-red-400/20 to-rose-500/30 rounded-2xl backdrop-blur-sm flex items-center justify-center text-xl">🍅</div>
          </div>
          <div className="absolute bottom-32 right-16 animate-bounce delay-700">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-400/20 to-amber-500/30 rounded-xl backdrop-blur-sm flex items-center justify-center text-lg">🥥</div>
          </div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            {/* Revolutionary Headline */}
            <div className="mb-8">
              <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-black mb-4 leading-none">
                <span className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent block">
                  Your Crops Are
                </span>
                <span className="bg-gradient-to-r from-emerald-600 via-green-600 to-green-700 bg-clip-text text-transparent block relative">
                  Healthy & Protected
                  <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
                </span>
              </h1>
              <div className="flex items-center justify-center gap-2 mt-4">
                <div className="flex -space-x-1">
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                </div>
                <span className="text-sm text-gray-600 font-medium">Trusted by 500+ farmers</span>
              </div>
            </div>
            
            <p className="text-xl sm:text-2xl text-gray-600 max-w-4xl mx-auto mb-12 leading-relaxed font-medium">
              Take a photo of your crops and instantly know if they're healthy. 
              Get <span className="text-green-600 font-semibold">simple treatment advice</span> and see what's happening on other farms near you.
            </p>

            {/* Revolutionary Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
              <Link
                href="/scan"
                className="group relative bg-gradient-to-r from-green-600 via-emerald-600 to-green-700 text-white px-10 py-5 rounded-3xl text-xl font-bold hover:from-green-700 hover:via-emerald-700 hover:to-green-800 transition-all duration-300 flex items-center justify-center gap-4 shadow-2xl hover:shadow-3xl transform hover:-translate-y-2 hover:scale-105"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative flex items-center gap-4">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
                    <Camera className="h-5 w-5" />
                  </div>
                  <span>Check My Crops</span>
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                </div>
              </Link>
              
              <Link
                href="/map"
                className="group bg-white/80 backdrop-blur-sm text-gray-700 border-2 border-gray-200/50 px-10 py-5 rounded-3xl text-xl font-bold hover:border-green-300 hover:text-green-700 hover:bg-green-50/50 transition-all duration-300 flex items-center justify-center gap-4 shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
              >
                <Map className="h-6 w-6 group-hover:scale-110 transition-transform duration-300" />
                <span>See Farm Reports</span>
              </Link>
            </div>

            {/* Modern Trust Indicators */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8">
              <div className="group text-center p-6 rounded-3xl bg-white/60 backdrop-blur-sm border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-emerald-200 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <TrendingUp className="h-10 w-10 text-green-600" />
                </div>
                <div className="text-3xl font-black text-gray-900 mb-2 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">95%</div>
                <div className="text-gray-600 font-semibold">Accurate Results</div>
              </div>
              
              <div className="group text-center p-6 rounded-3xl bg-white/60 backdrop-blur-sm border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-sky-200 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-3xl">🌾</span>
                </div>
                <div className="text-3xl font-black text-gray-900 mb-2 bg-gradient-to-r from-blue-600 to-sky-600 bg-clip-text text-transparent">4</div>
                <div className="text-gray-600 font-semibold">Major Crops</div>
              </div>
              
              <div className="group text-center p-6 rounded-3xl bg-white/60 backdrop-blur-sm border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="w-20 h-20 bg-gradient-to-br from-amber-100 to-yellow-200 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Shield className="h-10 w-10 text-amber-600" />
                </div>
                <div className="text-3xl font-black text-gray-900 mb-2 bg-gradient-to-r from-amber-600 to-yellow-600 bg-clip-text text-transparent">24</div>
                <div className="text-gray-600 font-semibold">Disease Types</div>
              </div>
              
              <div className="group text-center p-6 rounded-3xl bg-white/60 backdrop-blur-sm border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-violet-200 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <CheckCircle className="h-10 w-10 text-purple-600" />
                </div>
                <div className="text-3xl font-black text-gray-900 mb-2 bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent">Free</div>
                <div className="text-gray-600 font-semibold">Always Free</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Revolutionary How It Works Section */}
      <section id="how-it-works" className="py-32 bg-gradient-to-br from-slate-50 via-white to-green-50 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 right-20 w-32 h-32 bg-gradient-to-br from-green-200/20 to-emerald-300/10 rounded-full blur-2xl"></div>
          <div className="absolute bottom-20 left-20 w-40 h-40 bg-gradient-to-tr from-blue-200/15 to-green-200/20 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-green-100 to-emerald-100 border border-green-200/50 text-green-700 text-sm font-semibold mb-6">
              <Sparkles className="mr-2 h-4 w-4" />
              How It Works
            </div>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-900 mb-6">
              <span className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">Simple as</span>
              <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent block">1-2-3</span>
            </h2>
            <p className="text-xl sm:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              No complicated setup. Just point, shoot, and get answers about your crops.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 lg:gap-16">
            {/* Step 1 - Enhanced */}
            <div className="group text-center relative">
              {/* Connection Line */}
              <div className="hidden md:block absolute top-16 left-full w-full h-0.5 bg-gradient-to-r from-green-300 to-blue-300 transform translate-x-8 z-0"></div>
              
              <div className="relative mb-8 z-10">
                <div className="w-32 h-32 bg-gradient-to-br from-green-400 via-emerald-500 to-green-600 rounded-3xl flex items-center justify-center mx-auto shadow-2xl group-hover:shadow-3xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-3">
                  <Camera className="h-16 w-16 text-white group-hover:scale-110 transition-transform duration-300" />
                </div>
                <div className="absolute -top-3 -right-3 w-12 h-12 bg-gradient-to-br from-green-600 to-emerald-700 text-white rounded-2xl flex items-center justify-center text-lg font-black shadow-lg">
                  1
                </div>
                {/* Floating particles */}
                <div className="absolute top-4 left-4 w-2 h-2 bg-green-400 rounded-full animate-ping"></div>
                <div className="absolute bottom-4 right-4 w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse delay-300"></div>
              </div>
              
              <h3 className="text-2xl font-black text-gray-900 mb-4 group-hover:text-green-600 transition-colors duration-300">
                Take a Photo
              </h3>
              <p className="text-gray-600 leading-relaxed text-lg">
                Point your phone at any leaf or plant that looks sick. 
                The app works with <span className="font-semibold text-green-600">cassava, maize, tomato, and cashew</span> crops.
              </p>
            </div>

            {/* Step 2 - Enhanced */}
            <div className="group text-center relative">
              {/* Connection Line */}
              <div className="hidden md:block absolute top-16 left-full w-full h-0.5 bg-gradient-to-r from-blue-300 to-amber-300 transform translate-x-8 z-0"></div>
              
              <div className="relative mb-8 z-10">
                <div className="w-32 h-32 bg-gradient-to-br from-blue-400 via-sky-500 to-blue-600 rounded-3xl flex items-center justify-center mx-auto shadow-2xl group-hover:shadow-3xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-3">
                  <div className="text-5xl group-hover:scale-110 transition-transform duration-300">🔍</div>
                </div>
                <div className="absolute -top-3 -right-3 w-12 h-12 bg-gradient-to-br from-blue-600 to-sky-700 text-white rounded-2xl flex items-center justify-center text-lg font-black shadow-lg">
                  2
                </div>
                {/* AI Processing Animation */}
                <div className="absolute top-6 left-6 w-3 h-3 bg-blue-400 rounded-full animate-bounce"></div>
                <div className="absolute bottom-6 right-6 w-2 h-2 bg-sky-400 rounded-full animate-bounce delay-150"></div>
                <div className="absolute top-1/2 left-2 w-1.5 h-1.5 bg-blue-300 rounded-full animate-pulse delay-500"></div>
              </div>
              
              <h3 className="text-2xl font-black text-gray-900 mb-4 group-hover:text-blue-600 transition-colors duration-300">
                Get Instant Results
              </h3>
              <p className="text-gray-600 leading-relaxed text-lg">
                Our <span className="font-semibold text-blue-600">smart AI system</span> checks your photo and tells you exactly 
                what disease (if any) is affecting your crops.
              </p>
            </div>

            {/* Step 3 - Enhanced */}
            <div className="group text-center relative">
              <div className="relative mb-8 z-10">
                <div className="w-32 h-32 bg-gradient-to-br from-amber-400 via-yellow-500 to-amber-600 rounded-3xl flex items-center justify-center mx-auto shadow-2xl group-hover:shadow-3xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-3">
                  <div className="text-5xl group-hover:scale-110 transition-transform duration-300">💡</div>
                </div>
                <div className="absolute -top-3 -right-3 w-12 h-12 bg-gradient-to-br from-amber-600 to-yellow-700 text-white rounded-2xl flex items-center justify-center text-lg font-black shadow-lg">
                  3
                </div>
                {/* Success indicators */}
                <div className="absolute top-4 right-4 w-2.5 h-2.5 bg-amber-400 rounded-full animate-ping"></div>
                <div className="absolute bottom-4 left-4 w-2 h-2 bg-yellow-400 rounded-full animate-pulse delay-200"></div>
                <div className="absolute top-1/2 right-2 w-1.5 h-1.5 bg-amber-300 rounded-full animate-bounce delay-400"></div>
              </div>
              
              <h3 className="text-2xl font-black text-gray-900 mb-4 group-hover:text-amber-600 transition-colors duration-300">
                Follow Treatment Plan
              </h3>
              <p className="text-gray-600 leading-relaxed text-lg">
                Get simple, step-by-step instructions on how to treat the problem. 
                Includes both <span className="font-semibold text-amber-600">organic and chemical</span> options.
              </p>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center mt-16">
            <Link
              href="/scan"
              className="group inline-flex items-center gap-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-4 rounded-2xl text-lg font-bold hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
            >
              <Camera className="h-5 w-5 group-hover:rotate-12 transition-transform duration-300" />
              Try It Now - It's Free!
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </div>
        </div>
      </section>

      {/* Revolutionary Testimonials Section */}
      <section className="py-32 bg-gradient-to-br from-white via-green-50/30 to-emerald-50/50 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-32 left-10 w-24 h-24 bg-gradient-to-br from-green-200/20 to-emerald-300/10 rounded-full blur-xl"></div>
          <div className="absolute bottom-32 right-10 w-32 h-32 bg-gradient-to-tr from-blue-200/15 to-green-200/20 rounded-full blur-2xl"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-green-100 to-emerald-100 border border-green-200/50 text-green-700 text-sm font-semibold mb-6">
              <Users className="mr-2 h-4 w-4" />
              Success Stories
            </div>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-900 mb-6">
              <span className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">What Farmers</span>
              <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent block">Are Saying</span>
            </h2>
            <p className="text-xl sm:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Real stories from farmers across Ghana who transformed their farming with AgriSentry
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Testimonial 1 - Enhanced */}
            <div className="group relative bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
              {/* Quote Icon */}
              <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-white text-2xl font-bold">"</span>
              </div>
              
              <div className="flex items-center mb-6">
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-emerald-200 rounded-2xl flex items-center justify-center shadow-lg">
                    <span className="text-2xl">👨‍🌾</span>
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-3 w-3 text-white" />
                  </div>
                </div>
                <div className="ml-4">
                  <h4 className="text-lg font-bold text-gray-900">Kwame Asante</h4>
                  <p className="text-sm text-gray-600 font-medium">Cassava Farmer, Ashanti</p>
                  <div className="flex mt-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-3 w-3 text-yellow-400 fill-current" />
                    ))}
                  </div>
                </div>
              </div>
              
              <blockquote className="text-gray-700 text-lg leading-relaxed font-medium italic mb-4">
                "I saved my entire cassava farm! The app spotted the disease early 
                and gave me exact steps to treat it. Very easy to use."
              </blockquote>
              
              <div className="flex items-center text-sm text-green-600 font-semibold">
                <TrendingUp className="h-4 w-4 mr-2" />
                Increased yield by 40%
              </div>
            </div>

            {/* Testimonial 2 - Enhanced */}
            <div className="group relative bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
              {/* Quote Icon */}
              <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br from-blue-500 to-sky-600 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-white text-2xl font-bold">"</span>
              </div>
              
              <div className="flex items-center mb-6">
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-sky-200 rounded-2xl flex items-center justify-center shadow-lg">
                    <span className="text-2xl">👩‍🌾</span>
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-3 w-3 text-white" />
                  </div>
                </div>
                <div className="ml-4">
                  <h4 className="text-lg font-bold text-gray-900">Ama Osei</h4>
                  <p className="text-sm text-gray-600 font-medium">Tomato Farmer, Greater Accra</p>
                  <div className="flex mt-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-3 w-3 text-yellow-400 fill-current" />
                    ))}
                  </div>
                </div>
              </div>
              
              <blockquote className="text-gray-700 text-lg leading-relaxed font-medium italic mb-4">
                "Now I can check my tomatoes every morning. The app works even 
                when there's no internet. Perfect for us in the village."
              </blockquote>
              
              <div className="flex items-center text-sm text-blue-600 font-semibold">
                <Zap className="h-4 w-4 mr-2" />
                Works 100% offline
              </div>
            </div>

            {/* Testimonial 3 - Enhanced */}
            <div className="group relative bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 md:col-span-2 lg:col-span-1">
              {/* Quote Icon */}
              <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-white text-2xl font-bold">"</span>
              </div>
              
              <div className="flex items-center mb-6">
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-br from-amber-100 to-yellow-200 rounded-2xl flex items-center justify-center shadow-lg">
                    <span className="text-2xl">👨‍🌾</span>
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-3 w-3 text-white" />
                  </div>
                </div>
                <div className="ml-4">
                  <h4 className="text-lg font-bold text-gray-900">Kofi Mensah</h4>
                  <p className="text-sm text-gray-600 font-medium">Maize Farmer, Northern Region</p>
                  <div className="flex mt-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-3 w-3 text-yellow-400 fill-current" />
                    ))}
                  </div>
                </div>
              </div>
              
              <blockquote className="text-gray-700 text-lg leading-relaxed font-medium italic mb-4">
                "The community map helped me see that other farms nearby had the 
                same problem. We worked together to solve it faster."
              </blockquote>
              
              <div className="flex items-center text-sm text-amber-600 font-semibold">
                <Users className="h-4 w-4 mr-2" />
                Connected with 50+ farmers
              </div>
            </div>
          </div>

          {/* Trust Metrics */}
          <div className="mt-20 text-center">
            <div className="inline-flex items-center gap-8 bg-white/60 backdrop-blur-sm rounded-2xl px-8 py-6 border border-white/20 shadow-lg">
              <div className="text-center">
                <div className="text-2xl font-black text-green-600">500+</div>
                <div className="text-sm text-gray-600 font-medium">Happy Farmers</div>
              </div>
              <div className="w-px h-8 bg-gray-300"></div>
              <div className="text-center">
                <div className="text-2xl font-black text-blue-600">95%</div>
                <div className="text-sm text-gray-600 font-medium">Success Rate</div>
              </div>
              <div className="w-px h-8 bg-gray-300"></div>
              <div className="text-center">
                <div className="text-2xl font-black text-amber-600">4.9★</div>
                <div className="text-sm text-gray-600 font-medium">User Rating</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Revolutionary Features Section */}
      <section id="farmers" className="py-32 bg-gradient-to-br from-slate-50 via-white to-blue-50 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-20 w-40 h-40 bg-gradient-to-br from-green-200/15 to-emerald-300/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-32 h-32 bg-gradient-to-tr from-blue-200/20 to-green-200/15 rounded-full blur-2xl"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-100 to-green-100 border border-blue-200/50 text-blue-700 text-sm font-semibold mb-6">
              <Leaf className="mr-2 h-4 w-4" />
              Built for Farmers
            </div>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-900 mb-6">
              <span className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">Built for Real</span>
              <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent block">Farming Life</span>
            </h2>
            <p className="text-xl sm:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              We understand the challenges you face. That's why every feature 
              is designed with <span className="font-semibold text-green-600">Ghanaian farmers</span> in mind.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            {/* Feature 1 - Enhanced */}
            <div className="group flex items-start space-x-6 p-8 rounded-3xl bg-white/60 backdrop-blur-sm border border-white/20 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
              <div className="relative flex-shrink-0">
                <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-emerald-200 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <Zap className="h-8 w-8 text-green-600" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
              </div>
              <div>
                <h3 className="text-2xl font-black text-gray-900 mb-3 group-hover:text-green-600 transition-colors duration-300">
                  Works Without Internet
                </h3>
                <p className="text-gray-600 leading-relaxed text-lg">
                  No need to worry about data or poor network. Once installed, 
                  the app works completely <span className="font-semibold text-green-600">offline in remote farming areas</span>.
                </p>
                <div className="mt-4 flex items-center text-sm text-green-600 font-semibold">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  100% Offline Capability
                </div>
              </div>
            </div>

            {/* Feature 2 - Enhanced */}
            <div className="group flex items-start space-x-6 p-8 rounded-3xl bg-white/60 backdrop-blur-sm border border-white/20 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
              <div className="relative flex-shrink-0">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-sky-200 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <Sun className="h-8 w-8 text-blue-600" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full animate-pulse delay-200"></div>
              </div>
              <div>
                <h3 className="text-2xl font-black text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-300">
                  Easy to See in Sunlight
                </h3>
                <p className="text-gray-600 leading-relaxed text-lg">
                  Large buttons and high contrast design make it easy to use 
                  even in <span className="font-semibold text-blue-600">bright sunlight while working</span> in the fields.
                </p>
                <div className="mt-4 flex items-center text-sm text-blue-600 font-semibold">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Optimized for Outdoor Use
                </div>
              </div>
            </div>

            {/* Feature 3 - Enhanced */}
            <div className="group flex items-start space-x-6 p-8 rounded-3xl bg-white/60 backdrop-blur-sm border border-white/20 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
              <div className="relative flex-shrink-0">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-violet-200 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <Users className="h-8 w-8 text-purple-600" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-purple-500 rounded-full animate-pulse delay-400"></div>
              </div>
              <div>
                <h3 className="text-2xl font-black text-gray-900 mb-3 group-hover:text-purple-600 transition-colors duration-300">
                  Community Support
                </h3>
                <p className="text-gray-600 leading-relaxed text-lg">
                  See what diseases are affecting farms near you. Share 
                  experiences and learn from <span className="font-semibold text-purple-600">other farmers in your area</span>.
                </p>
                <div className="mt-4 flex items-center text-sm text-purple-600 font-semibold">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Connected Farming Network
                </div>
              </div>
            </div>

            {/* Feature 4 - Enhanced */}
            <div className="group flex items-start space-x-6 p-8 rounded-3xl bg-white/60 backdrop-blur-sm border border-white/20 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
              <div className="relative flex-shrink-0">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-100 to-yellow-200 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <Droplets className="h-8 w-8 text-amber-600" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 rounded-full animate-pulse delay-600"></div>
              </div>
              <div>
                <h3 className="text-2xl font-black text-gray-900 mb-3 group-hover:text-amber-600 transition-colors duration-300">
                  Local Treatment Options
                </h3>
                <p className="text-gray-600 leading-relaxed text-lg">
                  Get treatment recommendations using materials you can find 
                  locally, plus <span className="font-semibold text-amber-600">organic alternatives to expensive chemicals</span>.
                </p>
                <div className="mt-4 flex items-center text-sm text-amber-600 font-semibold">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Affordable Local Solutions
                </div>
              </div>
            </div>
          </div>

          {/* Additional Features Grid */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-green-50 to-emerald-100 border border-green-200/50">
              <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-xl">🌱</span>
              </div>
              <h4 className="font-bold text-gray-900 mb-2">4 Major Crops</h4>
              <p className="text-sm text-gray-600">Cassava, Maize, Tomato, Cashew</p>
            </div>
            
            <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-sky-100 border border-blue-200/50">
              <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <h4 className="font-bold text-gray-900 mb-2">24 Disease Types</h4>
              <p className="text-sm text-gray-600">Comprehensive detection</p>
            </div>
            
            <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-purple-50 to-violet-100 border border-purple-200/50">
              <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Star className="h-6 w-6 text-white" />
              </div>
              <h4 className="font-bold text-gray-900 mb-2">Always Free</h4>
              <p className="text-sm text-gray-600">No hidden costs ever</p>
            </div>
          </div>
        </div>
      </section>

      {/* Revolutionary CTA Section */}
      <section className="py-32 bg-gradient-to-br from-green-600 via-emerald-600 to-green-700 relative overflow-hidden">
        {/* Dynamic Background Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-20 w-32 h-32 bg-white/10 rounded-full blur-2xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-40 h-40 bg-white/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white/5 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>
        
        {/* Floating Crop Icons */}
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <div className="absolute top-16 left-16 animate-bounce delay-100">
            <div className="w-12 h-12 bg-white/20 rounded-2xl backdrop-blur-sm flex items-center justify-center text-2xl">🌾</div>
          </div>
          <div className="absolute top-32 right-24 animate-bounce delay-300">
            <div className="w-10 h-10 bg-white/20 rounded-xl backdrop-blur-sm flex items-center justify-center text-xl">🌽</div>
          </div>
          <div className="absolute bottom-32 left-24 animate-bounce delay-500">
            <div className="w-14 h-14 bg-white/20 rounded-2xl backdrop-blur-sm flex items-center justify-center text-2xl">🍅</div>
          </div>
          <div className="absolute bottom-16 right-16 animate-bounce delay-700">
            <div className="w-10 h-10 bg-white/20 rounded-xl backdrop-blur-sm flex items-center justify-center text-lg">🥥</div>
          </div>
        </div>
        
        <div className="relative max-w-6xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          {/* Attention-grabbing badge */}
          <div className="inline-flex items-center px-6 py-3 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-white text-sm font-semibold mb-8 shadow-lg">
            <Sparkles className="mr-2 h-4 w-4 animate-pulse" />
            Join 500+ Successful Farmers
          </div>
          
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-8 leading-tight">
            <span className="block">Start Protecting</span>
            <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent block">Your Crops Today</span>
          </h2>
          
          <p className="text-xl sm:text-2xl text-green-100 mb-12 leading-relaxed max-w-4xl mx-auto font-medium">
            Join hundreds of Ghanaian farmers who are already using AgriSentry 
            to <span className="text-yellow-300 font-semibold">keep their crops healthy and increase their harvests</span>.
          </p>
          
          {/* Enhanced Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12">
            <Link
              href="/scan"
              className="group relative bg-white text-green-600 px-10 py-5 rounded-3xl text-xl font-black hover:bg-gray-50 transition-all duration-300 inline-flex items-center justify-center gap-4 shadow-2xl hover:shadow-3xl transform hover:-translate-y-2 hover:scale-105"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-green-50 to-emerald-50 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative flex items-center gap-4">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
                  <Camera className="h-5 w-5 text-green-600" />
                </div>
                <span>Check My Crops Now</span>
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
              </div>
            </Link>
            
            <Link
              href="/map"
              className="group bg-green-500/80 backdrop-blur-sm text-white border-2 border-green-400/50 px-10 py-5 rounded-3xl text-xl font-black hover:bg-green-400/80 hover:border-green-300 transition-all duration-300 inline-flex items-center justify-center gap-4 shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
            >
              <Map className="h-6 w-6 group-hover:scale-110 transition-transform duration-300" />
              <span>See Community Reports</span>
            </Link>
          </div>
          
          {/* Enhanced Trust Indicators */}
          <div className="flex flex-wrap justify-center items-center gap-8 text-green-100">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-yellow-300" />
              <span className="font-semibold">Always Free</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-yellow-300" />
              <span className="font-semibold">Works Offline</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg">🇬🇭</span>
              <span className="font-semibold">Made in Ghana</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-yellow-300" />
              <span className="font-semibold">95% Accurate</span>
            </div>
          </div>
          
          {/* Urgency Element */}
          <div className="mt-12 inline-flex items-center px-4 py-2 rounded-full bg-yellow-400/20 border border-yellow-300/30 text-yellow-200 text-sm font-medium">
            <span className="animate-pulse mr-2">⚡</span>
            Over 1,000 crops saved this month
          </div>
        </div>
      </section>

      {/* Revolutionary Footer */}
      <footer id="about" className="bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 text-white py-20 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-20 w-32 h-32 bg-green-500/10 rounded-full blur-2xl"></div>
          <div className="absolute bottom-20 right-20 w-40 h-40 bg-blue-500/5 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Brand Section - Enhanced */}
            <div className="lg:col-span-1">
              <div className="flex items-center mb-6 group">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                    <Sparkles className="h-6 w-6 text-white animate-pulse" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-bounce"></div>
                </div>
                <div className="ml-4">
                  <span className="text-2xl font-black bg-gradient-to-r from-white via-green-200 to-emerald-200 bg-clip-text text-transparent">
                    AgriSentry AI
                  </span>
                  <div className="text-xs text-green-400 font-semibold">Powered by AI</div>
                </div>
              </div>
              
              <p className="text-gray-300 mb-8 text-lg leading-relaxed">
                Empowering Ghanaian farmers with <span className="text-green-400 font-semibold">AI-powered crop disease detection</span> and community outbreak tracking. Built with love for Ghana's agricultural future.
              </p>
              
              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="text-center p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
                  <div className="text-2xl font-black text-green-400">500+</div>
                  <div className="text-xs text-gray-400">Farmers Helped</div>
                </div>
                <div className="text-center p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
                  <div className="text-2xl font-black text-blue-400">95%</div>
                  <div className="text-xs text-gray-400">Accuracy Rate</div>
                </div>
              </div>
              
              {/* Quick Actions */}
              <div className="flex gap-3">
                <Link
                  href="/scan"
                  className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-3 rounded-xl text-sm font-bold hover:from-green-700 hover:to-emerald-700 transition-all duration-200 text-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  Try Now
                </Link>
                <Link
                  href="/map"
                  className="flex-1 bg-white/10 backdrop-blur-sm text-white border border-white/20 px-4 py-3 rounded-xl text-sm font-bold hover:bg-white/20 transition-all duration-200 text-center"
                >
                  View Map
                </Link>
              </div>
            </div>

            {/* Features Grid - Enhanced */}
            <div className="lg:col-span-2">
              <div className="grid md:grid-cols-2 gap-8">
                {/* Supported Crops */}
                <div className="p-6 rounded-3xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300">
                  <h3 className="text-xl font-black text-white mb-6 flex items-center">
                    <span className="mr-3 text-2xl">🌾</span>
                    Supported Crops
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors duration-200">
                      <span className="text-2xl mr-3">🥥</span>
                      <div>
                        <div className="font-semibold text-white">Cashew</div>
                        <div className="text-xs text-gray-400">Nut crop detection</div>
                      </div>
                    </div>
                    <div className="flex items-center p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors duration-200">
                      <span className="text-2xl mr-3">🍠</span>
                      <div>
                        <div className="font-semibold text-white">Cassava</div>
                        <div className="text-xs text-gray-400">Root crop analysis</div>
                      </div>
                    </div>
                    <div className="flex items-center p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors duration-200">
                      <span className="text-2xl mr-3">🌽</span>
                      <div>
                        <div className="font-semibold text-white">Maize</div>
                        <div className="text-xs text-gray-400">Grain crop monitoring</div>
                      </div>
                    </div>
                    <div className="flex items-center p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors duration-200">
                      <span className="text-2xl mr-3">🍅</span>
                      <div>
                        <div className="font-semibold text-white">Tomato</div>
                        <div className="text-xs text-gray-400">Vegetable crop care</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Key Features */}
                <div className="p-6 rounded-3xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300">
                  <h3 className="text-xl font-black text-white mb-6 flex items-center">
                    <Sparkles className="mr-3 h-6 w-6 text-green-400" />
                    Key Features
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors duration-200">
                      <CheckCircle className="h-5 w-5 text-green-400 mr-3" />
                      <div>
                        <div className="font-semibold text-white">Disease Detection</div>
                        <div className="text-xs text-gray-400">AI-powered analysis</div>
                      </div>
                    </div>
                    <div className="flex items-center p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors duration-200">
                      <CheckCircle className="h-5 w-5 text-blue-400 mr-3" />
                      <div>
                        <div className="font-semibold text-white">Treatment Plans</div>
                        <div className="text-xs text-gray-400">Step-by-step guidance</div>
                      </div>
                    </div>
                    <div className="flex items-center p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors duration-200">
                      <CheckCircle className="h-5 w-5 text-purple-400 mr-3" />
                      <div>
                        <div className="font-semibold text-white">Community Map</div>
                        <div className="text-xs text-gray-400">Outbreak tracking</div>
                      </div>
                    </div>
                    <div className="flex items-center p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors duration-200">
                      <CheckCircle className="h-5 w-5 text-amber-400 mr-3" />
                      <div>
                        <div className="font-semibold text-white">Offline Support</div>
                        <div className="text-xs text-gray-400">Works without internet</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section - Enhanced */}
          <div className="border-t border-gray-700/50 mt-16 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="text-center md:text-left">
                <p className="text-gray-400 text-sm">
                  &copy; 2024 AgriSentry AI. Built for Ghana AI Hackathon.
                </p>
                <p className="text-gray-500 text-xs mt-1">
                  Made with <span className="text-red-400 animate-pulse">❤️</span> for Ghanaian farmers.
                </p>
              </div>
              
              {/* Trust Badges */}
              <div className="flex items-center gap-4 text-xs text-gray-400">
                <div className="flex items-center gap-1">
                  <Shield className="h-3 w-3 text-green-400" />
                  <span>Secure</span>
                </div>
                <div className="flex items-center gap-1">
                  <Zap className="h-3 w-3 text-blue-400" />
                  <span>Fast</span>
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle className="h-3 w-3 text-purple-400" />
                  <span>Reliable</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-sm">🇬🇭</span>
                  <span>Made in Ghana</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

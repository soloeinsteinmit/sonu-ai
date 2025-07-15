import { Camera, Map, Shield, Users, Zap, Leaf, Sun, Droplets, TrendingUp } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-green-700 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">🌱</span>
              </div>
              <span className="ml-3 text-xl font-bold text-gray-900">
                AgriSentry
              </span>
            </div>
            <nav className="hidden md:flex space-x-8">
              <Link
                href="#how-it-works"
                className="text-gray-700 hover:text-green-600 transition-colors font-medium"
              >
                How It Works
              </Link>
              <Link
                href="#farmers"
                className="text-gray-700 hover:text-green-600 transition-colors font-medium"
              >
                For Farmers
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-white to-amber-50"></div>
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-10 text-6xl">🌾</div>
          <div className="absolute top-40 right-20 text-4xl">🌽</div>
          <div className="absolute bottom-40 left-20 text-5xl">🍅</div>
          <div className="absolute bottom-20 right-10 text-4xl">🥥</div>
        </div>
        
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="text-center">
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-green-100 text-green-800 text-sm font-medium mb-8">
              <span className="mr-2">🇬🇭</span>
              Made for Ghanaian Farmers
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Your Crops Are
              <span className="text-green-600 block">Healthy & Protected</span>
            </h1>
            
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12 leading-relaxed">
              Take a photo of your crops and instantly know if they're healthy. 
              Get simple treatment advice and see what's happening on other farms near you.
            </p>

            {/* Main Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Link
                href="/scan"
                className="group bg-green-600 text-white px-8 py-4 rounded-2xl text-lg font-semibold hover:bg-green-700 transition-all duration-200 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <Camera className="h-4 w-4" />
                </div>
                Check My Crops
              </Link>
              <Link
                href="/map"
                className="group bg-white text-gray-700 border-2 border-gray-200 px-8 py-4 rounded-2xl text-lg font-semibold hover:border-green-300 hover:text-green-700 transition-all duration-200 flex items-center justify-center gap-3"
              >
                <Map className="h-5 w-5" />
                See Farm Reports
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <TrendingUp className="h-8 w-8 text-green-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">95%</div>
                <div className="text-gray-600 text-sm">Accurate Results</div>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">🌾</span>
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">4</div>
                <div className="text-gray-600 text-sm">Major Crops</div>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Shield className="h-8 w-8 text-amber-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">24</div>
                <div className="text-gray-600 text-sm">Disease Types</div>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Users className="h-8 w-8 text-purple-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">Free</div>
                <div className="text-gray-600 text-sm">Always Free</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Simple as 1-2-3
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              No complicated setup. Just point, shoot, and get answers about your crops.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            {/* Step 1 */}
            <div className="text-center">
              <div className="relative mb-8">
                <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-3xl flex items-center justify-center mx-auto shadow-lg">
                  <Camera className="h-12 w-12 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  1
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Take a Photo
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Point your phone at any leaf or plant that looks sick. 
                The app works with cassava, maize, tomato, and cashew crops.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="relative mb-8">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-blue-600 rounded-3xl flex items-center justify-center mx-auto shadow-lg">
                  <span className="text-3xl">🔍</span>
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  2
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Get Instant Results
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Our smart system checks your photo and tells you exactly 
                what disease (if any) is affecting your crops.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="relative mb-8">
                <div className="w-24 h-24 bg-gradient-to-br from-amber-400 to-amber-600 rounded-3xl flex items-center justify-center mx-auto shadow-lg">
                  <span className="text-3xl">💡</span>
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-amber-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  3
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Follow Treatment Plan
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Get simple, step-by-step instructions on how to treat the problem. 
                Includes both organic and chemical options.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Real Farmer Stories */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              What Farmers Are Saying
            </h2>
            <p className="text-xl text-gray-600">
              Real stories from farmers across Ghana
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-green-50 rounded-2xl p-6 border border-green-100">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-green-200 rounded-full flex items-center justify-center">
                  <span className="text-xl">👨‍🌾</span>
                </div>
                <div className="ml-3">
                  <h4 className="font-semibold text-gray-900">Kwame Asante</h4>
                  <p className="text-sm text-gray-600">Cassava Farmer, Ashanti</p>
                </div>
              </div>
              <p className="text-gray-700 italic">
                "I saved my entire cassava farm! The app spotted the disease early 
                and gave me exact steps to treat it. Very easy to use."
              </p>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center">
                  <span className="text-xl">👩‍🌾</span>
                </div>
                <div className="ml-3">
                  <h4 className="font-semibold text-gray-900">Ama Osei</h4>
                  <p className="text-sm text-gray-600">Tomato Farmer, Greater Accra</p>
                </div>
              </div>
              <p className="text-gray-700 italic">
                "Now I can check my tomatoes every morning. The app works even 
                when there's no internet. Perfect for us in the village."
              </p>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-amber-50 rounded-2xl p-6 border border-amber-100">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-amber-200 rounded-full flex items-center justify-center">
                  <span className="text-xl">👨‍🌾</span>
                </div>
                <div className="ml-3">
                  <h4 className="font-semibold text-gray-900">Kofi Mensah</h4>
                  <p className="text-sm text-gray-600">Maize Farmer, Northern Region</p>
                </div>
              </div>
              <p className="text-gray-700 italic">
                "The community map helped me see that other farms nearby had the 
                same problem. We worked together to solve it faster."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features for Farmers */}
      <section id="farmers" className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Built for Real Farming Life
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We understand the challenges you face. That's why every feature 
              is designed with Ghanaian farmers in mind.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            {/* Feature 1 */}
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Zap className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Works Without Internet
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  No need to worry about data or poor network. Once installed, 
                  the app works completely offline in remote farming areas.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Sun className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Easy to See in Sunlight
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Large buttons and high contrast design make it easy to use 
                  even in bright sunlight while working in the fields.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Community Support
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  See what diseases are affecting farms near you. Share 
                  experiences and learn from other farmers in your area.
                </p>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Droplets className="h-6 w-6 text-amber-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Local Treatment Options
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Get treatment recommendations using materials you can find 
                  locally, plus organic alternatives to expensive chemicals.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-green-700 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 text-4xl">🌾</div>
          <div className="absolute top-20 right-20 text-3xl">🌽</div>
          <div className="absolute bottom-20 left-20 text-4xl">🍅</div>
          <div className="absolute bottom-10 right-10 text-3xl">🥥</div>
        </div>
        
        <div className="relative max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Start Protecting Your Crops Today
          </h2>
          <p className="text-xl text-green-100 mb-8 leading-relaxed">
            Join hundreds of Ghanaian farmers who are already using AgriSentry 
            to keep their crops healthy and increase their harvests.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/scan"
              className="group bg-white text-green-600 px-8 py-4 rounded-2xl text-lg font-semibold hover:bg-gray-50 transition-all duration-200 inline-flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <Camera className="h-4 w-4 text-green-600" />
              </div>
              Check My Crops Now
            </Link>
            <Link
              href="/map"
              className="group bg-green-500 text-white border-2 border-green-400 px-8 py-4 rounded-2xl text-lg font-semibold hover:bg-green-400 transition-all duration-200 inline-flex items-center justify-center gap-3"
            >
              <Map className="h-5 w-5" />
              See Community Reports
            </Link>
          </div>
          
          <div className="mt-8 text-green-100 text-sm">
            <p>✓ Always Free  ✓ Works Offline  ✓ Made in Ghana</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="about" className="bg-gray-900 text-white py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <Leaf className="h-8 w-8 text-green-400" />
                <span className="ml-2 text-xl font-bold">AgriSentry AI</span>
              </div>
              <p className="text-gray-300 mb-6">
                Empowering Ghanaian farmers with AI-powered crop disease
                detection and community outbreak tracking. Built with love for
                Ghana's agricultural future.
              </p>
              {/* <div className="text-sm text-gray-400">
                <p>Developed by:</p>
                <p className="font-semibold">• Alhassan Mohammed Nuruddin</p>
                <p className="font-semibold">• Solomon Eshun</p>
              </div> */}
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">
                Supported Crops & Diseases
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm text-gray-300">
                <div>
                  <h4 className="font-semibold text-white mb-2">Crops:</h4>
                  <ul className="space-y-1">
                    <li>🥥 Cashew</li>
                    <li>🍠 Cassava</li>
                    <li>🌽 Maize</li>
                    <li>🍅 Tomato</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-2">Features:</h4>
                  <ul className="space-y-1">
                    <li>✅ Disease Detection</li>
                    <li>✅ Treatment Plans</li>
                    <li>✅ Outbreak Mapping</li>
                    <li>✅ Offline Support</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>
              &copy; 2024 AgriSentry AI. Built for Ghana AI Hackathon. Made with
              ❤️ for Ghanaian farmers.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

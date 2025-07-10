import { Camera, Map, Shield, Users, Zap, Leaf } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-green-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Leaf className="h-8 w-8 text-green-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">
                AgriSentry AI
              </span>
            </div>
            <nav className="hidden md:flex space-x-8">
              <Link
                href="#features"
                className="text-gray-700 hover:text-green-600 transition-colors"
              >
                Features
              </Link>
              <Link
                href="#about"
                className="text-gray-700 hover:text-green-600 transition-colors"
              >
                About
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <div className="mb-8">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Protect Your Crops with
              <span className="text-green-600 block">AI-Powered Detection</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Instantly detect crop diseases, get expert treatment
              recommendations, and track community outbreaks across Ghana. Built
              for farmers, by farmers.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link
              href="/scan"
              className="bg-green-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-2 shadow-lg"
            >
              <Camera className="h-5 w-5" />
              Scan Crop Disease
            </Link>
            <Link
              href="/map"
              className="bg-white text-green-600 border-2 border-green-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-green-50 transition-colors flex items-center justify-center gap-2"
            >
              <Map className="h-5 w-5" />
              View Outbreak Map
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">95%</div>
              <div className="text-gray-600">Detection Accuracy</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">24</div>
              <div className="text-gray-600">Disease Types</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">4</div>
              <div className="text-gray-600">Crop Types</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">🇬🇭</div>
              <div className="text-gray-600">Made for Ghana</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Comprehensive Crop Protection
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Beyond simple detection - get complete treatment plans, community
              insights, and preventive strategies.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-green-50 rounded-xl p-6 text-center">
              <div className="bg-green-600 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <Camera className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                AI Disease Detection
              </h3>
              <p className="text-gray-600">
                Snap a photo and get instant disease identification with 95%
                accuracy across 24 common diseases.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-blue-50 rounded-xl p-6 text-center">
              <div className="bg-blue-600 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Treatment Recommendations
              </h3>
              <p className="text-gray-600">
                Get personalized treatment plans with organic and chemical
                options, dosage calculations, and cost estimates.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-purple-50 rounded-xl p-6 text-center">
              <div className="bg-purple-600 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <Map className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Outbreak Mapping
              </h3>
              <p className="text-gray-600">
                Track disease outbreaks in your community with real-time maps
                and early warning alerts.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-orange-50 rounded-xl p-6 text-center">
              <div className="bg-orange-600 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Community Network
              </h3>
              <p className="text-gray-600">
                Connect with fellow farmers, share experiences, and contribute
                to Ghana's agricultural intelligence.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-red-50 rounded-xl p-6 text-center">
              <div className="bg-red-600 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Offline Capable
              </h3>
              <p className="text-gray-600">
                Works without internet connection. Scan and get recommendations
                even in remote farming areas.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-teal-50 rounded-xl p-6 text-center">
              <div className="bg-teal-600 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <Leaf className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Local Expertise
              </h3>
              <p className="text-gray-600">
                Tailored for Ghanaian crops, climate, and farming practices with
                local language support.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-green-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Ready to Protect Your Crops?
          </h2>
          <p className="text-xl text-green-100 mb-8">
            Join thousands of Ghanaian farmers already using AgriSentry AI to
            improve their harvests.
          </p>
          <Link
            href="/scan"
            className="bg-white text-green-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-50 transition-colors inline-flex items-center gap-2"
          >
            <Camera className="h-5 w-5" />
            Start Scanning Now
          </Link>
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

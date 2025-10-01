import { MapPin, Shield, Clock, Users, ChevronRight } from 'lucide-react';

interface HomePageProps {
  onNavigate: (page: string) => void;
}

export function HomePage({ onNavigate }: HomePageProps) {
  return (
    <div className="min-h-screen bg-white">
      <section className="relative bg-gradient-to-br from-teal-600 via-teal-700 to-teal-800 text-white py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE0YzMuMzEgMCA2IDIuNjkgNiA2cy0yLjY5IDYtNiA2LTYtMi42OS02LTYgMi42OS02IDYtNnpNIDYgMzRjMy4zMSAwIDYgMi42OSA2IDZzLTIuNjktNi02LTYtNi0yLjY5LTYtNiAyLjY5LTYgNi02eiIvPjwvZz48L2c+PC9zdmc+')] opacity-20"></div>

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Verify Physical Presence
              <br />
              <span className="text-coral-400">With GPS Precision</span>
            </h1>
            <p className="text-xl text-teal-100 mb-8 max-w-3xl mx-auto leading-relaxed">
              Locked In uses GPS technology to ensure accurate attendance tracking
              for institutions, eliminating proxy attendance and ensuring genuine
              physical presence.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => onNavigate('signup')}
                className="px-8 py-4 bg-coral-500 hover:bg-coral-600 text-white font-semibold rounded-lg transition-all transform hover:scale-105 shadow-lg"
              >
                Get Started Free
              </button>
              <button
                onClick={() => onNavigate('about')}
                className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg transition-colors border border-white/30"
              >
                Learn More
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose Locked In?
            </h2>
            <p className="text-gray-600 text-lg">
              Built for institutions that demand accuracy and reliability
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard
              icon={<MapPin className="w-8 h-8" />}
              title="GPS Verified"
              description="Real-time location verification ensures students are physically present at the event location."
            />
            <FeatureCard
              icon={<Shield className="w-8 h-8" />}
              title="Secure & Private"
              description="Enterprise-grade security with encrypted data and privacy-first location handling."
            />
            <FeatureCard
              icon={<Clock className="w-8 h-8" />}
              title="Real-Time Updates"
              description="Live attendance tracking with instant notifications and comprehensive reporting."
            />
            <FeatureCard
              icon={<Users className="w-8 h-8" />}
              title="Multi-Role Support"
              description="Designed for institutions, leads, and students with role-based access control."
            />
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-gray-600 text-lg">
              Simple, fast, and accurate attendance in three steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <StepCard
              number="1"
              title="Lead Creates Event"
              description="Instructors create events and confirm their GPS location at the venue."
            />
            <StepCard
              number="2"
              title="Share Link or QR"
              description="Generate a unique attendance link or QR code to share with students."
            />
            <StepCard
              number="3"
              title="Students Check In"
              description="Students click the link, allow location access, and are verified automatically."
            />
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-gradient-to-br from-coral-500 to-coral-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Modernize Your Attendance?
          </h2>
          <p className="text-xl text-coral-100 mb-8">
            Join institutions worldwide using GPS-verified attendance tracking
          </p>
          <button
            onClick={() => onNavigate('signup')}
            className="px-8 py-4 bg-white text-coral-600 hover:bg-gray-100 font-semibold rounded-lg transition-all transform hover:scale-105 shadow-lg inline-flex items-center space-x-2"
          >
            <span>Start Your Free Trial</span>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
      <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-teal-100 to-coral-100 rounded-lg mb-4 text-teal-600">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </div>
  );
}

function StepCard({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="text-center">
      <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-teal-500 to-teal-600 text-white rounded-full text-2xl font-bold mb-4 shadow-lg">
        {number}
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </div>
  );
}

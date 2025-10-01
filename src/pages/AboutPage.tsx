import { Building2, Target, Award, Users } from 'lucide-react';

export function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <section className="bg-gradient-to-br from-teal-600 to-teal-700 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6">About Locked In</h1>
          <p className="text-xl text-teal-100 leading-relaxed">
            Revolutionizing attendance management with GPS-verified physical presence tracking
          </p>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Our Mission
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed mb-4">
                Locked In was created to solve a critical problem in educational
                institutions and organizations: ensuring genuine physical presence.
                Traditional attendance methods are prone to fraud, while manual
                verification is time-consuming and unreliable.
              </p>
              <p className="text-gray-600 text-lg leading-relaxed">
                Our GPS-based verification system ensures that every attendance
                record represents actual physical presence, giving institutions
                confidence in their attendance data.
              </p>
            </div>
            <div className="bg-gradient-to-br from-teal-100 to-coral-100 rounded-2xl p-8 shadow-xl">
              <div className="grid grid-cols-2 gap-6 text-center">
                <Stat number="99.9%" label="Accuracy Rate" />
                <Stat number="<5s" label="Check-in Time" />
                <Stat number="100%" label="Secure" />
                <Stat number="24/7" label="Support" />
              </div>
            </div>
          </div>

          <div className="mb-20">
            <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">
              Core Values
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <ValueCard
                icon={<Target className="w-10 h-10" />}
                title="Accuracy"
                description="Precise GPS verification ensures every attendance record is genuine."
              />
              <ValueCard
                icon={<Award className="w-10 h-10" />}
                title="Trust"
                description="Build confidence in your attendance data with transparent verification."
              />
              <ValueCard
                icon={<Users className="w-10 h-10" />}
                title="Accessibility"
                description="Simple, mobile-first design works on any device with GPS capability."
              />
              <ValueCard
                icon={<Building2 className="w-10 h-10" />}
                title="Scalability"
                description="From small classes to large institutions, we scale with your needs."
              />
            </div>
          </div>

          <div className="bg-gray-50 rounded-2xl p-12">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-4xl font-bold text-gray-900 mb-6 text-center">
                Built by KAR Tech
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed text-center mb-6">
                <span className="text-gold-500 font-semibold">KAR Tech</span>{' '}
                <span className="text-gray-500 text-base">(company pending registration)</span>
                {' '}is committed to developing innovative technology solutions that solve
                real-world problems for educational institutions and organizations.
              </p>
              <p className="text-gray-600 text-lg leading-relaxed text-center">
                We believe in building tools that are secure, reliable, and easy
                to use, empowering institutions to focus on what matters most:
                education and development.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function Stat({ number, label }: { number: string; label: string }) {
  return (
    <div>
      <div className="text-4xl font-bold text-teal-700 mb-2">{number}</div>
      <div className="text-gray-700 font-medium">{label}</div>
    </div>
  );
}

function ValueCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="text-center">
      <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-teal-100 to-coral-100 rounded-full mb-4 text-teal-600">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </div>
  );
}

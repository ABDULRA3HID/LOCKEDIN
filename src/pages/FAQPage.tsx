import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: 'How does GPS-based attendance verification work?',
      answer:
        'When a lead creates an event, they confirm their GPS location at the venue. Students then use a unique link or QR code to check in. The system compares the student\'s GPS location with the lead\'s confirmed location. If the student is within the specified radius (typically 50 meters), they are marked present.',
    },
    {
      question: 'What accuracy can I expect from GPS verification?',
      answer:
        'GPS accuracy typically ranges from 5-30 meters under good conditions. Our system requires accuracy better than 100 meters and calculates the exact distance between the lead and student locations. The configurable radius accounts for GPS variance while preventing proxy attendance.',
    },
    {
      question: 'Can students fake their location?',
      answer:
        'We implement multiple security measures including accuracy checks, device information logging, IP address verification, and detection of impossible rapid location changes. While no system is 100% foolproof, our multi-layered approach makes location spoofing extremely difficult and detectable.',
    },
    {
      question: 'What if GPS is not available or accurate enough?',
      answer:
        'If a student\'s GPS accuracy exceeds the threshold or location services are unavailable, the check-in is rejected with a clear reason. Students can retry once they have better GPS signal, typically by moving outdoors or near a window.',
    },
    {
      question: 'How is my location data protected?',
      answer:
        'We take privacy seriously. Location data is only collected during check-in, stored securely with encryption, and used solely for attendance verification. We maintain minimal location data and comply with privacy regulations. Users can request data export or deletion at any time.',
    },
    {
      question: 'Can I use Locked In for multiple institutions?',
      answer:
        'Yes! Institution admins can register their institution, and leads can create events under that institution. Students sign up with their institution code. The system supports unlimited institutions with proper data isolation.',
    },
    {
      question: 'How long are attendance links valid?',
      answer:
        'Attendance links are typically valid for 24 hours by default, but leads can configure custom expiration times or revoke links at any time. This prevents unauthorized access while maintaining flexibility.',
    },
    {
      question: 'Can I export attendance reports?',
      answer:
        'Yes! Leads can export attendance records in CSV format for any event. Reports include student information, check-in times, GPS accuracy, distance from venue, and attendance status.',
    },
    {
      question: 'What happens if I check in late?',
      answer:
        'As long as the attendance link is active and you\'re within the specified radius, you can check in. The exact check-in time is recorded, allowing leads to see punctuality patterns. Some institutions may configure grace periods.',
    },
    {
      question: 'Do I need a specific type of phone to use Locked In?',
      answer:
        'Any smartphone or device with GPS capability and a modern web browser works with Locked In. Our mobile-first design ensures a smooth experience across all devices, and we optimize for low-data environments.',
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <section className="bg-gradient-to-br from-teal-600 to-teal-700 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-teal-100">
            Everything you need to know about Locked In
          </p>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <FAQItem
                key={index}
                question={faq.question}
                answer={faq.answer}
                isOpen={openIndex === index}
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              />
            ))}
          </div>

          <div className="mt-16 bg-gradient-to-br from-teal-50 to-coral-50 rounded-2xl p-8 text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Still have questions?
            </h3>
            <p className="text-gray-600 mb-6">
              Can't find the answer you're looking for? Please reach out to our team.
            </p>
            <button className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg transition-colors">
              Contact Support
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

function FAQItem({
  question,
  answer,
  isOpen,
  onClick,
}: {
  question: string;
  answer: string;
  isOpen: boolean;
  onClick: () => void;
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:border-teal-300 transition-colors">
      <button
        onClick={onClick}
        className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
      >
        <span className="font-semibold text-gray-900 pr-8">{question}</span>
        <ChevronDown
          className={`w-5 h-5 text-teal-600 flex-shrink-0 transition-transform ${
            isOpen ? 'transform rotate-180' : ''
          }`}
        />
      </button>
      {isOpen && (
        <div className="px-6 pb-4 pt-2">
          <p className="text-gray-600 leading-relaxed">{answer}</p>
        </div>
      )}
    </div>
  );
}

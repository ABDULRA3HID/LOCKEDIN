export function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      <section className="bg-gradient-to-br from-teal-600 to-teal-700 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6">Terms of Use</h1>
          <p className="text-xl text-teal-100">Last updated: October 2025</p>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto prose prose-lg">
          <Section title="1. Acceptance of Terms">
            <p>
              By accessing and using Locked In, you accept and agree to be bound by
              these Terms of Use. If you do not agree to these terms, please do not
              use our service.
            </p>
          </Section>

          <Section title="2. Service Description">
            <p>
              Locked In is a GPS-based attendance verification system designed for
              educational institutions and organizations. The service uses GPS
              location data to verify physical presence at events.
            </p>
          </Section>

          <Section title="3. User Accounts">
            <p>
              You are responsible for maintaining the confidentiality of your account
              credentials. You agree to accept responsibility for all activities that
              occur under your account. Notify us immediately of any unauthorized use
              of your account.
            </p>
          </Section>

          <Section title="4. Acceptable Use">
            <p>You agree not to:</p>
            <ul>
              <li>Use the service for any unlawful purpose</li>
              <li>Attempt to bypass GPS verification or fake your location</li>
              <li>Share attendance links with unauthorized individuals</li>
              <li>
                Access or attempt to access other users' accounts without permission
              </li>
              <li>Interfere with or disrupt the service or servers</li>
            </ul>
          </Section>

          <Section title="5. Location Data">
            <p>
              By using Locked In, you consent to the collection and processing of
              your GPS location data during check-in. Location data is used solely
              for attendance verification and is handled in accordance with our
              Privacy Policy.
            </p>
          </Section>

          <Section title="6. Accuracy and Reliability">
            <p>
              While we strive for accuracy, GPS technology has inherent limitations.
              We do not guarantee 100% accuracy in all circumstances. The service
              should be used as part of a comprehensive attendance management system.
            </p>
          </Section>

          <Section title="7. Intellectual Property">
            <p>
              All content, features, and functionality of Locked In are owned by KAR
              Tech and are protected by copyright, trademark, and other intellectual
              property laws.
            </p>
          </Section>

          <Section title="8. Limitation of Liability">
            <p>
              Locked In is provided "as is" without warranties of any kind. We shall
              not be liable for any indirect, incidental, special, or consequential
              damages arising from your use of the service.
            </p>
          </Section>

          <Section title="9. Changes to Terms">
            <p>
              We reserve the right to modify these terms at any time. We will notify
              users of significant changes. Continued use of the service after
              changes constitutes acceptance of the modified terms.
            </p>
          </Section>

          <Section title="10. Termination">
            <p>
              We reserve the right to suspend or terminate your account if you
              violate these terms or engage in fraudulent or abusive behavior.
            </p>
          </Section>

          <Section title="11. Contact Information">
            <p>
              For questions about these Terms of Use, please contact us at
              support@lockedin.example.com
            </p>
          </Section>
        </div>
      </section>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">{title}</h2>
      <div className="text-gray-600 space-y-4">{children}</div>
    </div>
  );
}

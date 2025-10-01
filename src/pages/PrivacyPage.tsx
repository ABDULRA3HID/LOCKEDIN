export function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <section className="bg-gradient-to-br from-teal-600 to-teal-700 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6">Privacy Policy</h1>
          <p className="text-xl text-teal-100">Last updated: October 2025</p>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto prose prose-lg">
          <Section title="1. Information We Collect">
            <p>We collect the following types of information:</p>
            <ul>
              <li>
                <strong>Account Information:</strong> Name, email, phone number,
                student number, institution affiliation
              </li>
              <li>
                <strong>Location Data:</strong> GPS coordinates, accuracy metrics,
                and timestamp during check-in
              </li>
              <li>
                <strong>Device Information:</strong> Device type, browser, IP
                address for security and audit purposes
              </li>
              <li>
                <strong>Usage Data:</strong> Event creation, attendance records,
                check-in history
              </li>
            </ul>
          </Section>

          <Section title="2. How We Use Your Information">
            <p>We use collected information to:</p>
            <ul>
              <li>Verify your physical presence at events</li>
              <li>Provide attendance tracking and reporting services</li>
              <li>Improve our service and user experience</li>
              <li>Communicate with you about your account and service updates</li>
              <li>Detect and prevent fraud or unauthorized access</li>
              <li>Comply with legal obligations</li>
            </ul>
          </Section>

          <Section title="3. Location Data Privacy">
            <p>
              <strong>Your location data is collected only during check-in.</strong>{' '}
              We do not track your location continuously. Location data is:
            </p>
            <ul>
              <li>Collected only when you actively check in to an event</li>
              <li>Used solely for attendance verification</li>
              <li>Stored securely with encryption</li>
              <li>Retained only as long as necessary for attendance records</li>
              <li>Not sold or shared with third parties for marketing purposes</li>
            </ul>
          </Section>

          <Section title="4. Data Sharing and Disclosure">
            <p>We share your data only in the following circumstances:</p>
            <ul>
              <li>
                <strong>Within Your Institution:</strong> Leads and admins can view
                attendance records for their events/institution
              </li>
              <li>
                <strong>Legal Requirements:</strong> When required by law or to
                protect our rights
              </li>
              <li>
                <strong>Service Providers:</strong> With trusted partners who assist
                in operating our service (under strict confidentiality agreements)
              </li>
            </ul>
          </Section>

          <Section title="5. Data Security">
            <p>
              We implement industry-standard security measures to protect your data:
            </p>
            <ul>
              <li>Encryption of data in transit and at rest</li>
              <li>Secure authentication and password hashing</li>
              <li>Regular security audits and updates</li>
              <li>Access controls and audit logging</li>
              <li>Data backup and recovery procedures</li>
            </ul>
          </Section>

          <Section title="6. Your Rights">
            <p>You have the right to:</p>
            <ul>
              <li>Access your personal data</li>
              <li>Request correction of inaccurate data</li>
              <li>Request deletion of your data (subject to record-keeping obligations)</li>
              <li>Export your data in a portable format</li>
              <li>Opt out of non-essential communications</li>
              <li>Withdraw consent for data processing where applicable</li>
            </ul>
          </Section>

          <Section title="7. Data Retention">
            <p>
              We retain your data as long as your account is active or as needed to
              provide services. Attendance records are retained according to
              institutional requirements. You may request deletion of your account
              and associated data at any time.
            </p>
          </Section>

          <Section title="8. Children's Privacy">
            <p>
              While our service is used in educational settings, we require all users
              to be at least 13 years old. If we discover we have collected data from
              a child under 13 without parental consent, we will delete it promptly.
            </p>
          </Section>

          <Section title="9. International Data Transfers">
            <p>
              Your data may be transferred to and processed in countries other than
              your own. We ensure appropriate safeguards are in place to protect your
              data in accordance with this Privacy Policy.
            </p>
          </Section>

          <Section title="10. Changes to This Policy">
            <p>
              We may update this Privacy Policy periodically. We will notify users of
              significant changes via email or through the service. Continued use
              after changes constitutes acceptance of the updated policy.
            </p>
          </Section>

          <Section title="11. Contact Us">
            <p>
              For questions about this Privacy Policy or to exercise your data rights,
              contact us at privacy@lockedin.example.com
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

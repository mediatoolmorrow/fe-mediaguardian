import React from "react";

function PdpaPage() {
  return (
    <div className="flex flex-col items-center justify-center p-10">
      <h2 className="text-2xl font-semibold mb-6">PDPA</h2>

      <div className="w-full max-w-3xl h-[500px] overflow-y-auto p-6 border rounded-xl space-y-6 leading-relaxed text-gray-700">

        <p>
          We are committed to protecting the personal information you provide to us and ensuring that it is handled in accordance with the Personal Data Protection Act (PDPA). This notice explains how we collect, use, disclose, store, and protect your data when you interact with our services.
        </p>

        <h3 className="font-semibold text-lg">1. Types of Personal Data Collected</h3>
        <p>
          We may collect the following categories of personal data:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Identification Data: name, date of birth, identification number, passport details.</li>
          <li>Contact Information: address, phone number, email address, communication preferences.</li>
          <li>Account Information: login credentials, transaction records, purchase history, usage activity.</li>
          <li>Technical Data: IP address, device info, browser type, operating system, access logs.</li>
          <li>Behavioral Data: insights about how you use our website, services, or products.</li>
          <li>Sensitive Data (if required): such as biometric information, only with explicit consent.</li>
        </ul>

        <h3 className="font-semibold text-lg">2. Purpose of Collecting Personal Data</h3>
        <p>
          We collect and process your personal data for purposes including but not limited to:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Delivering our services and fulfilling your requests.</li>
          <li>Managing your account and providing customer support.</li>
          <li>Improving our products, website, and user experience.</li>
          <li>Sending updates or promotions with your consent.</li>
          <li>Ensuring security, fraud prevention, and system integrity.</li>
          <li>Complying with legal obligations and regulatory requirements.</li>
        </ul>

        <h3 className="font-semibold text-lg">3. Legal Basis for Processing</h3>
        <p>
          We process your data based on explicit consent, contract fulfillment, legal obligations, or legitimate interest.
        </p>

        <h3 className="font-semibold text-lg">4. Disclosure of Your Personal Data</h3>
        <p>Your data may be shared with:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Internal service teams.</li>
          <li>Authorized third-party service providers such as payment gateways, hosting services, or analytics tools.</li>
          <li>Government authorities as required by law.</li>
          <li>Business partners or affiliates with your explicit consent.</li>
        </ul>
        <p>We do not sell or trade your personal data to external parties.</p>

        <h3 className="font-semibold text-lg">5. Retention of Personal Data</h3>
        <p>
          Your data is kept only as long as necessary for the stated purposes or legal requirements. Afterward, it will be securely deleted or anonymized.
        </p>

        <h3 className="font-semibold text-lg">6. International Transfers</h3>
        <p>
          If your data is transferred outside the country, we ensure the receiving party provides PDPA-level protection.
        </p>

        <h3 className="font-semibold text-lg">7. Security Measures</h3>
        <p>
          We apply encryption, access controls, audits, and secure storage practices to protect your data. While no system is perfect, we follow industry best standards.
        </p>

        <h3 className="font-semibold text-lg">8. Your Rights</h3>
        <p>You may request the following at any time:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Access to your data</li>
          <li>Correction or updating</li>
          <li>Deletion</li>
          <li>Withdrawal of consent</li>
          <li>Restriction of processing</li>
          <li>Objection to certain uses</li>
          <li>Data portability, where applicable</li>
        </ul>

        <h3 className="font-semibold text-lg">9. Cookies & Tracking</h3>
        <p>
          We use cookies and similar technologies to enhance your experience, analyze trends, and support essential website functions. You may disable cookies, but some features may not work properly.
        </p>

        <h3 className="font-semibold text-lg">10. Updates to This Notice</h3>
        <p>
          This PDPA notice may be updated periodically. The latest version will always be available on our website.
        </p>

        <h3 className="font-semibold text-lg">11. Contact Us</h3>
        <p>
          For inquiries or requests regarding your personal information, please contact:
        </p>
        <p>Email: dpo@example.com<br />
        Phone: +66-XXX-XXX-XXX<br />
        Address: (Your Company Address)</p>

      </div>
    </div>
  );
}

export default PdpaPage;

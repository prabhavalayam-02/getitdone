import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/enhanced-button';
import { ArrowLeft } from 'lucide-react';

const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Link to="/">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </Link>

        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center">Privacy Policy</CardTitle>
            <p className="text-center text-muted-foreground mt-2">Effective Date: 05-11-2025</p>
          </CardHeader>
          
          <CardContent className="prose prose-sm max-w-none space-y-6">
            <section>
              <h2 className="text-2xl font-semibold mb-3">1. Introduction</h2>
              <p className="text-muted-foreground leading-relaxed">
                Get It Done ("we," "us," or "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform, website, and mobile application (collectively, the "Service").
              </p>
              <p className="text-muted-foreground leading-relaxed mt-2">
                By using our Service, you agree to the collection and use of information in accordance with this Privacy Policy.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">2. Information We Collect</h2>
              
              <h3 className="text-xl font-semibold mb-2 mt-4">2.1 Personal Information</h3>
              <p className="text-muted-foreground leading-relaxed mb-2">
                We collect personal information that you provide directly to us, including:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Name, email address, phone number</li>
                <li>Account credentials (username and password)</li>
                <li>Profile information and preferences</li>
                <li>Payment information for subscriptions (processed securely by third-party payment providers)</li>
                <li>For Helpers: KYC documents including government-issued ID, address proof, and verification documents</li>
              </ul>

              <h3 className="text-xl font-semibold mb-2 mt-4">2.2 Task and Transaction Information</h3>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Task descriptions, requirements, budgets, and locations</li>
                <li>Communications between Users and Helpers</li>
                <li>Ratings and reviews</li>
                <li>Task acceptance, completion, and payment status</li>
              </ul>

              <h3 className="text-xl font-semibold mb-2 mt-4">2.3 Usage and Technical Information</h3>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Device information (IP address, browser type, operating system)</li>
                <li>Usage data (pages visited, features used, time spent on the platform)</li>
                <li>Cookies and similar tracking technologies</li>
                <li>Location data (when you provide permission)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">3. How We Use Your Information</h2>
              <p className="text-muted-foreground leading-relaxed mb-2">
                We use the collected information for the following purposes:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li><strong>To provide and maintain our Service:</strong> Account creation, task posting and matching, communication facilitation</li>
                <li><strong>To process transactions:</strong> Managing subscriptions and verifying payments</li>
                <li><strong>For verification and security:</strong> Verifying Helper identities through KYC documents, preventing fraud and ensuring platform safety</li>
                <li><strong>To communicate with you:</strong> Sending notifications, updates, task alerts, and customer support responses</li>
                <li><strong>To improve our Service:</strong> Analyzing usage patterns, fixing bugs, and developing new features</li>
                <li><strong>For legal compliance:</strong> Complying with applicable laws and regulations</li>
                <li><strong>To build trust:</strong> Displaying ratings, reviews, and verified badges to help users make informed decisions</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">4. Information Sharing and Disclosure</h2>
              <p className="text-muted-foreground leading-relaxed mb-2">
                We do NOT sell or rent your personal information to third parties. We may share your information only in the following circumstances:
              </p>
              
              <h3 className="text-xl font-semibold mb-2 mt-4">4.1 Within the Platform</h3>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Users and Helpers can see each other's public profile information (name, ratings, completed tasks) when matched for a task</li>
                <li>Contact information is shared only when a task is accepted and approved</li>
              </ul>

              <h3 className="text-xl font-semibold mb-2 mt-4">4.2 Service Providers</h3>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Third-party payment processors for handling subscription payments</li>
                <li>Cloud hosting and storage providers</li>
                <li>Email and notification service providers</li>
                <li>All service providers are bound by confidentiality agreements and data protection requirements</li>
              </ul>

              <h3 className="text-xl font-semibold mb-2 mt-4">4.3 Legal Requirements</h3>
              <p className="text-muted-foreground leading-relaxed">
                We may disclose your information if required by law, court order, or government request, or to protect our rights, property, or safety.
              </p>

              <h3 className="text-xl font-semibold mb-2 mt-4">4.4 Business Transfers</h3>
              <p className="text-muted-foreground leading-relaxed">
                In the event of a merger, acquisition, or sale of assets, user information may be transferred as part of that transaction.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">5. Data Security</h2>
              <p className="text-muted-foreground leading-relaxed mb-2">
                We implement industry-standard security measures to protect your personal information:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Encrypted data transmission using SSL/TLS protocols</li>
                <li>Secure storage of KYC documents and sensitive information</li>
                <li>Regular security audits and updates</li>
                <li>Access controls and authentication mechanisms</li>
                <li>No storage of credit card or banking information on our servers</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-2">
                However, no method of transmission over the internet is 100% secure. While we strive to protect your information, we cannot guarantee absolute security.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">6. Data Retention</h2>
              <p className="text-muted-foreground leading-relaxed">
                We retain your personal information for as long as necessary to provide our Service and comply with legal obligations. When you delete your account, we will delete or anonymize your personal information, except where retention is required by law or for legitimate business purposes (e.g., fraud prevention, dispute resolution).
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">7. Your Rights and Choices</h2>
              <p className="text-muted-foreground leading-relaxed mb-2">
                You have the following rights regarding your personal information:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li><strong>Access and Update:</strong> You can access and update your account information through your profile settings</li>
                <li><strong>Data Portability:</strong> You can request a copy of your personal data in a structured, machine-readable format</li>
                <li><strong>Deletion:</strong> You can request deletion of your account and personal information (subject to legal retention requirements)</li>
                <li><strong>Opt-out:</strong> You can opt-out of promotional emails by following the unsubscribe link in emails</li>
                <li><strong>Cookie Settings:</strong> You can manage cookie preferences through your browser settings</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-2">
                To exercise these rights, please contact us at prabhavalayam@gmail.com.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">8. Cookies and Tracking Technologies</h2>
              <p className="text-muted-foreground leading-relaxed mb-2">
                We use cookies and similar technologies to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Maintain your login session</li>
                <li>Remember your preferences</li>
                <li>Analyze usage patterns and improve our Service</li>
                <li>Provide personalized content and recommendations</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-2">
                You can control cookies through your browser settings, but disabling cookies may affect certain features of our Service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">9. Third-Party Links</h2>
              <p className="text-muted-foreground leading-relaxed">
                Our Service may contain links to third-party websites or services. We are not responsible for the privacy practices of these third parties. We encourage you to review their privacy policies before providing any personal information.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">10. Children's Privacy</h2>
              <p className="text-muted-foreground leading-relaxed">
                Our Service is not intended for individuals under 18 years of age. We do not knowingly collect personal information from children. If we discover that we have collected information from a child, we will delete it immediately.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">11. Changes to This Privacy Policy</h2>
              <p className="text-muted-foreground leading-relaxed">
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Effective Date" at the top. Your continued use of the Service after changes are posted constitutes acceptance of the updated policy.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">12. International Users</h2>
              <p className="text-muted-foreground leading-relaxed">
                Our Service is operated in India and governed by Indian law. If you access the Service from outside India, please be aware that your information may be transferred to, stored, and processed in India. By using our Service, you consent to such transfer and processing.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">13. Contact Us</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:
              </p>
              <ul className="list-none space-y-2 text-muted-foreground">
                <li><strong>Email:</strong> prabhavalayam@gmail.com</li>
                <li><strong>Phone:</strong> +91 9061540651</li>
                <li><strong>Help Center:</strong> Available via the app or website</li>
              </ul>
            </section>

            <div className="bg-primary/10 p-6 rounded-lg mt-8">
              <p className="text-center text-foreground font-medium">
                By using Get It Done, you acknowledge that you have read and understood this Privacy Policy and agree to its terms.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;

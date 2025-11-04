import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/enhanced-button';
import { ArrowLeft } from 'lucide-react';

const TermsAndConditionsPage: React.FC = () => {
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
            <CardTitle className="text-3xl font-bold text-center">Terms & Conditions</CardTitle>
            <p className="text-center text-muted-foreground mt-2">Effective Date: 05-11-2025</p>
          </CardHeader>
          
          <CardContent className="prose prose-sm max-w-none space-y-6">
            <section>
              <h2 className="text-2xl font-semibold mb-3">1. Introduction</h2>
              <p className="text-muted-foreground leading-relaxed">
                Welcome to Get It Done ("Platform," "we," "us," or "our"). By using our website, web app, or any related products or services ("Service," "App"), you ("User" or "Helper") agree to abide by these Terms & Conditions. Please read these Terms carefully before using our Platform.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">2. Account Registration & Eligibility</h2>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>You must provide accurate, current, and complete information during registration.</li>
                <li>Helpers must submit authentic KYC documents, which are subject to admin review and approval before account activation.</li>
                <li>You are solely responsible for maintaining the confidentiality of your login credentials.</li>
                <li>Accounts may be suspended or terminated for false information, fraud, or policy violations.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">3. Subscription & Platform Access</h2>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Services such as posting tasks, searching helpers, and in-app messaging are available only to users with an active subscription.</li>
                <li>Subscription options: ₹99/month or ₹999/year.</li>
                <li>Subscription payments are processed securely within the app.</li>
                <li>The Platform does not charge any commission or fee per task; all other financial transactions are handled directly between Users and Helpers.</li>
                <li>Subscription cancellations and refunds follow our Refund Policy.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">4. Service Transactions</h2>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>The Platform acts as an intermediary to connect Users and Helpers.</li>
                <li>All service-related payments for tasks are transacted directly between Users and Helpers, outside of the Platform.</li>
                <li>The Platform assumes NO responsibility for payment disputes, incomplete jobs, or service outcomes between Users and Helpers.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">5. Posting, Acceptance, & Task Fulfillment</h2>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Users may post tasks with clear, accurate descriptions, and Helpers may accept tasks for which they are qualified.</li>
                <li>Users and Helpers must communicate and coordinate using the App's provided tools.</li>
                <li>Helpers agree to deliver services professionally, safely, and in accordance with all laws and platform guidelines.</li>
                <li>Users are responsible for timely and complete payment directly to Helpers.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">6. Ratings, Reviews, & Conduct</h2>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Users may rate and review Helpers following task completion.</li>
                <li>All participants must maintain respectful, non-discriminatory conduct at all times.</li>
                <li>Abusive, illegal, or fraudulent behavior may result in account suspension or permanent removal.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">7. Helper Responsibilities & Verification</h2>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Helpers must only accept tasks they are able to perform.</li>
                <li>KYC documents must be genuine and are subject to admin approval.</li>
                <li>Helpers are solely responsible for meeting any legal, tax, or regulatory obligations related to their earnings and services.</li>
                <li>Helpers must adhere to platform policies and code of conduct.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">8. Platform Rights & Updates</h2>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>The Platform reserves the right to modify, suspend, or discontinue access to any account or feature, at its sole discretion, with or without notice.</li>
                <li>Terms may be updated periodically; continued use of the Platform implies acceptance of the revised terms.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">9. Liability & Dispute Resolution</h2>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Get It Done is NOT liable for personal injury, property loss, damages, or any claims resulting from the interactions or agreements between Users and Helpers.</li>
                <li>For issues related strictly to subscription payments or platform access, Users should contact support@getitdone.in or use our Help Center; such disputes will be handled by our admin review process.</li>
                <li>The Platform does not mediate, guarantee, or accept responsibility for disputes regarding payments, service quality, or task fulfillment between Users and Helpers.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">10. Privacy & Data Protection</h2>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Personal information is collected and used in accordance with our <Link to="/privacy-policy" className="text-primary hover:underline">Privacy Policy</Link>.</li>
                <li>KYC documents, personal data, and communication are securely stored and never shared or sold to third parties.</li>
                <li>Payment information for subscriptions is processed only by reputable third-party gateways; the Platform does not store banking or card details.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">11. Governing Law</h2>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>These Terms & Conditions are governed by the laws of India.</li>
                <li>All disputes regarding Platform use are subject to the exclusive jurisdiction of the courts of India.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">12. Contact Information</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                For questions about these Terms & Conditions, please contact our support team:
              </p>
              <ul className="list-none space-y-2 text-muted-foreground">
                <li><strong>Email:</strong> prabhavalayam@gmail.com</li>
                <li><strong>Phone:</strong> +91 9061540651</li>
                <li><strong>Help Center:</strong> Available via the app or website</li>
              </ul>
            </section>

            <div className="bg-primary/10 p-6 rounded-lg mt-8">
              <p className="text-center text-foreground font-medium">
                By registering for and using the Get It Done Platform, you agree to be bound by all the above Terms & Conditions.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TermsAndConditionsPage;

"use client";
import BackButton from "@/components/shared/BackButton";
import React from "react";

const Page = () => {
  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <div className="text-dark100_light900 card-wrapper w-full max-w-4xl rounded-lg p-8 shadow-md">
        <h1 className="mb-6 text-center text-4xl font-bold">Privacy Policy</h1>
        <p className="mb-6 text-center text-sm text-gray-600">
          Effective Date: 01/06/2024
        </p>
        <p className="mb-6">
          Thank you for choosing The Skill Guru (&quot;we&quot;,
          &quot;our&quot;, &quot;us&quot;). This Privacy Policy outlines how we
          collect, use, and protect your personal information when you use our
          website and services.
        </p>
        <h2 className="mb-4 text-2xl font-semibold">
          1. Information We Collect
        </h2>
        <p className="mb-4">
          <strong>Personal Information:</strong> When you register on our
          website or use our services, we may collect personal information such
          as your name, email address, and any other information you voluntarily
          provide.
        </p>
        <p className="mb-4">
          <strong>Usage Data:</strong> We may collect information about your
          interaction with our website, such as the pages visited, time spent,
          and referring pages.
        </p>
        <p className="mb-4">
          <strong>Communication Data:</strong> If you contact us directly, we
          may keep a record of that correspondence.
        </p>
        <h2 className="mb-4 text-2xl font-semibold">2. Use of Information</h2>
        <p className="mb-4">
          <strong>To Provide Services:</strong> We use your personal information
          to provide and personalize our services, including connecting you with
          Gurus for learning sessions.
        </p>
        <p className="mb-4">
          <strong>Communication:</strong> We may use your contact information to
          communicate with you about our services, updates, and promotional
          offers.
        </p>
        <p className="mb-4">
          <strong>Improvement:</strong> We use collected data to analyze trends
          and improve our website and services.
        </p>
        <h2 className="mb-4 text-2xl font-semibold">
          3. Sharing of Information
        </h2>
        <p className="mb-4">
          <strong>Service Providers:</strong> We may share your information with
          third-party service providers who assist us in providing our services.
        </p>
        <p className="mb-4">
          <strong>Legal Compliance:</strong> We may disclose your information if
          required by law or to protect our rights or the rights of others.
        </p>
        <h2 className="mb-4 text-2xl font-semibold">4. Security</h2>
        <p className="mb-4">
          We implement reasonable security measures to protect your personal
          information from unauthorized access, use, or disclosure.
        </p>
        <h2 className="mb-4 text-2xl font-semibold">5. Your Choices</h2>
        <p className="mb-4">
          You can review, update, or delete your personal information by
          contacting us. You may also unsubscribe from receiving promotional
          emails.
        </p>
        <h2 className="mb-4 text-2xl font-semibold">
          6. Changes to This Policy
        </h2>
        <p className="mb-4">
          We may update this Privacy Policy from time to time. We will notify
          you of any changes by posting the new policy on our website.
        </p>

        <BackButton />
      </div>
    </div>
  );
};

export default Page;

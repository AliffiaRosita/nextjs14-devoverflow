"use client";
import React from "react";
import BackButton from "@/components/shared/BackButton";

const Page = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-6">
      <div className="w-full max-w-4xl rounded-lg bg-white p-8 shadow-md">
        <h1 className="mb-6 text-center text-4xl font-bold">
          Terms of Service
        </h1>
        <h2 className="mb-4 text-2xl font-semibold">
          1. Description of Service
        </h2>
        <p className="mb-4">
          The Skill Guru provides a platform for free, live 1:1 instant learning
          sessions with top Gurus. Our mission is to provide free literacy and
          teach essential skills such as discipline, time management, and
          honesty through our platform.
        </p>
        <h2 className="mb-4 text-2xl font-semibold">2. User Conduct</h2>
        <p className="mb-4">
          Users must be respectful and adhere to our community guidelines. Users
          are responsible for the content they upload or share on the platform.
        </p>
        <h2 className="mb-4 text-2xl font-semibold">3. Service Availability</h2>
        <p className="mb-4">
          While we strive to provide uninterrupted service, we do not guarantee
          that our platform will always be available or error-free.
        </p>
        <h2 className="mb-4 text-2xl font-semibold">
          4. Intellectual Property
        </h2>
        <p className="mb-4">
          All content and materials on our website are owned or licensed by The
          Skill Guru. Users may not reproduce or distribute any content without
          permission.
        </p>
        <h2 className="mb-4 text-2xl font-semibold">
          5. Limitation of Liability
        </h2>
        <p className="mb-4">
          We are not liable for any direct, indirect, incidental, special, or
          consequential damages arising out of or in any way connected with the
          use of our services.
        </p>
        <h2 className="mb-4 text-2xl font-semibold">6. Governing Law</h2>
        <p className="mb-4">
          These Terms of Service are governed by the laws of India, without
          regard to its conflict of law provisions.
        </p>
        <h2 className="mb-4 text-2xl font-semibold">Contact Us</h2>
        <p className="mb-4">
          If you have any questions about this Privacy Policy or our Terms of
          Service, please contact us at{" "}
          <a
            href="mailto:notifications@theskillguru.org"
            className="text-blue-500"
          >
            notifications@theskillguru.org
          </a>
          .
        </p>

        <BackButton />
      </div>
    </div>
  );
};

export default Page;

"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const journeyPhases = [
  {
    title: "Learning to Think in Numbers",
    companies: "PharmEasy & HackerRank",
    content:
      "I started by working closely with product and analytics teams, building dashboards, running cohort analyses, and measuring ROI. This phase taught me to see user behavior through data and always link product decisions to measurable impact.",
    tag: "Data-first mindset",
  },
  {
    title: "Understanding Systems and Operations",
    companies: "Anarock",
    content:
      "I worked on CRM and internal finance tools that powered business teams. This taught me that products are systems — they must integrate workflows, operations, and real-world constraints.",
    tag: "Operational product thinking",
  },
  {
    title: "Building for Scale",
    companies: "Spinny",
    content:
      "Here I focused on retention, lifecycle communication, dealer experience, and pricing workflows. I learned how incentives, marketplaces, and communication shape user behavior at scale.",
    tag: "Growth & retention builder",
  },
  {
    title: "End-to-End Product Ownership",
    companies: "NewMe",
    content:
      "I owned growth loops, rewards systems, referral programs, POS infrastructure, and post-purchase CX. This phase brought everything together — growth, operations, customer experience, and 0→1 product building.",
    tag: "0→1 and scale",
  },
];

const pmStylePoints = [
  "Data-informed but user-empathetic",
  "Strong in building 0→1 systems",
  "Think in incentives and behavioral mechanics",
  "Care deeply about operational realities",
];

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
};

export default function JourneyPage() {
  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      {/* Header Section */}
      <section className="pt-16 sm:pt-24 pb-12 sm:pb-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight"
          >
            My Product Journey
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="mt-4 text-lg sm:text-xl text-gray-400"
          >
            How each phase shaped the way I build products
          </motion.p>
        </div>
      </section>

      {/* Intro Section */}
      <section className="pb-16 sm:pb-20 px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          <p className="text-base sm:text-lg text-gray-300 leading-relaxed max-w-3xl">
            My career has evolved from analytics and internal systems to growth,
            customer experience, and full-stack product ownership. Each phase
            shaped how I think about building products that balance users,
            business, and operations.
          </p>
        </motion.div>
      </section>

      {/* Timeline Section */}
      <section className="pb-20 sm:pb-28 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-4 sm:left-8 top-0 bottom-0 w-px bg-gradient-to-b from-purple-500/50 via-blue-500/50 to-purple-500/50" />

            {/* Timeline Items */}
            <div className="space-y-8 sm:space-y-12">
              {journeyPhases.map((phase, index) => (
                <motion.div
                  key={phase.title}
                  {...fadeInUp}
                  transition={{ delay: 0.1 * index, duration: 0.5 }}
                  className="relative pl-12 sm:pl-20"
                >
                  {/* Timeline Dot */}
                  <div className="absolute left-2 sm:left-6 top-8 w-4 h-4 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 border-4 border-neutral-950 z-10" />

                  {/* Card */}
                  <div className="p-6 sm:p-8 rounded-xl border border-neutral-800 bg-neutral-900/50 hover:border-neutral-700 transition-colors">
                    {/* Phase Number */}
                    <span className="text-sm font-medium text-purple-400 mb-2 block">
                      Phase {index + 1}
                    </span>

                    {/* Title */}
                    <h3 className="text-xl sm:text-2xl font-semibold text-white mb-2">
                      {phase.title}
                    </h3>

                    {/* Companies */}
                    <p className="text-sm text-gray-500 mb-4">{phase.companies}</p>

                    {/* Content */}
                    <p className="text-gray-300 leading-relaxed mb-5">
                      {phase.content}
                    </p>

                    {/* Tag */}
                    <span className="inline-block px-3 py-1.5 rounded-full text-xs font-medium bg-purple-500/10 text-purple-400 border border-purple-500/20">
                      {phase.tag}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PM Style Section */}
      <section className="pb-20 sm:pb-28 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.h2
            {...fadeInUp}
            transition={{ duration: 0.5 }}
            className="text-2xl sm:text-3xl font-bold text-white mb-10 sm:mb-12 text-center"
          >
            How This Journey Shaped My PM Style
          </motion.h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {pmStylePoints.map((point, index) => (
              <motion.div
                key={point}
                {...fadeInUp}
                transition={{ delay: 0.1 * index, duration: 0.5 }}
                className="p-5 sm:p-6 rounded-xl border border-neutral-800 bg-neutral-900/50 hover:border-neutral-700 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center mt-0.5">
                    <svg
                      className="w-3.5 h-3.5 text-purple-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <p className="text-gray-200 font-medium">{point}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Resume CTA & Back Link */}
      <section className="pb-16 sm:pb-20 px-6">
        <div className="max-w-4xl mx-auto space-y-8">
          <motion.div
            {...fadeInUp}
            transition={{ duration: 0.5 }}
          >
            <a
              href="/Hrithik_Jain_Resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-purple-500/30 text-purple-400 font-medium hover:bg-purple-500/10 hover:border-purple-500/50 transition-colors"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              View Resume
            </a>
          </motion.div>

          <motion.div
            {...fadeInUp}
            transition={{ duration: 0.5 }}
          >
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors group"
            >
              <svg
                className="w-4 h-4 transition-transform group-hover:-translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Back to Home
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

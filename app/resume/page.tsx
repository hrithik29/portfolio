export default function ResumePage() {
  return (
    <div className="min-h-screen pt-24 pb-16 px-6" style={{ backgroundColor: "#0b0f17" }}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-white">Resume</h1>
          <a
            href="/hrithik_pm_res.pdf"
            download
            className="px-6 py-3 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold text-sm hover:opacity-90 transition-opacity"
          >
            Download Resume
          </a>
        </div>

        {/* PDF Viewer - resume content only, no toolbar */}
        <div className="rounded-2xl overflow-hidden border border-white/10" style={{ height: "90vh" }}>
          <iframe
            src="/hrithik_pm_res.pdf#toolbar=0&navpanes=0&scrollbar=0&view=FitH"
            className="w-full h-full"
            title="Hrithik Jain Resume"
          />
        </div>

      </div>
    </div>
  );
}

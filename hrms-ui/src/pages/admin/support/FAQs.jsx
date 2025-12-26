import { useState, useMemo, useEffect } from "react";

const PAGE_SIZE = 10;

export default function FAQs() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const faqs = [
    /* ===== SAME DATA (UNCHANGED) ===== */
    {
      id: 1,
      question: "How do I access assessments?",
      answer:
        "Login to the TMS dashboard, navigate to the Assessments module, and select the active assessment assigned to your course or batch. Only scheduled assessments will be visible.",
      category: "Assessments",
    },
    {
      id: 2,
      question: "Why is an assessment not visible to me?",
      answer:
        "Assessments are visible only if they are published, assigned to your batch, and within the scheduled date and time. Please verify your batch allocation or contact support.",
      category: "Assessments",
    },
    {
      id: 3,
      question: "Can I retake an assessment?",
      answer:
        "Retakes depend on institute policy. If enabled by the Admin or Educator, a retake option will appear. Otherwise, please raise a support ticket.",
      category: "Assessments",
    },
    {
      id: 4,
      question: "How are assessment results calculated?",
      answer:
        "Results are calculated based on correct answers, total marks, negative marking (if applicable), and evaluation rules defined by the educator.",
      category: "Assessments",
    },
    {
      id: 5,
      question: "How do I pay course fees?",
      answer:
        "Go to the Payments section from the sidebar, select the pending invoice, and complete the payment using the available online payment methods.",
      category: "Payments",
    },
    {
      id: 6,
      question: "What happens if my payment fails?",
      answer:
        "If a payment fails, the amount is not deducted. You can retry the payment from the Payments section or contact the Finance team if the issue persists.",
      category: "Payments",
    },
    {
      id: 7,
      question: "How can I download my payment receipt?",
      answer:
        "Once payment is successful, receipts can be downloaded from the Payments History section for your records.",
      category: "Payments",
    },
    {
      id: 8,
      question: "How is attendance marked?",
      answer:
        "Attendance is marked by the educator during live or scheduled sessions. Students can view attendance status in the Attendance Dashboard.",
      category: "Attendance",
    },
    {
      id: 9,
      question: "Why is my attendance showing as absent?",
      answer:
        "Attendance may show absent if you joined late, missed the session, or due to a technical issue. Contact your educator for clarification.",
      category: "Attendance",
    },
    {
      id: 10,
      question: "Can attendance be corrected?",
      answer:
        "Yes, educators or admins can manually correct attendance after verification. Raise a request if you believe there is an error.",
      category: "Attendance",
    },
    {
      id: 11,
      question: "How do I access course materials?",
      answer:
        "Course materials are available under Course Management → Syllabus & Content.",
      category: "Courses",
    },
    {
      id: 12,
      question: "Who can create or edit courses?",
      answer:
        "Only Admin users have permission to create, edit, or archive courses in the system.",
      category: "Courses",
    },
    {
      id: 13,
      question: "How do I raise a support ticket?",
      answer:
        "Navigate to Help & Support → Support Tickets and submit your issue.",
      category: "Support",
    },
    {
      id: 14,
      question: "How long does support take to respond?",
      answer:
        "Support tickets are typically responded to within 24 working hours.",
      category: "Support",
    },
    {
      id: 15,
      question: "How do announcements work?",
      answer:
        "Announcements are published by Admins or Educators and shown based on selected audience.",
      category: "Notifications",
    },
    {
      id: 16,
      question: "Can I receive notifications on mobile?",
      answer:
        "Mobile and WhatsApp notifications may be enabled if configured by the institute.",
      category: "Notifications",
    },
    {
      id: 17,
      question: "Who can view security audit logs?",
      answer:
        "Only Admin users have access to Security & Audit logs.",
      category: "Security",
    },
    {
      id: 18,
      question: "What activities are tracked in audit logs?",
      answer:
        "Login attempts, updates, assessment actions, and payment activities are tracked.",
      category: "Security",
    },
    {
      id: 19,
      question: "How do I update institute profile details?",
      answer:
        "Admins can update institute details from Settings → Institute Profile.",
      category: "Settings",
    },
    {
      id: 20,
      question: "What should I do if I face login issues?",
      answer:
        "Verify credentials, clear cache, and contact support if needed.",
      category: "General",
    },
    {
      id: 21,
      question: "Can multiple users log in from the same account?",
      answer:
        "Multiple logins may be restricted for security reasons.",
      category: "Security",
    },
  ];

  /* ===== SEARCH FILTER ===== */
  const filtered = useMemo(() => {
    return faqs.filter(
      (f) =>
        f.question.toLowerCase().includes(search.toLowerCase()) ||
        f.category.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  /* ===== PAGINATION ===== */
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginatedFaqs = filtered.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  useEffect(() => {
    setPage(1);
  }, [search]);

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">FAQs</h1>
        <p className="text-sm text-gray-500">
          Frequently asked questions and system guidance
        </p>
      </div>

      {/* Search */}
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search FAQs by keyword or category..."
        className="w-full px-4 py-2.5 rounded-xl bg-white/70 border focus:ring-2 focus:ring-purple-300 outline-none"
      />

      {/* FAQ GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {paginatedFaqs.map((f) => (
          <div
            key={f.id}
            className="bg-white/70 backdrop-blur border rounded-2xl p-5 shadow"
          >
            <h3 className="font-semibold text-gray-800">
              {f.question}
            </h3>
            <p className="text-sm text-gray-600 mt-2">
              {f.answer}
            </p>
            <span className="text-xs text-purple-600 mt-2 inline-block">
              {f.category}
            </span>
          </div>
        ))}
      </div>

      {/* EMPTY STATE */}
      {filtered.length === 0 && (
        <div className="text-center text-gray-500 py-10">
          No FAQs match your search
        </div>
      )}

      {/* PAGINATION CONTROLS */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 pt-4">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-4 py-2 rounded-full border disabled:opacity-50"
          >
            Prev
          </button>

          <span className="text-sm text-gray-600">
            Page {page} of {totalPages}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="px-4 py-2 rounded-full border disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

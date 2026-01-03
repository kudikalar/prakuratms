export const getStudentAttendance = async (req, res) => {
  try {
    const studentId = req.user.id; // from JWT
    const { month } = req.query;

    // 🔧 TEMP MOCK (until DB)
    const records = [
      { date: `${month}-02`, status: "Present" },
      { date: `${month}-03`, status: "Absent" },
      { date: `${month}-04`, status: "Late" },
      { date: `${month}-05`, status: "Present" },
    ];

    res.json({
      student: {
        name: req.user.name,
        email: req.user.email,
        roll: "PKR-1029",
        batch: "Cyber Security – Jan 2025",
      },
      records,
    });
  } catch (err) {
    res.status(500).json({
      message: "Failed to load attendance",
    });
  }
};

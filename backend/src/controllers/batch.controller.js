import Batch from "../models/Batch.js";

export const createBatch = async (req, res) => {
  try {
    const batch = await Batch.create(req.body);

    res.status(201).json({
      success: true,
      message: "Batch created successfully",
      batch,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message || "Failed to create batch",
    });
  }
};

export const getBatches = async (req, res) => {
  const filter = req.query.courseId
    ? { courseId: req.query.courseId, isActive: true }
    : { isActive: true };

  const batches = await Batch.find(filter).populate("courseId");

  res.json({ success: true, batches });
};

import BatchAllocation from "../models/BatchAllocation.js";

export const assignEducatorToBatch = async (req, res) => {
  const allocation = await BatchAllocation.create(req.body);

  res.status(201).json({
    success: true,
    message: "Educator assigned to batch",
    allocation,
  });
};

export const getEducatorBatches = async (req, res) => {
  const data = await BatchAllocation.find({
    educatorId: req.user.id,
  }).populate({
    path: "batchId",
    populate: { path: "courseId" },
  });

  res.json({ success: true, batches: data });
};

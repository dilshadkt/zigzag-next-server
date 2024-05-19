const { Work } = require("../model/WorkSchema");

const getAllCategory = async (req, res) => {
  const pipeline = [
    {
      $group: {
        _id: null, // Group all documents together
        uniqueTypes: { $addToSet: { $trim: { input: "$type" } } }, // Add unique trimmed types to the set
      },
    },
    {
      $project: {
        _id: 0, // Exclude the _id field from the output
        uniqueTypes: 1, // Include the uniqueTypes field in the output
      },
    },
  ];
  const allCategory = await Work.aggregate(pipeline);
  res.status(200).json({ category: allCategory[0].uniqueTypes });
};

module.exports = { getAllCategory };

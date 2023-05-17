const mongoose = require("mongoose");

const subRegionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: Array,
    },

    packagebooking: {
      type: String,
      required: true,
      trim: true,
    },

    nonpackagebooking: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SubRegion", subRegionSchema);

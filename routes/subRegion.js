var express = require("express");
var router = express.Router();
var multer = require("multer");
var SubRegion = require("../models/sub-region");
var { wrapAsync } = require("../helper/catchHandler");

//file or image upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/");
  },

  filename: function (req, file, cb) {
    cb(null, Date.now() + "_" + file.originalname);
  },
});

//filtering the requested file
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
    console.log("Image should be in jpeg || png || jpg format");
  }
};

//limiting the size of file
const uploads = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
  fileFilter: fileFilter,
});

const type = uploads.array("image", 3);

//routes
router.post(
  "/",
  type,
  wrapAsync(async (req, res) => {
    if (!req.files) {
      return res.status(400).json({
        status: "fail",
        data: { image: "No images selected" },
      });
    }
    // console.log(req.files);
    const subRegionDetails = {
      title: req.body.title,
      description: req.body.description,
      image: req.files.map((item) => item.path),
      packagebooking: req.body.packagebooking,
      nonpackagebooking: req.body.nonpackagebooking,
    };
    const subRegions = new SubRegion(subRegionDetails);
    const result = await subRegions.save();
    return res.status(200).json(result);
  })
);

router.get(
  "/",
  wrapAsync(async (req, res) => {
    const subRegions = await SubRegion.find();
    return res.json(subRegions);
  })
);

router.patch(
  "/:id",
  type,
  wrapAsync(async (req, res) => {
    const subRegionId = req.params.id;
    const subRegion = await SubRegion.findById(subRegionId);
    if (!subRegion) {
      return res.status(404).json({
        message: "Sub-Region not found",
      });
    }
    if (req.files) {
      subRegion.image = req.files.map((item) => item.path);
    }
    Object.assign(subRegion, req.body);
    await subRegion.save();
    return res.json(subRegion);
  })
);

router.delete(
  "/:id",
  wrapAsync(async (req, res) => {
    const subRegionId = req.params.id;
    const subRegion = await SubRegion.findById(subRegionId);
    if (!subRegion) {
      return res.status(404).json({
        message: "Sub-Region not found",
      });
    }
    await SubRegion.deleteOne({ _id: subRegionId });
    return res.json({ status: "sucess", message: "Sub-Region deleted" });
  })
);

module.exports = router;

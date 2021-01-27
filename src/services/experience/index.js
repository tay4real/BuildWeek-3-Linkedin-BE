const express = require("express");
const mongoose = require("mongoose");
const q2m = require("query-to-mongo");
const Json2csvParser = require("json2csv").Parser;
const fs = require("fs");
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");

const cloudinary = require("./cloudinary");

const experienceModel = require("./schema");
const profileModel = require("../profile/profileSchema");

const router = require("express").Router();

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "linkedIn",
  },
});
const cloudinaryMulter = multer({ storage: storage });

router.get("/:userName", async (req, res, next) => {
  try {
    const user = await profileModel.find({ username: req.params.userName });

    const id = await user[0]._id;

    const experience = await experienceModel.find({ profiles: id });

    res.send(experience);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

router.post(
  "/:userName",
  cloudinaryMulter.single("image"),
  async (req, res, next) => {
    try {
      const user = await profileModel.find({ username: req.params.userName });

      const id = await user[0]._id;
      const updated = await experienceModel.findOneAndUpdate(
        { profiles: id },
        {
          $set: {
            image: req.file.path,
          },
        },
        { runValidators: true, new: true }
      );
      res.status(201).send(updated);
    } catch (error) {
      next(error);
    }
  }
);

router.get("/experiences/:expId", async (req, res, next) => {
  try {
    // const user = await profileModel.find({ username: req.params.userName });

    // const id = await user[0]._id;
    const exp = await experienceModel.findById(req.params.expId);
    console.log(exp);
    res.send(exp);
  } catch (error) {
    next(error);
  }
});

router.put("/:expId", async (req, res, next) => {
  try {
    const modifiedExp = await experienceModel.findByIdAndUpdate(
      req.params.expId,
      req.body,
      {
        runValidators: true,
        new: true,
      }
    );
    if (modifiedExp) {
      res.send(modifiedExp);
    } else {
      next();
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});
router.delete("/:expId", async (req, res, next) => {
  try {
    // const user = await profileModel.findOne({ username: req.params.userName });

    // const id = await user._id;
    // { $pull: { results: { score: 8 , item: "B" } } }
    const modifiedExp = await experienceModel.findByIdAndDelete(
      req.params.expId
    );

    res.send(modifiedExp);
  } catch (error) {
    next(error);
  }
});
router.get("/:userName/experiences/CSV", async (req, res, next) => {
  try {
    const user = await profileModel.find({ username: req.params.userName });

    const id = await user[0]._id;

    const experience = await experienceModel.find({ profiles: id });

    const fields = ["role", "company", "description", "startDate"];
    const json2csvParser = new Json2csvParser({ fields });
    const csvData = json2csvParser.parse(experience);

    fs.writeFile("experiences.csv", csvData, function (error) {
      if (error) throw error;
      console.log("CSV generated successfully!");
    });
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=experiences.csv"
    ); // prompts out the "save on disk" window on browsers
  } catch (error) {
    console.log(error);
    next(error);
  }
});

module.exports = router;

const express = require("express");
const mongoose = require("mongoose");
const experienceModel = require("./schema");
const { createReadStream } = require("fs-extra");

const { Transform } = require("json2csv");
const { pipeline } = require("stream");
const router = require("express").Router();

router.get("/profile/:userName/experiences", async (req, res, next) => {
  try {
    const exp = await experienceModel.findOne({
      userName: req.params.userName,
    });
    res.send(exp);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

router.post("/profile/:userName/experiences", async (req, res, next) => {
  try {
    const newExp = new experienceModel(req.body);

    const updated = await experienceModel.findOneAndUpdate(
      { userName: req.params.userName },

      newExp,

      { runValidators: true, new: true }
    );
    res.status(201).send(updated);
  } catch (error) {
    next(error);
  }
});

router.get("/profile/:userName/experiences/:expId", async (req, res, next) => {
  try {
    const experience = await experienceModel.find({
      $and: [{ userName: req.params.userName }, { _id: req.params.expId }],
    });
    console.log(experience);
    res.send(experience);
  } catch (error) {
    next(error);
  }
});

router.put("/profile/:userName/experiences/:expId", async (req, res, next) => {
  try {
    const modifiedExp = await experienceModel.findOneAndUpdate(
      {
        $and: [{ userName: req.params.userName }, { _id: req.params.expId }],
      },
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
router.delete(
  "/profile/:userName/experiences/:expId",
  async (req, res, next) => {
    try {
      const exp = await experienceModel.findOneAndDelete({
        $and: [{ userName: req.params.userName }, { _id: req.params.expId }],
      });
      if (exp) {
        res.send(exp);
      } else {
        next();
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
);
router.get("/profile/:userName/experiences/CSV", async (req, res, next) => {
  try {
    // SOURCE (FILE ON DISK) --> TRANSFORM (.json into .csv) --> DESTINATION (HTTP Res)
    const exp = await experienceModel.find();
    const source = createReadStream(exp);

    const transformJsonIntoCsv = new Transform({
      fields: ["role", "company", "description", "startDate"],
    });

    res.setH4eader("Content-Disposition", "attachment; filename=whatever.csv"); // prompts out the "save on disk" window on browsers

    pipeline(source, transformJsonIntoCsv, res, (err) => {
      if (err) {
        console.log(err);
        next(err);
      } else {
        console.log("done");
      }
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
});

module.exports = router;

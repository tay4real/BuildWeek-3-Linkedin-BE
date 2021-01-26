const express = require("express");
const mongoose = require("mongoose");
const q2m = require("query-to-mongo");
const experienceModel = require("./schema");
const { createReadStream } = require("fs-extra");

const { Transform } = require("json2csv");
const { pipeline } = require("stream");
const router = require("express").Router();

router.get("/:userName", async (req, res, next) => {
  try {
    const query = q2m(req.query);
    const total = await experienceModel.countDocuments(query.criteria);
    const experience = await experienceModel
      .find({ profiles: req.params.userName } || query.criteria)
      .sort(query.options.sort)
      .skip(query.options.skip)
      .limit(query.options.limit)
      .populate("profiles");

    res.send({ links: query.links("/experiences", total), experience });
  } catch (error) {
    console.log(error);
    next(error);
  }
});

router.post("/:userName", async (req, res, next) => {
  try {
    const exp = req.body;
    console.log(exp);
    exp.profiles = req.params.userName;
    const newExp = new experienceModel(exp);

    const { _id } = await newExp.save();
    res.status(201).send(_id);
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

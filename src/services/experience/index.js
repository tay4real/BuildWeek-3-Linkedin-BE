const router = require('express').Router()

router.get('/', async(req,res,next)=> {
    res.send('ok')
})

<<<<<<< Updated upstream
module.exports = router
=======
const { Transform } = require("json2csv");
const { pipeline } = require("stream");
const router = require("express").Router();

router.get("/:userName", async (req, res, next) => {
  try {
    const user = await profileModel.find({ username: req.params.userName });
    
    const id = await user[0]._id;

    const experience = await experienceModel.findOne({ profiles: id });
    res.send(experience);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

router.post("/:userName", async (req, res, next) => {
  try {
    const user = await profileModel.find({ username: req.params.userName });

    const id = await user[0]._id;

    const exp = req.body;
    exp.profiles = [id];

    const newExp = new experienceModel(exp);

    const { _id } = await newExp.save();
    res.status(201).send(_id);
  } catch (error) {
    next(error);
  }
});

router.get("/:userName/experiences/:expId", async (req, res, next) => {
  try {
    const user = await profileModel.findOne({ username: req.params.userName });

    const id = await user._id;
    const exp = await experienceModel.findOne(
      { _id: mongoose.Types.ObjectId(req.params.expId) }, // converts id as a string into id as an ObjectId
      {
        // projection
        profiles: {
          $elemMatch: { _id: mongoose.Types.ObjectId(id) }, // returns just the element of the array that matches this _id condition
        },
      }
    );
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
    // SOURCE (FILE ON DISK) --> TRANSFORM (.json into .csv) --> DESTINATION (HTTP Res)
    const user = await profileModel.findOne({ username: req.params.userName });

    const id = await user._id;

    const experience = await experienceModel.findOne({ profiles: id });

    const source = createReadStream(experience);

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
>>>>>>> Stashed changes

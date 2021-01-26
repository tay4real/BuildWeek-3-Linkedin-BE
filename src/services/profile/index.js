const router = require("express").Router();
const profileSchema = require("./profileSchema");
const fs = require("fs");
const PDFDocument = require("pdfkit");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("./cloudinary_setup");
const { findOneAndUpdate } = require("./profileSchema");
const multer = require("multer");


const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "propics"
  },
});

const cloudinaryMulter = multer({ storage: storage });

router.get("/", async (req, res, next) => {
  try {
    const profile = await profileSchema.find();
    res.send(profile);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const profile = await profileSchema.findById(req.params.id);
    res.send(profile);
  } catch (error) {
    next(error);
  }
});
router.get("/:id/cv", async (req, res, next) => {
  try {
    const profile = await profileSchema.findById(req.params.id);
    let doc = new PDFDocument();
    doc.pipe(res);
    doc.text(
      `
    Name: ${profile.name},
    Surname: ${profile.surname}, 
    email: ${profile.email},
    biography: ${profile.bio} primarily in ${profile.area},
    title: ${profile.title},
    Experience: ${"Here will be the experience"}
     `,
      100,
      100
    );
    doc.end();
    await res.writeHead(200, {
      "Content-Type": "application/pdf",
    });
    res.status(201).send("OK");
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const newUser = new profileSchema(req.body);
    const { _id } = await newUser.save();

    res.status(201).send(newUser);
  } catch (error) {
    next(error);
  }
});

router.post("/:id/propic", cloudinaryMulter.single('image'), async (req, res, next) => {
  try {
    let img_path = await req.file.path
    console.log("IMAGE STORED IN : ", img_path)
    //const profile = await profileSchema.find({_id: req.params.id})
    await profileSchema.findByIdAndUpdate(req.params.id, {image: img_path},
      {
        runValidators: true,
        returnOriginal: false,
        useFindAndModify: false,
      }
      )
    res.send(img_path)
  } catch (error) {
    next(error);
  }
});



router.put("/:id", async (req, res, next) => {
  try {
    const profile = await profileSchema.findByIdAndUpdate(
      req.params.id, //this is what to look for
      req.body, //this is what to update it to
      {
        runValidators: true,
        returnOriginal: false,
        useFindAndModify: false,
      }
    );
    res.send(profile);
  } catch (error) {
    next(error);
  }
});

module.exports = router;

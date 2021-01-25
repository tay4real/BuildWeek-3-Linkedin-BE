const router = require("express").Router();
const profileSchema = require("./profileSchema");
const PDFDocument = require("pdfkit");
const blobStream  = require('blob-stream');
const { createWriteStream } = require("fs-extra")

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
// router.get("/:id/cv", async (req, res, next) => {
    
    
//   try {
//     const profile = await profileSchema.findById(req.params.id);
//     const doc = new PDFDocument();
//     doc.pipe(res)
//     let stream = doc.pipe(blobStream());
//     doc.pipe(await createWriteStream("output.pdf"));
//     doc.text(`Name: ${profile.name}`, 100, 100);
//     doc.end();
//     stream.on('finish', function() {
//         iframe.src = stream.toBlob('application/pdf');
//       });
//     res.send("PDF created")
//   } catch (error) {
//     next(error);
//   }
// });
/* 
{
        "_id": "5d84937322b7b54d848eb41b", //server generated
        "name": "Diego",
        "surname": "Banovaz",
        "email": "diego@strive.school",
        "bio": "SW ENG",
        "title": "COO @ Strive School",
        "area": "Berlin",
        "image": ..., //server generated on upload, set a default here
        "username": "admin",
        "createdAt": "2019-09-20T08:53:07.094Z", //server generated
        "updatedAt": "2019-09-20T09:00:46.977Z", //server generated
    }
*/

router.post("/", async (req, res, next) => {
  try {
    const newUser = new profileSchema(req.body);
    const { _id } = await newUser.save();

    res.status(201).send(newUser);
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

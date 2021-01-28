router = require("express").Router();
const mongoose = require("mongoose");
const q2m = require("query-to-mongo");
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");

const PostModel = require("./schema");
const ProfileModel = require("../profile/profileSchema");

const cloudinary = require("../../lib/cloudinary");

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "linkedln/posts",
  },
});

const cloudinaryMulter = multer({ storage: storage });

router.get("/", async (req, res, next) => {
  try {
    const query = q2m(req.query);
    const total = await PostModel.countDocuments(query.criteria);

    const posts = await PostModel.find(query.criteria)
      .sort(query.options.sort)
      .skip(query.options.skip)
      .limit(query.options.limit)
      .populate("profiles");
    res.send({ links: query.links("/posts", total), posts });
  } catch (error) {
    next("Sorry, a problem occurred!");
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const post = await PostModel.findById(req.params.id).populate("profiles");
    res.send(post);
  } catch (error) {
    next("While reading posts list a problem occurred!");
  }
});

router.post("/", async (req, res, next) => {
  try {
    const newPost = new PostModel(req.body);

    const { _id } = await newPost.save();
    res.status(201).send(_id);
  } catch (error) {
    next(error);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const modifiedPost = await PostModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { runValidators: true, new: true }
    );

    if (modifiedPost) {
      res.send(modifiedPost);
    } else {
      next();
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const post = await PostModel.findByIdAndDelete(req.params.id);

    if (post) {
      res.send(`Post deleted`);
    } else {
      next();
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});

router.post(
  "/:id/upload",
  cloudinaryMulter.single("postimage"),
  async (req, res, next) => {
    try {
      const updated = await PostModel.findByIdAndUpdate(
        req.params.id,
        {
          $set: {
            postimageUrl: req.file.path,
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

router.get("/:username/allpost", async (req, res, next) => {
  try {
    const post = await PostModel.find({ username: req.params.username });
    if (post) {
      res.send(post);
    } else {
      next();
    }
  } catch (error) {
    next("While reading posts list a problem occurred!");
  }
});

router.post("/:id/comments", async (req, res, next) => {
  try {
    const updated = await PostModel.findByIdAndUpdate(
      req.params.id,
      {
        $push: {
          comments: [
            {
              text: req.body.text,
              profiles: req.body.profileId,
            },
          ],
        },
      },
      { runValidators: true, new: true }
    );
    res.status(201).send(updated);
  } catch (error) {
    next(error);
  }
});

router.put("/:id/comments/:commentId", async (req, res, next) => {
  try {
    const post = await PostModel.findById(req.params.id);

    if (post) {
      const comments = post.comments;
      //console.log(comments);

      if (comments) {
        const newComments = comments.filter(
          (comment) => comment._id.toString() !== req.params.commentId
        );

        const commentToUpdate = comments.find(
          (comment) => comment._id.toString() === req.params.commentId
        );

        if (commentToUpdate) {
          commentToUpdate.text = req.body.text;

          newComments.push(commentToUpdate);

          const updated = await PostModel.findOneAndUpdate(
            {
              _id: mongoose.Types.ObjectId(req.params.id),
              "comments._id": mongoose.Types.ObjectId(req.params.commentId),
            },
            {
              $set: {
                comments: newComments,
              },
            },
            { runValidators: true, new: true }
          );

          if (updated) {
            res.send("Update successful!");
          } else {
            res.send("Update failed!");
          }
        } else {
          res.send("Sorry, the requested comment does not exist");
        }
      } else {
        res.send("No comments available for this post");
      }
    } else {
      res.send("Sorry, this post does not exist");
    }
  } catch (error) {
    next(error);
  }
});

router.delete("/:id/comments/:commentId", async (req, res, next) => {
  try {
    const post = await PostModel.findById(req.params.id);

    if (post) {
      const comments = post.comments;

      if (comments) {
        const newComments = comments.filter(
          (comment) => comment._id.toString() !== req.params.commentId
        );

        if (newComments && newComments.length < comments.length) {
          const updated = await PostModel.findOneAndUpdate(
            {
              _id: mongoose.Types.ObjectId(req.params.id),
              "comments._id": mongoose.Types.ObjectId(req.params.commentId),
            },
            {
              $set: {
                comments: newComments,
              },
            },
            { runValidators: true, new: true }
          );

          if (updated) {
            res.send("Deleted successfully!");
          } else {
            res.send("Delete failed!");
          }
        } else {
          res.send("Not found");
        }
      } else {
        res.send("No comments available for this post");
      }
    } else {
      res.send("Sorry, this post does not exist");
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;

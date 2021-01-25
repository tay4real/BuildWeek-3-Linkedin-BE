router = require("express").Router();
const mongoose = require("mongoose");
const q2m = require("query-to-mongo");
const PostModel = require("./schema");

router.get("/", async (req, res, next) => {
  try {
    const query = q2m(req.query);
    const total = await PostModel.countDocuments(query.criteria);

    const posts = await PostModel.find(query.criteria, query.options.fields)
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

router.get("/:id/comments", async (req, res, next) => {
  try {
    const { post } = await PostModel.findById(req.params.id, {
      review: 1,
      _id: 0,
    });
    res.send(review);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

router.get("/:id/comments/:commentId", async (req, res, next) => {
  try {
    const { review } = await PostModel.findOne(
      {
        _id: mongoose.Types.ObjectId(req.params.id),
      },
      {
        _id: 0,
        review: {
          $elemMatch: { _id: mongoose.Types.ObjectId(req.params.reviewId) },
        },
      }
    );

    if (review && review.length > 0) {
      res.send(review);
    } else {
      next();
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});

router.post("/:id", async (req, res, next) => {
  try {
    const post = await PostModel.findById(req.params.id, {
      _id: 0,
    });

    const updated = await PostModel.findByIdAndUpdate(
      req.params.id,
      {
        $push: {
          review: req.body.review,
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
    const { review } = await PostModel.findOne(
      {
        _id: mongoose.Types.ObjectId(req.params.id),
      },
      {
        _id: 0,
        review: {
          $elemMatch: { _id: mongoose.Types.ObjectId(req.params.reviewId) },
        },
      }
    );

    if (review && review.length > 0) {
      const reviewToEdit = { ...review[0].toObject(), ...req.body };

      const modifiedPost = await ArticleModel.findOneAndUpdate(
        {
          _id: mongoose.Types.ObjectId(req.params.id),
          "review._id": mongoose.Types.ObjectId(req.params.reviewId),
        },
        { $set: { "review.$": reviewToEdit } },
        {
          runValidators: true,
          new: true,
        }
      );
      res.send(modifiedPost);
    } else {
      next();
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});

router.delete("/:id/reviews/:reviewId", async (req, res, next) => {
  try {
    const modifiedPost = await PostModel.findByIdAndUpdate(
      req.params.id,
      {
        $pull: {
          review: {
            _id: mongoose.Types.ObjectId(req.params.reviewId),
          },
        },
      },
      {
        new: true,
      }
    );
    res.send(modifiedPost);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

module.exports = router;

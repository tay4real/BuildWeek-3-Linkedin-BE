const router = require("express").Router();

const profileRouter = require("./profile");
const postRouter = require("./post");
const expRouter = require("./experience");

const {
  notFoundHandler,
  unauthorizedHandler,
  forbiddenHandler,
  badRequestHandler,
  catchAllHandler,
} = require("../errorHandlers");

router.use("/profile", profileRouter);
router.use("/post", postRouter);
router.use("/experience", expRouter);

// ERROR HANDLERS
router.use(notFoundHandler);
router.use(unauthorizedHandler);
router.use(forbiddenHandler);
router.use(badRequestHandler);
router.use(catchAllHandler);

module.exports = router;

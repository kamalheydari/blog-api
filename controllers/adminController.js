const fs = require("fs");

const multer = require("multer");
const sharp = require("sharp");
const shortId = require("shortid");
const appRoot = require("app-root-path");

const Blog = require("../models/Blog");
const Msg = require("../utils/messages").adminControllerMsg;
const { fileFilter } = require("../utils/multer");
const { errorCreator } = require("../utils/helper");

exports.createPost = async (req, res, next) => {
  const thumbnail = req.files ? req.files.thumbnail : {};
  const fileName = `${shortId.generate()}_${thumbnail.name}`;
  const uploadPath = `${appRoot}/public/uploads/thumbnails/${fileName}`;

  try {
    req.body = { ...req.body, thumbnail };

    await Blog.postValidation(req.body);

    await sharp(thumbnail.data)
      .jpeg({ quality: 60 })
      .toFile(uploadPath)
      .catch((err) => console.log(err));

    await Blog.create({
      ...req.body,
      user: req.userId,
      thumbnail: fileName,
    });
    res.status(201).json({ message: Msg.createPostSuccess });
  } catch (err) {
    next(err);
  }
};

exports.editPost = async (req, res, next) => {
  const thumbnail = req.files ? req.files.thumbnail : {};
  const fileName = `${shortId.generate()}_${thumbnail.name}`;
  const uploadPath = `${appRoot}/public/uploads/thumbnails/${fileName}`;

  const post = await Blog.findOne({ _id: req.params.id });
  // const post = await Blog.findById(req.params.id);

  try {
    if (thumbnail.name) await Blog.postValidation({ ...req.body, thumbnail });
    else
      await Blog.postValidation({
        ...req.body,
        thumbnail: {
          name: "placeholder",
          size: 0,
          mimetype: "image/jpeg",
        },
      });

    if (!post) {
      errorCreator(Msg.handleEditPostErr, 404);
    }

    if (post.user.toString() != req.userId) {
      errorCreator(Msg.handleEditPostUserErr, 401);
    } else {
      if (thumbnail.name) {
        fs.unlink(
          `${appRoot}/public/uploads/thumbnails/${post.thumbnail}`,
          async (err) => {
            if (err) console.log(err);
            else {
              await sharp(thumbnail.data)
                .jpeg({ quality: 60 })
                .toFile(uploadPath)
                .catch((err) => console.log(err));
            }
          }
        );
      }

      const { title, status, body } = req.body;
      post.title = title;
      post.status = status;
      post.body = body;
      post.thumbnail = thumbnail.name ? fileName : post.thumbnail;

      await post.save();
      res.status(200).json({ message: Msg.handleEditPostSuccess });
    }
  } catch (err) {
    next(err);
  }
};

exports.uploadImage = (req, res) => {
  const upload = multer({
    limits: { fileSize: 4000000 },
    fileFilter,
  }).single("image");

  upload(req, res, async (err) => {
    if (err) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({
          error: Msg.handleImgUploadErr,
        });
      }
      res.status(400).json({ error: err });
    } else {
      if (req.files) {
        const fileName = `${shortId.generate()}_${req.files.image.name}`;
        await sharp(req.files.image.data)
          .jpeg({ quality: 50 })
          .toFile(`${appRoot}/public/uploads/images/${fileName}`)
          .catch((err) => console.log(err));

        res
          .status(200)
          .json({ image: `http://localhost:3000/uploads/images/${fileName}` });
      } else {
        res.status(400).json({
          error: Msg.handleImgUploadSizeErr,
        });
      }
    }
  });
};

exports.deletePost = async (req, res, next) => {
  try {
    const post = await Blog.findByIdAndRemove(req.params.id);
    const filePath = `${appRoot}/public/uploads/thumbnails/${post.thumbnail}`;

    fs.unlink(filePath, (err) => {
      if (err) {
        errorCreator(Msg.handleDeletePostErr, 400);
      } else {
        res.status(200).json({ message: Msg.handleDeletePostSuccess });
      }
    });
  } catch (err) {
    next(err);
  }
};

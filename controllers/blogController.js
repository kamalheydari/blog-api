const Blog = require("../models/Blog");
const { sendEmail } = require("../utils/mailer");
const { errorCreator } = require("../utils/helper");
const Msg = require("../utils/messages").blogControllerMsg;
const { schema } = require("../models/secure/messageValidation");

exports.getIndex = async (req, res, next) => {
  try {
    const numberOfPosts = await Blog.find({
      status: "public",
    }).countDocuments();

    const posts = await Blog.find({ status: "public" }).sort({
      createdAt: "desc",
    });
    if (!posts) {
      errorCreator(Msg.getIndexErr, 404);
    }
    res.status(200).json({ posts, total: numberOfPosts });
  } catch (err) {
    next(err);
  }
};

exports.getSinglePost = async (req, res, next) => {
  try {
    const post = await Blog.findById(req.params.id);
    if (!post) {
      errorCreator(Msg.getSingelPostErr, 404);
    }
    res.status(200).json({ post });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

exports.handleContactPage = async (req, res, next) => {
  const { fullname, email, message } = req.body;
  try {
    await schema.validate(req.body, { abortEarly: false });

    sendEmail(
      email,
      fullname,
      Msg.handleContactEmailSub,
      `${message}<br /> ${Msg.handleContactEmailMsg} ${email}`
    );

    res.status(200).json({ message: Msg.handleContactSuccess });
  } catch (err) {
    next(err);
  }
};

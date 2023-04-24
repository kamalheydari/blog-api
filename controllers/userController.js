const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const { sendEmail } = require("../utils/mailer");
const { errorCreator } = require("../utils/helper");
const User = require("../models/User");
const Msg = require("../utils/messages").userControllerMsg;

exports.createUser = async (req, res, next) => {
  try {
    await User.userValidation(req.body);
    const { fullname, email, password } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      errorCreator(Msg.createUserError, 422);
    } else {
      await User.create({ fullname, password, email });
    }
    sendEmail(email, fullname, Msg.createUserEmailSub, Msg.createUserEmailMsg);
    res.status(201).json({ message: Msg.createUserSuccess });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

exports.handleLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      errorCreator(Msg.handleLoginEmailError, 404);
    }
    const isEqual = await bcrypt.compare(password, user.password);

    if (isEqual) {
      const token = jwt.sign(
        {
          user: {
            userId: user._id.toString(),
            email: user.email,
            fullname: user.fullname,
          },
        },
        process.env.JWT_SECRET
      );
      res.status(200).json({ token, userId: user._id.toString() });
    } else {
      errorCreator(Msg.handleLoginPassError, 422);
    }
  } catch (err) {
    console.log(err);
    next(err);
  }
};
exports.handleForgetPassword = async (req, res, next) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      errorCreator(Msg.handleForgetPassErr, 404);
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1hr",
    });
    const resetLink = `http://localhost:3000/users/reset-password/${token}`;

    sendEmail(
      user.email,
      user.fullname,
      Msg.handleForgetPassEmailSub,
      `${Msg.handleForgetPassEmailMsg} <a href="${resetLink}">${Msg.handleForgetPassEmailLink}</a>`
    );

    res.status(200).json({ message: Msg.handleForgetPassSuccess });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

exports.handleResetPassword = async (req, res, next) => {
  const token = req.params.token;
  const { password, confirmPassword } = req.body;

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decodedToken);
    if (!decodedToken) {
      errorCreator(Msg.handleResetPassTokenErr, 401);
    }
    if (password !== confirmPassword) {
      errorCreator(Msg.handleResetCofirmPassErr, 422);
    }
    const user = await User.findOne({ _id: decodedToken.userId });

    user.password = password;
    await user.save();
    res.status(200).json({ message: Msg.handleResetPassSuccess });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

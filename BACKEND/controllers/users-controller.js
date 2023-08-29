const { v4: uuidv4 } = require("uuid");
const { validationResult } = require("express-validator");

const HttpError = require("../models/http-error");
const User = require("../models/user");

const DUMMY_USERS = [
  {
    id: "u1",
    name: "Marcel Frankowski",
    email: "test@test.com",
    password: "test123",
  },
  {
    id: "u2",
    name: "Kamil Frankowski",
    email: "test2@test.com",
    password: "test1234",
  },
];

const getAllUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find({}, "-password");
  } catch (err) {
    return next(new HttpError("Fetching users failed.", 500));
  }

  res
    .status(200)
    .json({ users: users.map((user) => user.toObject({ getters: true })) });
};

const signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  const { name, email, password, places } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email });
  } catch (err) {
    return next(new HttpError("Could not find a user.", 500));
  }

  if (existingUser) {
    return next(
      new HttpError("User exists already, please login instead.", 422)
    );
  }

  const createdUser = new User({
    name,
    email,
    password,
    image:
      "https://static.wikia.nocookie.net/swordartonline/images/0/06/Asuna_with_Yui_Biprobe.png/revision/latest?cb=20141220180221",
    places,
  });

  try {
    await createdUser.save();
  } catch (err) {
    return next(new HttpError("Signing Up failed, please try again.", 500));
  }

  res.status(201).json({ user: createdUser.toObject({ getters: true }) });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    identifiedUser = await User.findOne({ email });
  } catch (err) {
    return next(new HttpError("Could not find a user.", 500));
  }

  if (identifiedUser && identifiedUser.password === password) {
    res.status(200).json({ message: "Successful login." });
  } else {
    return next(new HttpError("Wrong credentials.", 401));
  }
};

exports.getAllUsers = getAllUsers;
exports.signup = signup;
exports.login = login;

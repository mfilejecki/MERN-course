const express = require("express");
const { check } = require("express-validator");

const usersControllers = require("../controllers/users-controller");

const router = express.Router();

router.get("/", usersControllers.getAllUsers);

router.post(
  "/signup",
  [
    check("name").notEmpty(),
    check("email").normalizeEmail().isEmail(),
    check("password").isLength({ min: 6 }),
  ],
  usersControllers.signup
);

router.post("/login", usersControllers.login);

module.exports = router;

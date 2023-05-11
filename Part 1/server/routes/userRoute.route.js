const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.ctrl");

router.post("/insertUser", userController.insertUser);

router.get("/getUsers", userController.getUsers);

router.get("/getNumber", userController.getNumber);

router.get("/getActiveUsers", userController.getActiveUsers);

router.post("/getUserById", userController.getUserById);

router.post("/getUserCoronaById", userController.getUserCoronaById);

module.exports = router;

const express = require("express");
const app = express();
const router = express.Router();
const {     registerContact,
            loginContact,
            current       }=    require("../controllers/userController");
const validateToken = require("../middleware/validateTokenHandler");

router.route("/register").post(registerContact);
router.route("/login").post(loginContact);
router.get("/current",validateToken,current);

module.exports=router;
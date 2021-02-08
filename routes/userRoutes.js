const express = require("express");
const router = express();
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
const auth = require("../middleware/auth")
const User = require("../models/userModule");
const config = require("config");
const {Register, Login,Display,GetDataById,UpdateById,DeleteById} = require("../controller/userController")

//Register User Routes
router.post(
    "/sign-up",
    [

        check("First_Name", "First_Name is required").not().isEmpty(),
        check("Last_Name", "Last_Name is required").not().isEmpty(),
        check("Email", "Please include a valid Email").isEmail(),
        check("Password", "enter Password").not().isEmpty(),
        check("Phone_No", "Phone_No is required").not().isEmpty(),
        [check("Phone_No", "Phone_No is required and it should be number only", "add 10 digit number or 12 digit ").not()
            .isEmpty()
            .isNumeric().isLength({ min: 10, max: 12 })
        ],
        check("Address", "Address is required").not().isEmpty(),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
    
        const { First_Name, Last_Name, Email, Password, Phone_No, Address } = req.body;
    
        try {
            //See if user exists
            let user = await User.findOne({ Email });
            if (user) {
                return res
                    .status(400)
                    .json({ msg: "user Already exist!!" });
            }
    
            user = new User({
                First_Name,
                Last_Name,
                Email, 
                Password,
                Phone_No,
                Address,
            });
    
            // Encrypt password
            const salt = await bcrypt.genSalt(10);
            user.Password = await bcrypt.hash(Password, salt);
            await user.save();
            res.json({ msg: "Sign-up successfully" });
              
        } catch (err) {
            console.error(err.message);
            return res.status(500).send("server error");
        }
    }
   
);


//Login User Routes

router.post(
    "/sign-in", [
        check("Email", "Please include a valid Email").isEmail(),
        check("Password", "Enter Password").not().isEmpty(),
    ],
   Login
);


//Display  User Route
router.get('/display', auth,Display);


//retrive data By  ID
router.get("/user/:id",async (req, res) => {
    console.log("called", req.params.id);
   await User.findById(req.params.id, (err, users) => {
      if (err) {
        return res
          .status(400)
          .json({ err: true, message: "No user with this Id" });
      } else {
        return res
          .status(200)
          .json({ err: false, message: "update", users: users });
      }
    });
  });
  

//Update By id
router.post(
    "/update/:Id",
   UpdateById    
);


//Delete user By id
router.get("/delete/:Id",DeleteById);




module.exports = router;

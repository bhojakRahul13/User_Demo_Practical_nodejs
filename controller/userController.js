module.exports.Register =   async (req, res) => {
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


module.exports.Login =  async(req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { Email, Password } = req.body;

    try {
        //See if user exists
        let user = await User.findOne({ Email });
        if (!user) {
            res.status(400).json({ msg: "Invalid Credentials !" });
        }

        //Match password
        const isMatch = await bcrypt.compare(Password, user.Password);

        if (!isMatch) {
            res.status(400).json({ msg: "Invalid Password !" });
        }
        //Jwt Token
        const payload = {
            user: {
                id: user.id,
                //email: user.email, //not send email  if it is role base we need to gave email and pass role.
          },
        };

        jwt.sign(
            payload,
            config.get("jwtToken"), { expiresIn: 360000 },
            (err, token) => {
                if (err) throw err;
                res.json({ msg: "Login success", token });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send("server error");
    }
}    

module.exports.Display = async (req, res) => {
	try {
        const user = await User.find().select("-Password"); //select password is used to leave the pass data when retrive user data
		res.json({ total_User: user.length, user });
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server Error');
	}
}


  module.exports.UpdateById =  async(req, res) => {
    try {
        const id = req.params.Id;
        // console.log(id);
        const user = await User.findByIdAndUpdate(
            id, {...req.body}, {
                new: true,
            }
        );
        //console.log(user);

        if (!user) {
            return res.status(400).json({
                msg: "no user with this Id",
            });
        } else {
            return res
                .status(200)
                .json({ msg: "Update succesfully ", user });
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
}


module.exports.DeleteById  =  async(req, res) => {
    try {
        const id = req.params.Id;
        const user = await User.findByIdAndDelete(id);
        if (!user) return res.status(400).json({ msg: "No User Id  Found!", id });
        return res
            .status(200)
            .json({ msg: "User Delete Successfully", UserDelete: user });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error!");
    }
}
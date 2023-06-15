const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const AWS = require("aws-sdk");
const { nanoid } = require("nanoid");

const { hashPassword, comparePassword } = require("../utils/auth");

const awsConfig = {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
    apiVersion: process.env.AWS_API_VERSION
};

const SES = new AWS.SES(awsConfig);

const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        // --------- If name provided -------------
        if (!name) {
            return res.status(400).send("Name is required");
        }
        // --------- If password provided and greater then 6 characters -------------
        if (!password || password.length < 6) {
            return res.status(400).send("Password is required and should be min 6 characters long");
        }

        // --------- If email already taken ----------
        const userExist = await User.findOne({ email }).exec();
        if (userExist) {
            return res.status(400).send("Email is taken");
        }

        // --------- Hashing the password ------------
        const hashedPassword = await hashPassword(password);

        // --------- Register the user --------------
        const user = new User({
            name,
            email,
            password: hashedPassword
        })

        await user.save();
        console.log("Saved user : ", user);

        // --------- Returning the response

        return res.json({
            ok: true
        });

    }
    catch (err) {

        console.log("Error : ", err);
        return res.status(400).send("Error . Try again.")
    }
}

const login = async (req, res) => {

    try {
        const { email, password } = req.body;

        // Check if our db has user with that email
        const user = await User.findOne({ email }).exec();
        console.log("User : ", user);
        if (!user) {
            return res.status(400).send("Invalid Email or password");
        }

        // check password
        const match = await comparePassword(password, user.password);
        console.log("match : ", match);

        if (!match) {
            return res.status(400).send("Invalid Email or Password")
        }

        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "7d"
        });

        // return user and token to the client , exclude hashed password
        user.password = undefined;

        const oneDay = 1000 * 60 * 60 * 24;
        res.cookie("token", token, {
            httpOnly: true,
            expiresIn: new Date(Date.now() + oneDay)
        });

        // send user as json responser
        res.json(user);

    }
    catch (error) {
        console.log("Error : ", error);
        return res.status(400).send("Error . Try again.")
    }
}


const logout = async (req, res) => {

    try {

        res.clearCookie("token");
        return res.json({
            message: "Signout Success"
        })
    }
    catch (err) {
        console.log("Error : ", err);
        return res.status(400).send("Error . Try again.")
    }
}

const currentUser = async (req, res) => {
    try {
        const user = await User.findById(req.auth._id).select("-password").exec();

        console.log("Current User : ", user);
        return res.json({ ok: true });

    }
    catch (err) {
        console.log("error ( currentUser ) : ", err);
    }
}

const sendTestEmail = async (req, res) => {

    const params = {
        Source: process.env.EMAIL_FROM,
        Destination: {
            ToAddresses: ["zain970946@gmail.com"]
        },
        ReplyToAddresses: [process.env.EMAIL_FROM],
        Message: {
            Body: {
                Html: {
                    Charset: "UTF-8",
                    Data: `
                    <html>
                    <h1>Reset Password</h1>
                    <p>Please use the following link to reset your password</p>
                    </html>
                    `
                }
            },
            Subject: {
                Charset: "UTF-8",
                Data: "Password reset link"
            }
        }
    }

    const emailSend = SES.sendEmail(params).promise();

    emailSend.then((data) => {
        console.log(data);
        res.json({ ok: true })
    }).catch((err) => {
        console.log("Error : ", err);
    })
}

const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        console.log("Email : ", email);
        const shortCode = nanoid(6).toUpperCase();

        const user = await User.findOneAndUpdate(
            { email },
            { passwordResetCode: shortCode })

        console.log("User : ", user);

        if (!user) {
            console.log("No user");
            return res.status(400).send("User not found");
        }
        // prepare for email

        const params = {
            Source: process.env.EMAIL_FROM,
            Destination: {
                ToAddresses: [email]
            },
            ReplyToAddresses: [process.env.EMAIL_FROM],
            Message: {
                Body: {
                    Html: {
                        Charset: "UTF-8",
                        Data: `
                          <html>
                             <h1>Reset Password</h1>
                             <p>Use this code to reset your password </p>
                             <h2 style="color:"red">${shortCode}</h2>
                            <i>Elearning-marketplace.com</i>
                            </html>
                            `
                    }
                },
                Subject: {
                    Charset: "UTF-8",
                    Data: "Reset Password"
                }
            }
        }

        const emailSent = SES.sendEmail(params).promise();
        emailSent.then((data) => {
            res.json({ ok: true })
        }).catch((err) => {
            console.log(err);
        })
    }
    catch (error) {
        console.log("error : ", error);
    }
}

const resetPassword = async (req, res) => {
    try {
        const { email, code, newPassword } = req.body;
        const hashedPassword = await hashPassword(newPassword);

        const user = await User.findOneAndUpdate({
            email,
            passwordResetCode: code
        }, {
            password: hashedPassword,
            passwordResetCode: ""
        }).exec();
        res.json({ ok: true })
    }
    catch (error) {
        return res.status(400).send("Error! Try again.")
    }
}

module.exports = {
    register,
    login,
    logout,
    currentUser,
    sendTestEmail,
    forgotPassword,
    resetPassword
}
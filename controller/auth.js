import speakeasy from "speakeasy";
import User from "../model/User.js";
import sendMail from "../utils/sendMail.js";
import asyncHandler from "express-async-handler";
import { generateAccessToken } from "../utils/jwt.js";
import ResetPasswordTemplate from "../views/reset-password.js";
import { sendEmailVerificationToken, verifyEmailVerificationToken } from "../utils/mail.js";

// @route   POST /api/v1/auth/login
// @desc    Login user
// @access  Public
const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User
        .findOne({ email })
        .select('+password')
        .exec();

    if (!user.verifiedAt) {
        res.status(404);
        throw new Error(req.t("invalid", { ns: "validations", key: req.t("credentials") }));
    }

    if (!user || !await user.matchPassword(password)) {
        res.status(404);
        throw new Error(req.t("invalid", { ns: "validations", key: req.t("credentials") }));
    }

    const accessToken = await generateAccessToken(user.id);

    const options = {
        httpOnly: true, //accessible only by web server 
        secure: process.env.NODE_ENV === "production", //https
        sameSite: 'Strict', //cross-site cookie 
        maxAge: 7 * 24 * 60 * 60 * 1000 //cookie expiry: set to match rT
    };

    res.status(200)
        .cookie("token", accessToken, options)
        .json({
            id: user["_id"] || null,
            firstName: user["firstName"] || null,
            lastName: user["lastName"] || null,
            email: user["email"] || null,
            verifiedAt: user["verifiedAt"] || null,
            image: user["image"] || null,
            accessToken
        });
})

// @route   POST /api/v1/auth/register
// @desc    Signup user
// @access  Public
const register = asyncHandler(async (req, res) => {
    const { file, body } = req;

    body.image = file?.path;

    const user = await User.create(body);

    if (!user) {
        res.status(500);
        throw new Error(req.t("something-went-wrong"));
    }

    // const accessToken = await generateAccessToken(user?.id);

    await sendEmailVerificationToken(user);

    res.json({
        email: user.email,
        // accessToken
    });

})

// @route     POST /api/v1/auth/resendToken
// @desc      Resend Token
// @access    Public
const resendToken = asyncHandler(async (req, res) => {
    const { body } = req;

    const user = await User
        .findOne({ email: body.email })
        .select('+update_secret');

    if (user.verifiedAt) {
        throw new Error(req.t("already-verified"))
    }

    await sendEmailVerificationToken(user);

    res.json({ message: req.t("msg-send") });
})

// @route     PUT /api/v1/auth/verify
// @desc      Resend Token
// @access    Public
const verifyEmail = asyncHandler(async (req, res) => {
    const { body } = req;

    const user = await User
        .findOne({ email: body.email })
        .select("+update_secret")
        .exec();

    if (!user) {
        throw new Error(req.t("not-found", { ns: "validations", key: req.t("user") }));
    }

    if (user.verifiedAt) {
        throw new Error(req.t("already-verified"))
    }

    const verify = verifyEmailVerificationToken(body.token, user.update_secret);

    if (!verify) {
        throw new Error(req.t("invalid", { ns: "validations", key: req.t("token") }));
    }

    user.verifiedAt = new Date()

    await user.save();

    const accessToken = await generateAccessToken();

    const options = {
        httpOnly: true, //accessible only by web server 
        secure: process.env.NODE_ENV === "production", //https
        sameSite: 'Strict', //cross-site cookie 
        maxAge: 7 * 24 * 60 * 60 * 1000 //cookie expiry: set to match rT
    };

    // Create secure cookie with refresh token 
    res.cookie('jwt', accessToken, options);

    if (process.env.NODE_ENV === "production") {
        options.secure = true; //https
    }

    return res.json({
        id: user["_id"] || null,
        firstName: user["firstName"] || null,
        lastName: user["lastName"] || null,
        email: user["email"] || null,
        verifiedAt: user["verifiedAt"] || null,
        image: user["image"] || null,
        accessToken
    });
})

// @route     POST /api/v1/auth/forgot-password
// @desc      Forgot password
// @access    Public
const forgotPassword = asyncHandler(async (req, res) => {
    const user = await User
        .findOne({ email: req.body.email })
        .select("+update_secret")
        .exec();

    if (!user) {
        res.statusCode = 400;
        throw new Error(req.t("not-found", { ns: 'validations', key: req.t("user") }));
    }

    const token = speakeasy.totp({
        secret: user.update_secret.base32,
        algorithm: 'sha512',
        encoding: 'base32',
        step: process.env.OTP_STEP_EMAIL || 120
    });

    user.resetPasswordToken = token;
    await user.save();
    // Create reset url
    const ipAddress = req.socket.remoteAddress;
    const recipient = { name: user.fullName, email: user.email };

    const template = new ResetPasswordTemplate(token, recipient, ipAddress)

    await sendMail({
        to: user.email,
        subject: `${req.t("reset-password")} - ${token}`,
        html: template.render(),
    });

    return res.json({ success: true, email: user.email });
})

// @route     PUT /api/v1/auth/reset-password
// @desc      Reset password
// @access    Public
const resetPassword = asyncHandler(async (req, res) => {
    const { otpCode, newPassword, email } = req.body;

    const user = await User
        .findOne({ email: email, resetPasswordToken: otpCode })
        .select("+update_secret")
        .exec();

    const verify = speakeasy.totp.verify({
        secret: user?.update_secret?.base32,
        algorithm: 'sha512',
        encoding: 'base32',
        token: otpCode,
        step: process.env.OTP_STEP_EMAIL || 120,
        window: 1,
    });

    if (!user || !verify) {
        res.statusCode = 400;
        throw new Error(req.t("invalid", { ns: "validations", key: req.t("token") }));
    }

    user.password = newPassword;
    user.resetPasswordToken = undefined;

    await user.save();

    return res.json({ success: true });
})

// @route POST /auth/logout
// @desc Logout
// @access Public - just to clear cookie if exists
const logout = (req, res) => {
    const cookies = req.cookies
    if (!cookies?.token) return res.sendStatus(204) //No content

    res.clearCookie('token', {
        httpOnly: true, //accessible only by web server 
        secure: process.env.NODE_ENV === "production", //https
        sameSite: 'Strict', //cross-site cookie 
        maxAge: 7 * 24 * 60 * 60 * 1000 //cookie expiry: set to match rT
    })

    res.json({ message: 'Cookie cleared' })
}

export {
    login,
    logout,
    register,
    verifyEmail,
    resendToken,
    resetPassword,
    forgotPassword
}
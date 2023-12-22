import speakeasy from "speakeasy";
import sendMail from "./sendMail.js";
import EmailVerificationTemplate from "../views/verify-email.js";
import OtpVerificationTemplate from "../views/verification-otp.js";

export const sendEmailVerificationToken = (user) => {
    const token = speakeasy.totp({
        secret: user.update_secret.base32,
        algorithm: 'sha512',
        encoding: 'base32',
        step: process.env.OTP_STEP_EMAIL || 120
    });

    const emailContent = new OtpVerificationTemplate(token, user.email, process.env.FRONT_BASEURL)

    return sendMail({
        to: user.email,
        subject: `Verfication Message - ${token}`,
        html: emailContent.render()
    })
}

export const verifyEmailVerificationToken = (otp, update_secret) => {
    return speakeasy.totp.verify({
        secret: update_secret.base32,
        algorithm: 'sha512',
        encoding: 'base32',
        token: otp,
        step: process.env.OTP_STEP_EMAIL || 120,
        window: 1,
    });
};

export const getOneTimePassword = (auth_secret) => {
    return speakeasy.totp({
        secret: auth_secret.base32,
        algorithm: 'sha512',
        encoding: 'base32',
        step: process.env.OTP_STEP || 60
    });
}

export const sendOTP = (auth_secret) => {
    const OTP = this.getOneTimePassword(auth_secret);

    const emailContent = new EmailVerificationTemplate(OTP, this, this.ipAddress, process.env.FRONT_BASEURL)

    return sendMail({
        to: this.email,
        subject: "Verification Message",
        html: emailContent.render(),
    });
};
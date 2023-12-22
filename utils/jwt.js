import jwt from "jsonwebtoken"

export const generateAccessToken = async (id) => {
    const payload = { id }

    return jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE }
    )
}
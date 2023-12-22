import jwt from "jsonwebtoken"
import User from "../model/User.js"
import asyncHandler from "express-async-handler"

const authenticate = asyncHandler(async (req, res, next) => {
	let token;

	if (
		req.headers.authorization &&
		req.headers.authorization.startsWith("Bearer")
	) {
		try {
			token = req.headers.authorization.split(" ")[1]
			const decoded = jwt.verify(token, process.env.JWT_SECRET)

			const user = await User.findById(decoded.id)
			if (!user) throw new Error("Not authorized, token failed")

			req.user = user

			next()
		} catch (error) {
			console.log(error)
			res.status(403)
			return next(new Error("Not authorized, token failed"))
		}
	}

	if (!token) {
		res.status(401)
		return next(new Error("Not authorized, no token"))
	}
})

export {
	authenticate
}

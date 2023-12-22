import asyncHandler from 'express-async-handler'
import User from '../model/User.js'

// @route    GET api/v1/users/:id
// @desc     Fetch a User
// @access   private
const getUser = asyncHandler(async (req, res) => {
    const { params } = req

    const user = await User.findById(params.id)

    if (!user) {
        throw new Error(req.t("not-found", { ns: 'validations', key: req.t("user") }));
    }

    res.status(200).json(user)
})

// @route    GET api/v1/users
// @desc     Fetch All Users
// @access   private
const getUsers = asyncHandler(async (req, res) => {

    const users = await User.find({})

    res.status(200).json(users)
})

// @route    POST api/v1/users
// @desc     Create a User
// @access   private
const createUser = asyncHandler(async (req, res) => {
    const { body } = req

    const user = await User.create(body)

    if (!user) {
        res.status(500);
        throw new Error(req.t("something-went-wrong"));
    }

    res.status(200).json(user)
})

// @route    PUT api/v1/users/:id
// @desc     Update a User
// @access   private
const updateUser = asyncHandler(async (req, res) => {
    const { params, body } = req

    const isEmailExist = User.findOne({ _id: { $ne: params.id }, email: body.email })

    if (isEmailExist) {
        throw new Error(req.t("not-found", { ns: 'validations', key: req.t("user") }));

    }

    const user = await User.findOneAndUpdate({ _id: params.id }, {
        $set: {
            firstName: body?.firstName,
            lastName: body?.lastName,
            email: body?.email,
            password: body?.password
        }
    },
        {
            new: true,
            runValidators: true
        })

    if (!user) {
        throw new Error("No User Found!")
    }

    res.status(200).json(user)
})

// @route    DELETE api/v1/users/:id
// @desc     Delete a User
// @access   private
const deleteUser = asyncHandler(async (req, res) => {
    const { params } = req

    const user = await User.findByIdAndDelete(params.id)

    if (!user) {
        throw new Error(req.t("not-found", { ns: 'validations', key: req.t("user") }));
    }

    res.status(200).json({})
})

export {
    getUser,
    getUsers,
    createUser,
    updateUser,
    deleteUser,
}
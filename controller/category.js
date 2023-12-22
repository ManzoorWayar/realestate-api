import asyncHandler from 'express-async-handler'
import Category from '../model/Category.js'

// @route    GET api/v1/category/:id
// @desc     Fetch a Category
// @access   private
const getCategory = asyncHandler(async (req, res) => {
    const { params } = req

    const category = await Category.findById(params.id)

    if (!category) {
        throw new Error(req.t("not-found", { ns: 'validations', key: req.t("category") }));
    }

    res.status(200).json(category)
})

// @route    GET api/v1/category/:id
// @desc     Fetch All Categories
// @access   public
const getCategories = asyncHandler(async (req, res) => {

    const categories = await Category.find({})

    res.status(200).json(categories)
})

// @route    POST api/v1/category
// @desc     Create Category
// @access   private
const createCategory = asyncHandler(async (req, res) => {
    const { body } = req

    const category = await Category.create(body)

    if (!category) {
        res.status(500);
        throw new Error(req.t("something-went-wrong"));
    }

    res.status(200).json(category)
})

// @route    PUT api/v1/category/:id
// @desc     Update a Category
// @access   private
const updateCategory = asyncHandler(async (req, res) => {
    const { params, body } = req

    const category = await Category.findByIdAndUpdate(params.id,
        body,
        {
            new: true,
            runValidators: true
        })
        .populate("category", "name type")


    if (!category) {
        throw new Error(req.t("not-found", { ns: 'validations', key: req.t("category") }));
    }

    res.status(200).json(category)
})

// @route    DELETE api/v1/category/:id
// @desc     Delete a Category
// @access   private
const deleteCategory = asyncHandler(async (req, res) => {
    const { params } = req

    const category = await Category.findByIdAndDelete(params.id)

    if (!category) {
        throw new Error(req.t("not-found", { ns: 'validations', key: req.t("category") }));
    }

    res.status(200).json({})
})

export {
    getCategory,
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory,
}
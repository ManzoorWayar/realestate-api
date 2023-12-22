import asyncHandler from 'express-async-handler'
import Estate from '../model/Estate.js'

// @route    Get api/v1/estates/:id
// @desc     Fetch a Estate
// @access   public
const getEstate = asyncHandler(async (req, res) => {
    const { params } = req

    const estate = await Estate
        .findById(params.id)
        .populate("category", "name type")

    if (!estate) {
        throw new Error(req.t("not-found", { ns: 'validations', key: req.t("estate") }));
    }

    res.status(200).json(estate)
})

// @route    Get api/v1/estates
// @desc     Fetch All Estates
// @access   public
const getEstates = asyncHandler(async (req, res) => {

    const estates = await Estate
        .find({})
        .populate("category", "name type")

    res.status(200).json(estates)
})

// @route    POST api/v1/estates
// @desc     Create a Estate
// @access   private
const createEstate = asyncHandler(async (req, res) => {
    const { files, body } = req

    body.images = files?.map(file => file?.path)

    const estate = await Estate.create(body)
    await estate.populate("category", "name type")

    if (!estate) {
        res.status(500);
        throw new Error(req.t("something-went-wrong"));
    }

    res.status(200).json(estate)
})

// @route    PUT api/v1/estates/:id
// @desc     Update a Estate
// @access   private
const updateEstate = asyncHandler(async (req, res) => {
    const { params, body } = req

    const estate = await Estate.findByIdAndUpdate(params.id,
        body,
        {
            new: true,
            runValidators: true
        })
        .populate("category", "name type")


    if (!estate) {
        throw new Error(req.t("not-found", { ns: 'validations', key: req.t("estate") }));
    }

    res.status(200).json(estate)
})

// @route    Delte api/v1/estates/:id
// @desc     Delete a Estate
// @access   private
const deleteEstate = asyncHandler(async (req, res) => {
    const { params } = req

    const estate = await Estate.findByIdAndDelete(params.id)

    if (!estate) {
        throw new Error(req.t("not-found", { ns: 'validations', key: req.t("estate") }));
    }

    res.status(200).json({})
})

// @route    PUT api/v1/estates/:id/like
// @desc     Like a Estate
// @access   private
const likeOrDislike = asyncHandler(async (req, res) => {
    const { params, user } = req;

    const estate = await Estate.findById(params.id);

    if (!estate) {
        res.status(404);
        throw new Error(req.t("not-found", { ns: 'validations', key: req.t("estate") }));
    }

    // Check if the estate has already been liked
    const isLiked = estate.likes.some((like) => like.toString() === user.id);

    if (!isLiked) {
        const updatedEstate = await Estate.findOneAndUpdate(
            { _id: params.id },
            { $push: { likes: user._id } },
            { new: true }
        ).populate("likes", "firstName lastName image");
        res.json(updatedEstate.likes);

    } else {
        const updatedEstate = await Estate.findOneAndUpdate(
            { _id: id },
            { $pull: { likes: user._id } },
            { new: true }
        ).populate("likes", "firstName lastName image");
        res.json(updatedEstate.likes);

    }
});

export {
    getEstate,
    getEstates,
    createEstate,
    updateEstate,
    deleteEstate,
    likeOrDislike,
}
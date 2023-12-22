import { checkSchema, validationResult } from "express-validator";
import mongoose from "mongoose";

const errorHandler = (req, res, next) => {
    const validationError = validationResult(req);
    if (!validationError.isEmpty()) {
        return res.status(400).json({ validationError });
    }
    next();
};

const createChatSchema = checkSchema({
    reciver: {
        escape: true,
        trim: true,
        isEmpty: {
            negated: true,
            errorMessage: (_, { req }) =>
                req.t("required", { ns: "validations", key: req.t("reciver") })
        },
        custom: {
            options: async (_, { req }) => {
                if (!new mongoose.Types.ObjectId(req.body.reciver)) {
                    return Promise.reject(req.t('invalid', { ns: 'validations', key: req.t('id') }));
                }
                return Promise.resolve();
            }
        }
    },
    content: {
        escape: true,
        trim: true,
        isEmpty: {
            negated: true,
            errorMessage: (_, { req }) =>
                req.t("required", { ns: "validations", key: req.t("content") })
        }
    }
});

const createMessageSchema = checkSchema({
    content: {
        escape: true,
        trim: true,
        isEmpty: {
            negated: true,
            errorMessage: (_, { req }) =>
                req.t("required", { ns: "validations", key: req.t("content") })
        }
    }
});

export default {
    createChat: [createChatSchema, errorHandler],
    createMessage: [createMessageSchema, errorHandler],
};

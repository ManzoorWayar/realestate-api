import { checkSchema, validationResult } from "express-validator";

const errorHandler = (req, res, next) => {
  // handling validation errors
  const validationErrs = validationResult(req);

  if (!validationErrs.isEmpty()) {
    return res.status(400).json({ errors: validationErrs.array() });
  }

  next();
};

const createSchema = checkSchema({
  name: {
    trim: true,
    escape: true,
    isEmpty: {
      negated: true,
      errorMessage: (_, { req }) => req.t("required", { ns: 'validations', key: req.t("name") })
    },
  },
  type: {
    trim: true,
    escape: true,
    isEmpty: {
      negated: true,
      errorMessage: (_, { req }) => req.t("required", { ns: 'validations', key: req.t("type-category") })
    },
    isIn: {
      escape: true,
      trim: true,
      options: [["apartment", "building"]],
      errorMessage: (_, { req }) => req.t("enum", {
        ns: 'validations', key: {
          name: req.t('type-category'),
          value: req.t('enum-category'),
        }
      }),
    }
  },
})

export default {
  categorySchema: [createSchema, errorHandler],
};

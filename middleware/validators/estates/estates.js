import { checkSchema, validationResult } from "express-validator";
import { existsSync, unlinkSync } from "fs";

const errorHandler = (req, res, next) => {
  // handling validation errors
  const validationErrs = validationResult(req);
  if (!validationErrs.isEmpty()) {
    // removing uploaded files
    if (req.hasOwnProperty("files") && Array.isArray(req.files)) {
      req.files.forEach((file) => {
        if (existsSync(file.path)) {
          unlinkSync(file.path);
        }
      });
    }
    return res.status(400).json({ errors: validationErrs.array() });
  }
  next();
}

const createSchema = checkSchema({
  title: {
    trim: true,
    escape: true,
    isEmpty: {
      negated: true,
      errorMessage: (_, { req }) => req.t("required", { ns: 'validations', key: req.t("title") })
    },
  },
  rooms: {
    trim: true,
    escape: true,
    isEmpty: {
      negated: true,
      errorMessage: (_, { req }) => req.t("required", { ns: 'validations', key: req.t("rooms") })
    },
  },
  bathrooms: {
    trim: true,
    escape: true,
    isEmpty: {
      negated: true,
      errorMessage: (_, { req }) => req.t("required", { ns: 'validations', key: req.t("bathrooms") })
    },
  },
  bedrooms: {
    trim: true,
    escape: true,
    isEmpty: {
      negated: true,
      errorMessage: (_, { req }) => req.t("required", { ns: 'validations', key: req.t("bedrooms") })
    },
  },
  garage: {
    trim: true,
    escape: true,
    isEmpty: {
      negated: true,
      errorMessage: (_, { req }) => req.t("required", { ns: 'validations', key: req.t("garage") })
    },
  },
  price: {
    trim: true,
    escape: true,
    isEmpty: {
      negated: true,
      errorMessage: (_, { req }) => req.t("required", { ns: 'validations', key: req.t("price") })
    },
  },
  area: {
    trim: true,
    escape: true,
    isEmpty: {
      negated: true,
      errorMessage: (_, { req }) => req.t("required", { ns: 'validations', key: req.t("area") })
    },
  },
  description: {
    trim: true,
    escape: true,
    isEmpty: {
      negated: true,
      errorMessage: (_, { req }) => req.t("required", { ns: 'validations', key: req.t("description") })
    },
  },
  "location.city": {
    trim: true,
    escape: true,
    isEmpty: {
      negated: true,
      errorMessage: (_, { req }) => req.t("required", { ns: 'validations', key: req.t("city") })
    },
  },
  "location.address": {
    trim: true,
    escape: true,
    isEmpty: {
      negated: true,
      errorMessage: (_, { req }) => req.t("required", { ns: 'validations', key: req.t("address") })
    },
  },
  category: {
    trim: true,
    escape: true,
    isEmpty: {
      negated: true,
      errorMessage: (_, { req }) => req.t("required", { ns: 'validations', key: req.t("category") })
    },
  },
  user: {
    trim: true,
    escape: true,
    isEmpty: {
      negated: true,
      errorMessage: (_, { req }) => req.t("required", { ns: 'validations', key: req.t("user") })
    },
  },
  images: {
    escape: true,
    trim: true,
    custom: {
      options: async (_, { req }) => {
        if (!req?.files?.length > 0) {
          return Promise.reject(req.t('required', { ns: 'validations', key: req.t('images') }));
        }
        return Promise.resolve();
      }
    }
  },
});

const updateSchema = checkSchema({
  title: {
    trim: true,
    escape: true,
    isEmpty: {
      negated: true,
      errorMessage: (_, { req }) => req.t("required", { ns: 'validations', key: req.t("title") })
    },
  },
  rooms: {
    trim: true,
    escape: true,
    isEmpty: {
      negated: true,
      errorMessage: (_, { req }) => req.t("required", { ns: 'validations', key: req.t("rooms") })
    },
  },
  bathrooms: {
    trim: true,
    escape: true,
    isEmpty: {
      negated: true,
      errorMessage: (_, { req }) => req.t("required", { ns: 'validations', key: req.t("bathrooms") })
    },
  },
  bedrooms: {
    trim: true,
    escape: true,
    isEmpty: {
      negated: true,
      errorMessage: (_, { req }) => req.t("required", { ns: 'validations', key: req.t("bedrooms") })
    },
  },
  garage: {
    trim: true,
    escape: true,
    isEmpty: {
      negated: true,
      errorMessage: (_, { req }) => req.t("required", { ns: 'validations', key: req.t("garage") })
    },
  },
  price: {
    trim: true,
    escape: true,
    isEmpty: {
      negated: true,
      errorMessage: (_, { req }) => req.t("required", { ns: 'validations', key: req.t("price") })
    },
  },
  area: {
    trim: true,
    escape: true,
    isEmpty: {
      negated: true,
      errorMessage: (_, { req }) => req.t("required", { ns: 'validations', key: req.t("area") })
    },
  },
  description: {
    trim: true,
    escape: true,
    isEmpty: {
      negated: true,
      errorMessage: (_, { req }) => req.t("required", { ns: 'validations', key: req.t("description") })
    },
  },
  "location.city": {
    trim: true,
    escape: true,
    isEmpty: {
      negated: true,
      errorMessage: (_, { req }) => req.t("required", { ns: 'validations', key: req.t("city") })
    },
  },
  "location.address": {
    trim: true,
    escape: true,
    isEmpty: {
      negated: true,
      errorMessage: (_, { req }) => req.t("required", { ns: 'validations', key: req.t("address") })
    },
  },
  category: {
    trim: true,
    escape: true,
    isEmpty: {
      negated: true,
      errorMessage: (_, { req }) => req.t("required", { ns: 'validations', key: req.t("category") })
    },
  },
  user: {
    trim: true,
    escape: true,
    isEmpty: {
      negated: true,
      errorMessage: (_, { req }) => req.t("required", { ns: 'validations', key: req.t("user") })
    },
  },
  images: {
    escape: true,
    trim: true,
    custom: {
      options: async (_, { req }) => {
        if (!req?.files?.length > 0) {
          return Promise.reject(req.t('required', { ns: 'validations', key: req.t('images') }));
        }
        return Promise.resolve();
      }
    }
  },
});

export default {
  createEstate: [createSchema, errorHandler],
  updateEstate: [updateSchema, errorHandler]
};

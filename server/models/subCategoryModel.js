const slugify = require("slugify");
const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const subCategorySchema = new Schema(
  {
    title: {
      type: String,
      trim: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
    index: {
      type: Number,
    },

    slug: {
      type: String,
    },

    photos: [
      {
        type: String,
        required: [true, "Photo is required"],
        trim: true,
      },
    ],
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
    },

    brands: [
      {
        type: Schema.Types.ObjectId,
        ref: "Brand",
      },
    ],
  },
  {
    timestamps: true,
  }
);

// subCategorySchema.pre("save", function (next) {
//   this.slug = slugify(this.title, { lower: true });
//   next();
// });

const SubCategory = model("SubCategory", subCategorySchema);
module.exports = SubCategory;

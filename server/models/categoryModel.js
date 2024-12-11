const slugify = require("slugify");
const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const categorySchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Category title is required"],
      trim: true,
      unique: true,
    },

    isActive: {
      type: Boolean,
      default: true,
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

    subCategories: [
      {
        type: Schema.Types.ObjectId,
        ref: "SubCategory",
        require:[true,"Subcategory is required"]
      },
    ],
  },
  {
    timestamps: true,
  }
);

categorySchema.pre("save", function (next) {
  this.slug = slugify(this.title, { lower: true });
  next();
});

const Category = model("Category", categorySchema);
module.exports = Category;

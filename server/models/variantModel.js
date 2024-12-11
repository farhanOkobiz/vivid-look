const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const variantSchema = new Schema({
  colorName: {
    type: String,
    // required: [true, "Color name is required"],
  },

  colorCode: {
    type: String,
    validate: [
      {
        validator: function (value) {
          // Only validate the length if the value exists
          return !value || (value.length >= 4 && value.length <= 7);
        },
        message: "Color code length must be between 4 and 7 characters if provided",
      },
      {
        validator: function (value) {
          // Validate the hexadecimal format if the value exists
          return !value || /^#([0-9A-Fa-f]{3}){1,2}$/.test(value);
        },
        message: (props) =>
          `${props.value} is not a valid hexadecimal color code!`,
      },
    ],
  },
  

  details: {
    type: String,
  },

  options: [
    {
      type: Schema.Types.ObjectId,
      ref: "Option",
    },
  ],

  category: {
    type: Schema.Types.ObjectId,
    ref: "Category",
    required: [true, "Category is required"],
  },

  subCategory: {
    type: Schema.Types.ObjectId,
    ref: "SubCategory",
    required: [true, "Sub-Category is required"],
  },

  brand: {
    type: Schema.Types.ObjectId,
    ref: "Brand",
    // required: [true, "Brand is required"],
  },

  product: {
    type: Schema.Types.ObjectId,
    ref: "Product",
    required: [true, "Product id is required"],
  },
});

// Compound index to ensure unique combination of colorName and product
variantSchema.index({ product: 1, colorName: 1 }, { unique: true });

const Variant = model("Variant", variantSchema);
module.exports = Variant;

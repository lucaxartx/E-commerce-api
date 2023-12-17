const mongoose = require("mongoose");

const reviewSchema = mongoose.Schema(
  {
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: [true, "Please provide rating"],
    },
    title: {
      type: String,
      trim: true,
      required: [true, "Please provide review title"],
      maxlength: 100,
    },
    comment: { type: String, required: [true, "Please provide comment "] },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
    product: {
      type: mongoose.Schema.ObjectId,
      ref: "Product ",
    },
  },
  { timestamps: true }
);
reviewSchema.index({ product: 1, user: 1 }, { unique: true });

// auto update average rating and numOfReviews
reviewSchema.statics.calculateAverageRating = async function (productId) {
  console.log(productId);
  const result = this.aggregate([
    { $match: { product: productId } },
    {
      $group: {
        _id: null,
        averageRating: { $avg: "$rating" },
        numOfReviews: { $sum: 1 },
      },
    },
  ]);
  console.log(result);
  try {
    await this.model("Product").findOneAndUpdate(
      { _id: productId },
      {
        averageRating: Math.ceil(result[0]?.averageRating || 0),
        numOfReviews: result[0]?.numOfReviews || 0,
      }
    );
  } catch (error) {
    console.log(error);
  }
};

// when we use the update controller
ReviewSchema.post("save", async function () {
  console.log("post save hook called ");
  await this.constructor.calculateAverageRating(this.product);
});

//when we use the delete controller
ReviewSchema.post("remove", async function () {
  console.log("post remove hook called ");
  await this.constructor.calculateAverageRating(this.product);
});

module.exports = mongoose.model("Review", reviewSchema);

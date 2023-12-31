import mongoose from "mongoose";
import crypto from "crypto";

const UserSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: [true, "Please enter a userName"],
    },

    email: {
      type: String,
      required: [true, "Please enter a email address"],
      unique: true,
    },

    password: {
      type: String,
      required: [true, "Please enter a password"],
    },

    image: {
      type: String,
      default: "../assests/images/profile-pic-upload-placeholder.png",
    },

    orders: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
      },
    ],

    wishlists: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Wishlist",
      },
    ],

    isAdmin: {
      type: Boolean,
      default: false,
    },

    hasShippingAddress: {
      type: Boolean,
      default: false,
    },

    shippingAddress: {
      firstName: {
        type: String,
      },
      lastName: {
        type: String,
      },
      address: {
        type: String,
      },
      city: {
        type: String,
      },
      postalCode: {
        type: String,
      },
      state: {
        type: String,
      },
      country: {
        type: String,
      },
      phone: {
        type: String,
      },
    },

    passwordUpdatedAt: {
      type: String,
    },

    passwordResetToken: {
      type: String,
    },

    passwordResetTokenExpires: {
      type: Date,
    },
  },

  { timestamps: true }
);

// Update passwordChangedAt property
UserSchema.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
});

// Creating password reset token
UserSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.passwordResetTokenExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const User = mongoose.model("User", UserSchema);

export default User;

const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    fname: {
      type: String,
      require: true,
    },
    lname: {
      type: String,
      require: true,
    },
    email: {
      type: String,
      require: true,
    },
    password: {
      type: String,
      require: true,
    },
    role: {
      type: String,
      enum: ["CODEMODE", "CODEHASH"], // CODEMODE is Admin 😂 , CODEHASH is User👌
      default: "CODEHASH",
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function (oldPass) {
  return await bcrypt.compare(oldPass, this.password);
};
userSchema.methods.generateToken = async function () {
  return await jwt.sign(
    { id: this._id, email: this.email },
    process.env.JWT_SECRET,
    {
      expiresIn: "3d",
    }
  );
};

module.exports = mongoose.model("User", userSchema);

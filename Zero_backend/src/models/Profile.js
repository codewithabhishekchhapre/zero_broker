const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true }, // Reference to User
    profilePhoto: { type: String },
    whatsappNumber: { type: String },
    address: { type: String },
    aboutMe: { type: String },
    socialMediaLinks: {
      facebook: { type: String },
      instagram: { type: String },
      linkedin: { type: String },
      twitter: { type: String }
    },
    profession: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Profile", profileSchema);

const path = require("path");
const Profile = require("../models/Profile");

// Define your domain name
const DOMAIN = process.env.DOMAIN; // Load from environment variable

const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { whatsappNumber, address, aboutMe, profession } = req.body;

    // Parse social media links from form-data
    const socialMediaLinks = {
      facebook: req.body.facebook || "",
      instagram: req.body.instagram || "",
      linkedin: req.body.linkedin || "",
      twitter: req.body.twitter || ""
    };

    let profilePhoto = req.file ? req.file.path : null; // Get full file path

    if (profilePhoto) {
      // Extract only the part after "uploads/"
      const uploadsIndex = profilePhoto.indexOf("uploads");
      if (uploadsIndex !== -1) {
        profilePhoto = profilePhoto.substring(uploadsIndex); // Keep only "uploads/images/filename.jpg"
      }
      profilePhoto = profilePhoto.replace(/\\/g, "/"); // Convert Windows backslashes to forward slashes

      // Ensure we don't add DOMAIN again if it's already stored
      profilePhoto = `${DOMAIN}/${profilePhoto}`;
    }

    // Find existing profile
    let profile = await Profile.findOne({ user: userId });

    if (!profile) {
      profile = new Profile({
        user: userId,
        whatsappNumber,
        address,
        aboutMe,
        profession,
        socialMediaLinks,  // ✅ Add new field
        profilePhoto
      });
    } else {
      profile.whatsappNumber = whatsappNumber || profile.whatsappNumber;
      profile.address = address || profile.address;
      profile.aboutMe = aboutMe || profile.aboutMe;
      profile.profession = profession || profile.profession;
      profile.socialMediaLinks = { 
        ...profile.socialMediaLinks, 
        ...socialMediaLinks  // ✅ Merge new links while keeping old ones
      };

      // Only update the profilePhoto if a new one is provided
      if (profilePhoto) profile.profilePhoto = profilePhoto;
    }

    await profile.save();

    res.status(200).json({ 
      status: "success", 
      message: "Profile updated successfully", 
      data:profile
    });
  } catch (error) {
    res.status(500).json({ status: "failed", message: error.message });
  }
};
// Get Profile by User Role
const getProfile = async (req, res) => {
  try {
    const userId = req.user.id; // Get user ID from auth middleware

    // Find profile and populate user details
    let profile = await Profile.findOne({ user: userId }).populate("user", "fullname email mobile role");

    if (!profile) {
      // If profile doesn't exist, fetch user details separately
      const User = require("../models/User"); // Import the User model
      const user = await User.findById(userId).select("fullname email mobile role");

      if (!user) {
        return res.status(404).json({ status: "failed", message: "User not found" });
      }

      return res.status(200).json({
        status: "success",
        message: "User details retrieved successfully",
        data: {
          user, // Return only user details if no profile exists
        }
      });
    }

    res.status(200).json({
      status: "success",
      message: "User profile retrieved successfully",
      data: profile
    });
  } catch (error) {
    res.status(500).json({ status: "failed", message: error.message });
  }
};

module.exports = { updateProfile, getProfile };

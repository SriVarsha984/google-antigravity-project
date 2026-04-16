const User = require('../models/User');

// @desc    Update user profile (bio, pic)
// @route   PUT /api/users/profile
// @access  Private
const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      if (req.body.email && req.body.email !== user.email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(req.body.email)) return res.status(400).json({ message: 'Please provide a valid email address' });
        
        const emailExists = await User.findOne({ email: req.body.email });
        if (emailExists) return res.status(400).json({ message: 'Email address is already in use' });
        
        user.email = req.body.email;
      }

      user.bio = req.body.bio !== undefined ? req.body.bio : user.bio;
      user.profilePic = req.body.profilePic !== undefined ? req.body.profilePic : user.profilePic;
      user.name = req.body.name !== undefined ? req.body.name : user.name;
      user.phone = req.body.phone !== undefined ? req.body.phone : user.phone;
      user.websiteUrl = req.body.websiteUrl !== undefined ? req.body.websiteUrl : user.websiteUrl;
      user.theme = req.body.theme !== undefined ? req.body.theme : user.theme;
      user.defaultTab = req.body.defaultTab !== undefined ? req.body.defaultTab : user.defaultTab;
      
      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email,
        role: updatedUser.role,
        bio: updatedUser.bio,
        profilePic: updatedUser.profilePic,
        name: updatedUser.name,
        phone: updatedUser.phone,
        websiteUrl: updatedUser.websiteUrl,
        theme: updatedUser.theme,
        defaultTab: updatedUser.defaultTab,
        token: req.headers.authorization.split(' ')[1]
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Update Profile Error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Public
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { updateProfile, getUserProfile };

import User from "../models/User.js";
import bcrypt from "bcryptjs";

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const changePassword = async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) return res.status(404).json({ message: "User not found" });
    if (!(await user.matchPassword(currentPassword))) {
        return res.status(401).json({ message: "Current password is incorrect" });

    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    await user.save();
    res.status(200).json({ message: "Password changed successfully" });
};

export const changeEmail = async (req, res) => {
    const { newEmail } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) return res.status(404).json({ message: "User not found" });
    user.email = newEmail;
    await user.save();
    res.status(200).json({ message: "Email changed successfully" });
};

export const changeName = async (req, res) => {
    const { newName } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) return res.status(404).json({ message: "User not found" });
    user.name = newName;
    await user.save();
    res.status(200).json({ message: "Name changed successfully" });
};

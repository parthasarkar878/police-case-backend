import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

// LOGIN route
router.post("/login", async (req, res) => {
    const { userId, password } = req.body;

    try {
        const user = await User.findOne({ userId });
        if (!user) return res.status(400).json({ msg: "User not found" });

        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) return res.status(400).json({ msg: "Invalid password" });

        const token = jwt.sign(
            { userId: user.userId, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.json({ token, role: user.role });
    } catch (err) {
        res.status(500).send("Server error");
    }
});

// REGISTER route
router.post("/register", async (req, res) => {
    const { userId, password, role } = req.body;

    try {
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        const newUser = new User({
            userId,
            passwordHash,
            role
        });

        await newUser.save();
        res.json({ msg: "User created successfully" });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

export default router;

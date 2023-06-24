import { db } from "../connect.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import dotenv from "dotenv";

// import from blueimp-md5
import md5 from "blueimp-md5";

// Load env variables
dotenv.config();

/**
 * Register a new user
 */
export const register = (req, res) => {
    // Don't accept empty fields
    if (
        req.body.username === "" ||
        req.body.password === "" ||
        req.body.email === "" ||
        req.body.phone === ""
    )
        return res.status(400).json("Please fill all the fields!");

    // Check if user exists
    const q = "SELECT * FROM users WHERE username = ?";

    db.query(q, [req.body.username], (err, data) => {
        if (err) return res.status(500).json(err);
        if (data.length) return res.status(409).json("User already exists!");

        // Create New User
        // Hash the password
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(req.body.password, salt);

        // Generate avatar from https://www.gravatar.com/HASH
        // md5 encode email
        const hashedEmail = md5(req.body.email);
        const avatar = `https://www.gravatar.com/avatar/${hashedEmail}`;

        const q =
            "INSERT INTO users (`username`, `email`, `phone`, `password`, `avatar`) VALUE (?)";

        const values = [
            req.body.username,
            req.body.email,
            req.body.phone,
            hashedPassword,
            avatar,
        ];

        db.query(q, [values], (err, data) => {
            if (err) return res.status(500).json(err);
            return res.status(200).json("User created");
        });
    });
};

/**
 * Login a user
 */
export const login = (req, res) => {
    const q = "SELECT * FROM users WHERE username = ?";

    db.query(q, [req.body.username], (err, data) => {
        if (err) return res.status(500).json(err);
        if (data.length === 0) return res.status(404).json("User not found!");

        const checkPassword = bcrypt.compareSync(
            req.body.password,
            data[0].password
        );

        if (!checkPassword)
            return res.status(400).json("Wrong password or username!");

        const token = jwt.sign({ id: data[0].id }, process.env.PRIVATE_KEY);

        const { password, ...others } = data[0];

        res.cookie("accessToken", token, {
            httpOnly: true,
        })
            .status(200)
            .json(others);
    });
};

/**
 *  Logout a user
 */
export const logout = (req, res) => {
    res.clearCookie("accessToken", {
        secure: true,
        sameSite: "none",
    })
        .status(200)
        .json("User logged out!");
};

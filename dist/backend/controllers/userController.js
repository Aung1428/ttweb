"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signupUser = void 0;
const server_1 = require("../server");
const User_1 = require("../entities/User");
const signupUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { role, fullName, email, password, department } = req.body;
    try {
        const userRepo = server_1.AppDataSource.getRepository(User_1.User);
        const existingUser = yield userRepo.findOne({ where: { email } });
        if (existingUser) {
            return res.status(409).json({ message: "User already exists" });
        }
        const newUser = userRepo.create({
            role,
            fullName,
            email,
            password,
            department,
        });
        yield userRepo.save(newUser);
        res.status(201).json({ message: "User created successfully", user: newUser });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Signup failed" });
    }
});
exports.signupUser = signupUser;

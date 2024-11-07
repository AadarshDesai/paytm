const zod = require("zod");

const signupBody = zod.object({
    username: zod.string().email().min(3).max(30),
    password: zod.string().min(6),
    firstName: zod.string().min(1),
    lastName: zod.string().min(1)
});

const signinBody = zod.object({
    username: zod.string().email().min(3).max(30),
    password: zod.string().min(6),
});

const updateBody = zod.object({
    password: zod.string().optional(),
    firstName: zod.string().optional(),
    lastName: zod.string().optional()
});

module.exports = {
    signupBody,
    signinBody,
    updateBody
}
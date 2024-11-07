const express = require("express");
const {signupBody, signinBody, updateBody} = require("../type");
const { User, Account } = require("../db");
const { JWT_SECRET } = require("../config");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middleware");

const router = express.Router();

router.post("/signup", async function(req, res){
    const createPayload = req.body;
    const parsePayload = signupBody.safeParse(createPayload);
    if(!parsePayload.success){
        res.status(411).json({
            message: "Please enter correct inputs"
        });
        return;
    } 

    const existingUser = await User.findOne({
        username: createPayload.username
    });

    if(existingUser){
        return res.status(411).json({
            message: "User already exists"
        })
    }
    const user = await User.create({
        username: createPayload.username,
        password: createPayload.password,
        firstName: createPayload.firstName,
        lastName: createPayload.lastName
    });
    const userId = user._id;

    // *------------- Create BankAccount ---------------*

    const account = await Account.create({
        userId,
        balance: 1 + Math.random()* 10000
    });

    // ---------------------------------------------------

    const token = jwt.sign({
        userId
    }, JWT_SECRET);

    res.json({
        message: "User created successfully",
        jwt: token
    })
});

router.post("/signin", async function(req, res){
    const createPayload = req.body;
    const parsePayload = signinBody.safeParse(createPayload);

    if(!parsePayload.success){
        res.status(411).json({
            message: "Invalid Input"
        });
    }

    const user = await User.findOne({
        username: createPayload.username,
        password: createPayload.password
    });

    if(user){
        const token = jwt.sign({
            userId: user._id
        }, JWT_SECRET);

        res.json({
            jwt: token
        });
        return;
    }

    res.status(411).json({
        message: "Invalid Credentials"
    });

});

router.put("/", authMiddleware, async function(req, res){
    const body = req.body;
    const parseBody = updateBody.safeParse(body);
    if(!parseBody.success){
        res.status(411).json({
            message: "Error while updating information"
        })
    }

    await User.updateOne({
        _id:req.userId
    }, body);

    res.json({
        message: "Updated Successfully"
    })
});

router.get("/bulk", async function(req, res){
    const filter = req.query.filter || "";

    const users = await User.find({
        $or: [{
            firstName: {
                $regex: filter
            }
        }, {
            lastName: {
                $regex: filter
            }
        }]
    })

    res.json({
        user: users.map(user => ({
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            _id: user._id
        }))
    })
});

module.exports = router 
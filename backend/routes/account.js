const express = require("express");
const authMiddleware = require("../middleware");
const { Account } = require("../db");
const mongoose = require("mongoose");
const { sendMoney } = require("../type");

const router = express.Router();

router.get("/balance", authMiddleware, async function(req, res){
    const account = await Account.findOne({
        userId: req.userId
    });

    res.json({
        balance: account.balance
    });
});

router.post("/transfer", authMiddleware, async function(req, res){
    const session = await mongoose.startSession();
    const body = req.body;
    const parseBody = sendMoney.safeParse(body);

    if(!parseBody.success){
        res.status(411).json({
            message: "Invalid amount"
        });
        return;
    }

    session.startTransaction();

    const account = await Account.findOne({userId: req.userId}).session(session);

    if(!account || account.balance < body.amount){
        await session.abortTransaction();
        return res.status(400).json({
            message: "Insufficient Balance"
        });
    }

    const toAccount = await Account.findOne({userId: body.to}).session(session);

    if(!toAccount){
        await session.abortTransaction();
        return res.status(400).json({
            message: "Account does not exist"
        });
    }

    await Account.updateOne({
        userId: req.userId
    }, {
        $inc:{
            balance: - body.amount
        }
    }).session(session);

    await Account.updateOne({
        userId: req.to
    }, {
        $inc: {
            balance: body.amount
        }
    }).session(session);

    await session.commitTransaction();
    res.json({
        message: "Transfer successfull"
    });
});

module.exports = router;
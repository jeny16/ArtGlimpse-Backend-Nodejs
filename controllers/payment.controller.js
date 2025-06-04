// backend/controllers/paymentController.js

const Razorpay = require("razorpay");

const instance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

exports.createOrder = async (req, res) => {
    const { amount, currency = "INR", receipt = "receipt_order_001" } = req.body;
    try {
        const options = {
            amount: amount * 100, // in paise
            currency,
            receipt,
        };

        const order = await instance.orders.create(options);
        res.status(200).json({ success: true, order });
    } catch (error) {
        console.error("Error creating Razorpay order", error);
        res.status(500).json({ success: false, message: "Order creation failed" });
    }
};

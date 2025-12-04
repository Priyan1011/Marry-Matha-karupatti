const Order = require("../../models/Order");
const Cart = require("../../models/Cart");
const Product = require("../../models/Product");

// ✅ NEW COD ORDER CREATION - REPLACES OLD PAYPAL LOGIC
const createOrder = async (req, res) => {
  try {
    const {
      userId,
      cartItems,
      addressInfo,
      orderStatus,
      paymentMethod,
      paymentStatus,
      totalAmount,
      orderDate,
      orderUpdateDate,
      cartId,
    } = req.body;

    // ✅ STEP 1: Validate cart and address
    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty",
      });
    }

    if (!addressInfo) {
      return res.status(400).json({
        success: false,
        message: "Address is required",
      });
    }

    // ✅ STEP 2: Check if payment method is COD
    if (paymentMethod === "cod") {
      // ✅ DIRECT CREATE ORDER - NO PAYPAL
      const newlyCreatedOrder = new Order({
        userId,
        cartId,
        cartItems,
        addressInfo,
        orderStatus: "confirmed", // ✅ For COD, order is confirmed immediately
        paymentMethod: "cod",
        paymentStatus: "pending", // ✅ Payment pending until cash received
        totalAmount,
        orderDate: new Date(),
        orderUpdateDate: new Date(),
        paymentId: "", // Empty for COD
        payerId: "", // Empty for COD
      });

      await newlyCreatedOrder.save();

      // ✅ STEP 3: Reduce stock for each item
      for (let item of cartItems) {
        let product = await Product.findById(item.productId);
        if (!product) {
          return res.status(404).json({
            success: false,
            message: `Product ${item.title} not found`,
          });
        }

        // ✅ Reduce total stock by quantity ordered
        product.totalStock -= item.quantity;
        await product.save();
      }

      // ✅ STEP 4: Clear cart after order creation
      if (cartId) {
        await Cart.findByIdAndDelete(cartId);
      }

      // ✅ STEP 5: Return success response
      return res.status(201).json({
        success: true,
        message: "Order placed successfully with COD",
        data: newlyCreatedOrder,
        orderId: newlyCreatedOrder._id,
      });
    }

    // ✅ FOR FUTURE: If payment method is other than COD
    return res.status(400).json({
      success: false,
      message: "Only COD payment method is available now",
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Error creating order",
    });
  }
};

// ✅ LEGACY: Capture payment (NOT USED FOR COD)
const capturePayment = async (req, res) => {
  try {
    // ✅ For now, this is disabled for COD
    return res.status(400).json({
      success: false,
      message: "Payment capture not available for COD",
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occurred",
    });
  }
};

// ✅ GET ALL ORDERS BY USER
const getAllOrdersByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const orders = await Order.find({ userId }).sort({ orderDate: -1 });

    if (!orders.length) {
      return res.status(404).json({
        success: false,
        message: "No orders found!",
      });
    }

    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Error fetching orders",
    });
  }
};

// ✅ GET SINGLE ORDER DETAILS BY CUSTOMER
const getOrderDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found!",
      });
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Error fetching order details",
    });
  }
};

module.exports = {
  createOrder,
  capturePayment,
  getAllOrdersByUser,
  getOrderDetails,
};
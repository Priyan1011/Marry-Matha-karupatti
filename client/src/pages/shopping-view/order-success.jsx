import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { CheckCircle, Package, Truck, Home, Clock, MapPin, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';

const OrderSuccessPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [orderId, setOrderId] = useState('');
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const id = queryParams.get('orderId');
    
    if (id) {
      setOrderId(id);
      fetchOrderDetails(id);
    } else {
      navigate('/shop/listing');
    }
  }, [location, navigate]);

  const fetchOrderDetails = async (id) => {
    try {
      // Mock data - replace with actual API call
      setTimeout(() => {
        setOrderDetails({
          id: id,
          status: 'confirmed',
          date: new Date().toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
          }),
          time: new Date().toLocaleTimeString('en-IN', {
            hour: '2-digit',
            minute: '2-digit'
          }),
          total: '500.00',
          items: [
            { name: 'Karupatti (Palm Jaggery)', quantity: 1, price: '300.00' },
            { name: 'Karupatti Powder', quantity: 1, price: '200.00' }
          ],
          shippingAddress: {
            address: 'Narippaiyur Village',
            city: 'Ramanathapuram',
            pincode: '623525',
            state: 'Tamil Nadu',
            phone: '+91 70923 37678'
          },
          paymentMethod: 'Cash on Delivery',
          orderNumber: id.replace('ORD-', '')
        });
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching order details:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-karupatti-accent mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-karupatti-cream to-karupatti-creamDark py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Success Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-8 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            
            <h1 className="font-serif text-3xl font-bold text-gray-900 mb-3">
              Order Confirmed Successfully!
            </h1>
            <p className="text-gray-600 mb-2">
              Thank you for your order. We've received it and will process it shortly.
            </p>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-karupatti-cream rounded-full">
              <Clock className="w-4 h-4 text-karupatti-accent" />
              <span className="text-sm font-medium text-karupatti-brown">
                Order #{orderDetails.orderNumber}
              </span>
            </div>
          </div>

          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Order Info */}
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-lg text-gray-900 mb-3 flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5 text-karupatti-accent" />
                    Order Information
                  </h3>
                  <div className="space-y-3 pl-7">
                    <div>
                      <p className="text-sm text-gray-500">Order Date & Time</p>
                      <p className="font-medium">{orderDetails.date} at {orderDetails.time}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Status</p>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                        {orderDetails.status.toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Payment Method</p>
                      <p className="font-medium">{orderDetails.paymentMethod}</p>
                    </div>
                  </div>
                </div>

                {/* Shipping Address */}
                <div>
                  <h3 className="font-semibold text-lg text-gray-900 mb-3 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-karupatti-accent" />
                    Shipping Address
                  </h3>
                  <div className="pl-7">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="font-medium">{orderDetails.shippingAddress.address}</p>
                      <p className="text-gray-600">{orderDetails.shippingAddress.city}, {orderDetails.shippingAddress.state}</p>
                      <p className="text-gray-600">PIN: {orderDetails.shippingAddress.pincode}</p>
                      <p className="text-gray-600 mt-2">Phone: {orderDetails.shippingAddress.phone}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div>
                <h3 className="font-semibold text-lg text-gray-900 mb-3">Order Summary</h3>
                <div className="border rounded-lg overflow-hidden">
                  <div className="divide-y">
                    {orderDetails.items.map((item, index) => (
                      <div key={index} className="p-4 flex justify-between items-center">
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                        </div>
                        <p className="font-semibold">₹{item.price}</p>
                      </div>
                    ))}
                  </div>
                  
                  <div className="bg-gray-50 p-4">
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-medium">₹{orderDetails.total}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-600">Shipping</span>
                      <span className="font-medium text-green-600">Free</span>
                    </div>
                    <div className="flex justify-between pt-3 border-t">
                      <span className="text-lg font-bold">Total Amount</span>
                      <span className="text-lg font-bold text-karupatti-accent">₹{orderDetails.total}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h3 className="font-semibold text-xl text-gray-900 mb-6">What happens next?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 border rounded-lg">
              <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-xl font-bold text-blue-600">1</span>
              </div>
              <h4 className="font-semibold mb-2">Order Processing</h4>
              <p className="text-sm text-gray-600">We'll verify your order and prepare it for shipping</p>
            </div>
            
            <div className="text-center p-4 border rounded-lg">
              <div className="w-12 h-12 bg-yellow-50 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-xl font-bold text-yellow-600">2</span>
              </div>
              <h4 className="font-semibold mb-2">Quality Check</h4>
              <p className="text-sm text-gray-600">Every product undergoes our traditional quality check</p>
            </div>
            
            <div className="text-center p-4 border rounded-lg">
              <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-xl font-bold text-green-600">3</span>
              </div>
              <h4 className="font-semibold mb-2">Shipping</h4>
              <p className="text-sm text-gray-600">Your order will be shipped within 24-48 hours</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/shop/listing">
            <Button className="bg-karupatti-accent hover:bg-karupatti-brownDark">
              <Home className="w-4 h-4 mr-2" />
              Continue Shopping
            </Button>
          </Link>
          
          <Button variant="outline" onClick={() => window.print()}>
            Print Order Details
          </Button>
          
          <Link to="/shop/account">
            <Button variant="outline" className="border-karupatti-accent text-karupatti-accent hover:bg-karupatti-accent hover:text-white">
              View Order History
            </Button>
          </Link>
        </div>

        {/* Help Section */}
        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-4">
            Need help with your order? Contact us at{' '}
            <a href="mailto:marrymathakarupatti@gmail.com" className="text-karupatti-accent font-medium">
              marrymathakarupatti@gmail.com
            </a>
          </p>
          <p className="text-sm text-gray-500">
            We'll send you email updates about your order status. You can also track your order in your account.
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
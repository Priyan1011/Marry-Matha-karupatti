import { useState } from "react";
import CommonForm from "../common/form";
import {
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { Badge } from "../ui/badge";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllOrdersForAdmin,
  getOrderDetailsForAdmin,
  updateOrderStatus,
} from "@/store/admin/order-slice";
import { useToast } from "../ui/use-toast";

const initialFormData = {
  status: "",
};

function AdminOrderDetailsView({ orderDetails }) {
  const [formData, setFormData] = useState(initialFormData);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const { toast } = useToast();

  function handleUpdateStatus(event) {
    event.preventDefault();
    const { status } = formData;

    dispatch(
      updateOrderStatus({ id: orderDetails?._id, orderStatus: status })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(getOrderDetailsForAdmin(orderDetails?._id));
        dispatch(getAllOrdersForAdmin());
        setFormData(initialFormData);
        toast({
          title: data?.payload?.message,
        });
      }
    });
  }

  if (!orderDetails) return null;

  return (
    <DialogContent className="max-w-2xl max-h-[90vh] overflow-auto">
      {/* Hidden title/description for accessibility */}
      <DialogTitle className="sr-only">
        Order {orderDetails?._id}
      </DialogTitle>
      <DialogDescription className="sr-only">
        Order details and status update form
      </DialogDescription>

      <div className="grid gap-6">
        <div className="grid gap-2">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium">Order ID</p>
              <p className="text-lg font-semibold">
                {orderDetails?._id}
              </p>
            </div>
            <Badge>{orderDetails?.orderStatus}</Badge>
          </div>
          <Separator />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label className="text-base">Order Date</Label>
            <p className="text-sm">
              {orderDetails?.orderDate.split("T")[0]}
            </p>
          </div>
          <div className="grid gap-2">
            <Label className="text-base">Order Price</Label>
            <p className="text-sm font-semibold">
              ${orderDetails?.totalAmount}
            </p>
          </div>
          <div className="grid gap-2">
            <Label className="text-base">Payment Method</Label>
            <p className="text-sm">
              {orderDetails?.paymentMethod}
            </p>
          </div>
          <div className="grid gap-2">
            <Label className="text-base">Payment Status</Label>
            <Badge variant="outline">
              {orderDetails?.paymentStatus}
            </Badge>
          </div>
        </div>

        <Separator />

        <div className="grid gap-2">
          <Label className="text-base font-semibold">Order Details</Label>
          <div className="max-h-48 overflow-auto">
            {orderDetails?.cartItems && orderDetails?.cartItems.length > 0
              ? orderDetails?.cartItems.map((item, index) => (
                  <div key={index} className="flex justify-between mb-2 p-2 border-b">
                    <div>
                      <p className="font-medium">{item.title}</p>
                      <p className="text-sm text-gray-600">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <p className="font-semibold">${item.price}</p>
                  </div>
                ))
              : null}
          </div>
        </div>

        <Separator />

        <div className="grid gap-2">
          <Label className="text-base font-semibold">
            Shipping Info
          </Label>
          <div className="text-sm space-y-1">
            <p>
              <span className="font-medium">Name:</span>{" "}
              {user.userName}
            </p>
            <p>
              <span className="font-medium">Address:</span>{" "}
              {orderDetails?.addressInfo?.address}
            </p>
            <p>
              <span className="font-medium">City:</span>{" "}
              {orderDetails?.addressInfo?.city}
            </p>
            <p>
              <span className="font-medium">Pincode:</span>{" "}
              {orderDetails?.addressInfo?.pincode}
            </p>
            <p>
              <span className="font-medium">Phone:</span>{" "}
              {orderDetails?.addressInfo?.phone}
            </p>
            {orderDetails?.addressInfo?.notes && (
              <p>
                <span className="font-medium">Notes:</span>{" "}
                {orderDetails?.addressInfo?.notes}
              </p>
            )}
          </div>
        </div>

        <Separator />

        <div className="grid gap-4">
          <Label className="text-base font-semibold">
            Update Order Status
          </Label>
          <CommonForm
            onSubmit={handleUpdateStatus}
            formData={formData}
            setFormData={setFormData}
            buttonText="Update Status"
            formControls={[
              {
                label: "Order Status",
                name: "status",
                componentType: "select",
                options: [
                  { id: "pending", label: "Pending" },
                  { id: "inProcess", label: "In Process" },
                  { id: "inShipping", label: "In Shipping" },
                  { id: "delivered", label: "Delivered" },
                  { id: "rejected", label: "Rejected" },
                ],
              },
            ]}
            isBtnDisabled={!formData.status}
          />
        </div>
      </div>
    </DialogContent>
  );
}

export default AdminOrderDetailsView;

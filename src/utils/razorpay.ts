// utils/razorpay.ts

interface RazorpayOptions {
  amount: number;
  name: string;
  description: string;
  email: string;
  contact?: string;
  onSuccess: (response: any) => void;
  onFailure?: () => void;
}

export const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]')) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export const openRazorpay = async ({
  amount,
  name,
  description,
  email,
  contact,
  onSuccess,
  onFailure,
}: RazorpayOptions) => {
  const isLoaded = await loadRazorpayScript();
  if (!isLoaded) {
    alert("Razorpay SDK failed to load. Please check your internet connection.");
    return;
  }

  const options = {
    key:  import.meta.env.VITE_RAZORPAY_KEY, // 🔁 Replace with your real Razorpay Key ID
    amount: amount * 100, // Convert ₹ to paise
    currency: "INR",
    name,
    description,
    handler: onSuccess,
    prefill: {
      email,
      contact,
    },
    theme: {
      color: "#6366f1",
    },
  };

  const paymentObject = new (window as any).Razorpay(options);
  paymentObject.on("payment.failed", onFailure || (() => alert("Payment failed")));
  paymentObject.open();
};
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Scissors } from "lucide-react";
import { useNavigate, useLocation } from "react-router";
import { toast } from "react-toastify";
import axios from "axios";
import { BASE_URL } from "@/lib/constants";

const formSchema = z.object({
  otp: z.string().length(6, {
    message: "OTP must be exactly 6 digits",
  }),
});

export default function VerifyOTP() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  if (!email) {
    navigate("/forgot-password");
    return null;
  }

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      otp: "",
    },
  });

  async function onSubmit(values) {
    setIsLoading(true);
    try {
      const response = await axios.post(`${BASE_URL}/verify-otp`, {
        email,
        otp: values.otp,
      });
      toast.success("OTP verified successfully!");
      navigate("/reset-password", {
        state: {
          resetToken: response.data.resetToken,
          email,
        },
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid OTP");
    }
    setIsLoading(false);
  }

  const handleResendOTP = async () => {
    try {
      await axios.post(`${BASE_URL}/resend-otp`, { email });
      toast.success("New OTP has been sent to your email!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to resend OTP");
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <div className="flex justify-center">
          <Scissors className="w-10 h-10 text-indigo-950" />
        </div>
        <h1 className="text-2xl font-semibold tracking-tight text-indigo-950">
          Verify OTP
        </h1>
        <p className="text-sm text-gray-500">
          Enter the 6-digit code sent to your email
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="otp"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-indigo-950">OTP Code</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter 6-digit code"
                    {...field}
                    maxLength={6}
                    className="border-gray-200 focus:border-indigo-950 focus:ring-indigo-950 text-center tracking-widest"
                  />
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-indigo-950 hover:bg-indigo-900 text-white"
          >
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Verifying...</span>
              </div>
            ) : (
              "Verify OTP"
            )}
          </Button>
        </form>
      </Form>

      <div className="text-center">
        <button
          onClick={handleResendOTP}
          className="text-sm text-indigo-950 hover:underline"
        >
          Didn't receive the code? Resend OTP
        </button>
      </div>
    </div>
  );
}

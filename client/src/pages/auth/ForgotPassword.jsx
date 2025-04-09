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
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import axios from "axios";
import { BASE_URL } from "@/lib/constants";

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
});

export default function ForgotPassword() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(values) {
    setIsLoading(true);
    try {
      const response = await axios.post(`${BASE_URL}/forgot-password`, {
        email: values.email,
      });
      toast.success("OTP has been sent to your email!");
      navigate("/verify-otp", { state: { email: values.email } });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send OTP");
    }
    setIsLoading(false);
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <div className="flex justify-center">
          <Scissors className="w-10 h-10 text-indigo-950" />
        </div>
        <h1 className="text-2xl font-semibold tracking-tight text-indigo-950">
          Forgot Password
        </h1>
        <p className="text-sm text-gray-500">
          Enter your email to receive a password reset code
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-indigo-950">Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your email"
                    {...field}
                    className="border-gray-200 focus:border-indigo-950 focus:ring-indigo-950"
                  />
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-indigo-950 hover:bg-indigo-900 text-white mt-6"
          >
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Sending...</span>
              </div>
            ) : (
              "Send Reset Code"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}

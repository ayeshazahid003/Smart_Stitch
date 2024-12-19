import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import axios from "axios";
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
import { Link, useNavigate } from "react-router";
import { useUser } from "../../context/UserContext";
import { toast } from "react-toastify"; // Import toast

// Define the form schema
const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters long.",
  }),
});

export default function SignInForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { login } = useUser();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values) {
    setIsLoading(true);
    setError(null); // Reset error state
    try {
      await login(values.email, values.password);
      toast.success("Login successful!");
      navigate("/profile");
    } catch (err) {
      // setError("Login failed. Please check your credentials and try again.");
      toast.error("Login failed. Please check your credentials and try again."); // Show error toast
    }
    setIsLoading(false);
  }

  return (
    <div className="space-y-6">
      {/* Form Header */}
      <div className="space-y-2 text-center">
        <div className="flex justify-center">
          <Scissors className="w-10 h-10 text-indigo-950" />
        </div>
        <h1 className="text-2xl font-semibold tracking-tight text-indigo-950">
          Welcome back
        </h1>
        <p className="text-sm text-gray-500">
          Sign in to access your tailoring dashboard
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
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-indigo-950">Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Enter your password"
                    {...field}
                    className="border-gray-200 focus:border-indigo-950 focus:ring-indigo-950"
                  />
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />
          <div className="flex items-center justify-end">
            <Link
              to="/forgot-password"
              className="text-sm text-indigo-950 hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          {error && <p className="text-red-500">{error}</p>}{" "}
          {/* Display error */}
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-indigo-950 hover:bg-indigo-900 text-white mt-6"
          >
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Signing In...</span>
              </div>
            ) : (
              "Sign In"
            )}
          </Button>
        </form>
      </Form>

      {/* Footer */}
      <div className="text-center text-sm text-gray-500">
        Don&apos;t have an account?{" "}
        <Link
          to="/register"
          className="text-indigo-950 hover:underline font-medium"
        >
          Register
        </Link>
      </div>
    </div>
  );
}

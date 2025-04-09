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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Scissors } from "lucide-react";
import { Link } from "react-router";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
import { useUser } from "../../context/UserContext"; // Import useUser

// Define the form schema
const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters long.",
  }),
  role: z.enum(["tailor", "customer", "platformAdmin"], {
    required_error: "Please select a role.",
  }),
});

export default function RegisterForm() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: undefined,
    },
  });
  const { register } = useUser(); // Destructure register from useUser
  const [error, setError] = useState(null); // Add error state

  async function onSubmit(values) {
    setIsLoading(true);
    console.log(values);
    setError(null); // Reset error state
    try {
      await register(values.name, values.email, values.password, values.role);
      toast.success("Registration successful!");
      navigate("/login");
    } catch (err) {
      setError("Registration failed. Please try again.");
      toast.error("Registration failed. Please try again."); // Show error toast
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
          Create your account
        </h1>
        <p className="text-sm text-gray-500">
          Enter your details to start your tailoring journey
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-indigo-950">Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your name"
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
                    placeholder="Create a password"
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
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-indigo-950">Role</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="border-gray-200 focus:border-indigo-950 focus:ring-indigo-950">
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="customer">Customer</SelectItem>
                    <SelectItem value="tailor">Tailor</SelectItem>
                    <SelectItem value="platformAdmin">
                      Platform Admin
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />
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
                <span>Registering...</span>
              </div>
            ) : (
              "Register"
            )}
          </Button>
        </form>
      </Form>

      {/* Footer */}
      <div className="text-center text-sm text-gray-500">
        Already have an account?{" "}
        <Link
          to="/login"
          className="text-indigo-950 hover:underline font-medium"
        >
          Sign in
        </Link>
      </div>
    </div>
  );
}

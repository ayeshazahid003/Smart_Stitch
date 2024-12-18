import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ProfileSchema } from "../../../validation/UserProfile";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useUser } from "../../../context/UserContext";
import { toast } from "react-toastify";
import { useState, useEffect } from "react";

export default function ProfileForm() {
  const { user, updateUserProfile } = useUser();
  const [loading, setLoading] = useState(true);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(ProfileSchema),
    defaultValues: {
      name: "",
      email: "",
      role: "customer",
    },
  });

  useEffect(() => {
    if (user) {
      reset({
        name: user.name || "",
        email: user.email || "",
        role: user.role || "customer",
      });
      setLoading(false);
    }
  }, [user, reset]);

  const onSubmit = async (data) => {
    try {
      console.log("data", data);
      await updateUserProfile({ ...user, ...data });
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error("Failed to update profile");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-md shadow-md">
      <h2 className="text-lg font-semibold mb-4">Update Profile</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            {...register("name")}
            className="mt-1 block w-full"
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
          )}
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            {...register("email")}
            className="mt-1 block w-full"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>
        <div>
          <Label htmlFor="role">Role</Label>
          <Controller
            name="role"
            control={control}
            render={({ field }) => (
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="mt-1 block w-full"
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="customer">Customer</SelectItem>
                  <SelectItem value="tailor">Tailor</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {errors.role && (
            <p className="text-red-500 text-sm mt-1">{errors.role.message}</p>
          )}
        </div>
        <Button
          type="submit"
          className="w-full bg-[#111827] text-white py-2 rounded-md"
        >
          Save
        </Button>
      </form>
    </div>
  );
}

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AddressSchema } from "../../../validation/UserProfile";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useUser } from "../../../context/UserContext";
import { toast } from "react-toastify";
import { useState, useEffect } from "react";

export default function AddressForm() {
  const { user, updateUserProfile } = useUser();
  const [loading, setLoading] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(AddressSchema),
    defaultValues: {
      line1: "",
      line2: "",
      city: "",
      state: "",
      postalCode: "",
      country: "",
    },
  });

  useEffect(() => {
    if (user) {
      reset(user.contactInfo?.address || {
        line1: "",
        line2: "",
        city: "",
        state: "",
        postalCode: "",
        country: "",
      });
      setLoading(false);
    }
  }, [user, reset]);

  const onSubmit = async (data) => {
    try {
      await updateUserProfile({
        ...user,
        contactInfo: {
          ...user?.contactInfo,
          address: data,
        },
      });
      toast.success("Address updated successfully");
    } catch (error) {
      toast.error("Failed to update address");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-md shadow-md">
      <h2 className="text-lg font-semibold mb-4">Address</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label htmlFor="line1">Address Line 1</Label>
          <Input
            id="line1"
            {...register("line1")}
            className="mt-1 block w-full"
          />
          {errors.line1 && (
            <p className="text-red-500 text-sm mt-1">{errors.line1.message}</p>
          )}
        </div>
        <div>
          <Label htmlFor="line2">Address Line 2</Label>
          <Input
            id="line2"
            {...register("line2")}
            className="mt-1 block w-full"
          />
          {errors.line2 && (
            <p className="text-red-500 text-sm mt-1">{errors.line2.message}</p>
          )}
        </div>
        <div>
          <Label htmlFor="city">City</Label>
          <Input
            id="city"
            {...register("city")}
            className="mt-1 block w-full"
          />
          {errors.city && (
            <p className="text-red-500 text-sm mt-1">{errors.city.message}</p>
          )}
        </div>
        <div>
          <Label htmlFor="state">State</Label>
          <Input
            id="state"
            {...register("state")}
            className="mt-1 block w-full"
          />
          {errors.state && (
            <p className="text-red-500 text-sm mt-1">{errors.state.message}</p>
          )}
        </div>
        <div>
          <Label htmlFor="postalCode">Postal Code</Label>
          <Input
            id="postalCode"
            {...register("postalCode")}
            className="mt-1 block w-full"
          />
          {errors.postalCode && (
            <p className="text-red-500 text-sm mt-1">
              {errors.postalCode.message}
            </p>
          )}
        </div>
        <div>
          <Label htmlFor="country">Country</Label>
          <Input
            id="country"
            {...register("country")}
            className="mt-1 block w-full"
          />
          {errors.country && (
            <p className="text-red-500 text-sm mt-1">
              {errors.country.message}
            </p>
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

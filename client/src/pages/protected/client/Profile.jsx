import { useEffect, useState } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserSchema } from "../../../validation/UserProfile";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { useUser } from "../../../context/UserContext";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";

export default function UserProfileForm() {
  const [showMeasurements, setShowMeasurements] = useState(true);
  const { getUserProfile, user, updateUserProfile } = useUser();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(UserSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      role: user?.role || "customer",
      contactInfo: {
        phone: user?.contactInfo?.phone || "",
        address: {
          line1: user?.contactInfo?.address?.line1 || "",
          line2: user?.contactInfo?.address?.line2 || "",
          city: user?.contactInfo?.address?.city || "",
          state: user?.contactInfo?.address?.state || "",
          postalCode: user?.contactInfo?.address?.postalCode || "",
          country: user?.contactInfo?.address?.country || "",
        },
      },
      measurements: user?.measurements || [],
    },
  });

  useEffect(() => {
    getUserProfile();
  }, []);

  const { fields, append, remove } = useFieldArray({
    control,
    name: "measurements",
  });
  console.log("errors", errors);
  const onSubmit = async (data) => {
    // Parse measurement fields to numbers
    data.measurements = data.measurements.map((measurement) => ({
      ...measurement,
      data: {
        ...measurement.data,
        height: Number(measurement.data.height) || 0, // Ensure height is a number
        chest: Number(measurement.data.chest) || 0,
        waist: Number(measurement.data.waist) || 0,
        hips: Number(measurement.data.hips) || 0,
        shoulder: Number(measurement.data.shoulder) || 0,
        wrist: Number(measurement.data.wrist) || 0,
        sleeves: Number(measurement.data.sleeves) || 0,
        neck: Number(measurement.data.neck) || 0,
        lowerBody: {
          ...measurement.data.lowerBody,
          length: Number(measurement.data.lowerBody.length) || 0,
          waist: Number(measurement.data.lowerBody.waist) || 0,
          inseam: Number(measurement.data.lowerBody.inseam) || 0,
          thigh: Number(measurement.data.lowerBody.thigh) || 0,
          ankle: Number(measurement.data.lowerBody.ankle) || 0,
        },
      },
    }));

    try {
      await updateUserProfile(data);
      toast.success("Profile updated successfully");
      navigate("/");
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg rounded-lg">
      <CardHeader className="bg-blue-500 text-white p-4 rounded-t-lg">
        <CardTitle className="text-xl font-bold">User Profile</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Name
              </Label>
              <Input
                id="name"
                {...register("name")}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>
            <div>
              <Label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </Label>
              <Input
                id="email"
                type="email"
                {...register("email")}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <Label
              htmlFor="role"
              className="block text-sm font-medium text-gray-700"
            >
              Role
            </Label>
            <Controller
              name="role"
              control={control}
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a role" />
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label
                htmlFor="contactInfo.phone"
                className="block text-sm font-medium text-gray-700"
              >
                Phone
              </Label>
              <Input
                id="contactInfo.phone"
                {...register("contactInfo.phone")}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
              />
            </div>
            <div>
              <Label
                htmlFor="contactInfo.address.line1"
                className="block text-sm font-medium text-gray-700"
              >
                Address Line 1
              </Label>
              <Input
                id="contactInfo.address.line1"
                {...register("contactInfo.address.line1")}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
              />
            </div>
            <div>
              <Label
                htmlFor="contactInfo.address.line2"
                className="block text-sm font-medium text-gray-700"
              >
                Address Line 2
              </Label>
              <Input
                id="contactInfo.address.line2"
                {...register("contactInfo.address.line2")}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
              />
            </div>
            <div>
              <Label
                htmlFor="contactInfo.address.city"
                className="block text-sm font-medium text-gray-700"
              >
                City
              </Label>
              <Input
                id="contactInfo.address.city"
                {...register("contactInfo.address.city")}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
              />
            </div>
            <div>
              <Label
                htmlFor="contactInfo.address.state"
                className="block text-sm font-medium text-gray-700"
              >
                State
              </Label>
              <Input
                id="contactInfo.address.state"
                {...register("contactInfo.address.state")}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
              />
            </div>
            <div>
              <Label
                htmlFor="contactInfo.address.postalCode"
                className="block text-sm font-medium text-gray-700"
              >
                Postal Code
              </Label>
              <Input
                id="contactInfo.address.postalCode"
                {...register("contactInfo.address.postalCode")}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
              />
            </div>
            <div>
              <Label
                htmlFor="contactInfo.address.country"
                className="block text-sm font-medium text-gray-700"
              >
                Country
              </Label>
              <Input
                id="contactInfo.address.country"
                {...register("contactInfo.address.country")}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="showMeasurements"
              checked={showMeasurements}
              onCheckedChange={() => setShowMeasurements(!showMeasurements)}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded"
            />
            <label
              htmlFor="showMeasurements"
              className="text-sm font-medium text-gray-700"
            >
              Include measurements
            </label>
          </div>

          {showMeasurements && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Measurements</h3>
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="space-y-4 border p-4 rounded-md shadow-sm"
                >
                  <div className="flex justify-between items-center">
                    <h4 className="text-md font-semibold">
                      Measurement {index + 1}
                    </h4>
                    <Button
                      type="button"
                      onClick={() => remove(index)}
                      className="text-red-500"
                    >
                      Remove
                    </Button>
                  </div>
                  <div>
                    <Label
                      htmlFor={`measurements.${index}.title`}
                      className="block text-sm font-medium text-gray-700"
                    >
                      Title
                    </Label>
                    <Input
                      id={`measurements.${index}.title`}
                      {...register(`measurements.${index}.title`)}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    <div>
                      <Label
                        htmlFor={`measurements.${index}.data.height`}
                        className="block text-sm font-medium text-gray-700"
                      >
                        Height
                      </Label>
                      <Input
                        id={`measurements.${index}.data.height`}
                        type="number"
                        {...register(`measurements.${index}.data.height`)}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                      />
                    </div>
                    <div>
                      <Label
                        htmlFor={`measurements.${index}.data.chest`}
                        className="block text-sm font-medium text-gray-700"
                      >
                        Chest
                      </Label>
                      <Input
                        id={`measurements.${index}.data.chest`}
                        type="number"
                        {...register(`measurements.${index}.data.chest`)}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                      />
                    </div>
                    <div>
                      <Label
                        htmlFor={`measurements.${index}.data.waist`}
                        className="block text-sm font-medium text-gray-700"
                      >
                        Waist
                      </Label>
                      <Input
                        id={`measurements.${index}.data.waist`}
                        type="number"
                        {...register(`measurements.${index}.data.waist`)}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                      />
                    </div>
                    <div>
                      <Label
                        htmlFor={`measurements.${index}.data.hips`}
                        className="block text-sm font-medium text-gray-700"
                      >
                        Hips
                      </Label>
                      <Input
                        id={`measurements.${index}.data.hips`}
                        type="number"
                        {...register(`measurements.${index}.data.hips`)}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                      />
                    </div>
                    <div>
                      <Label
                        htmlFor={`measurements.${index}.data.shoulder`}
                        className="block text-sm font-medium text-gray-700"
                      >
                        Shoulder
                      </Label>
                      <Input
                        id={`measurements.${index}.data.shoulder`}
                        type="number"
                        {...register(`measurements.${index}.data.shoulder`)}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                      />
                    </div>
                    <div>
                      <Label
                        htmlFor={`measurements.${index}.data.wrist`}
                        className="block text-sm font-medium text-gray-700"
                      >
                        Wrist
                      </Label>
                      <Input
                        id={`measurements.${index}.data.wrist`}
                        type="number"
                        {...register(`measurements.${index}.data.wrist`)}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                      />
                    </div>
                    <div>
                      <Label
                        htmlFor={`measurements.${index}.data.sleeves`}
                        className="block text-sm font-medium text-gray-700"
                      >
                        Sleeves
                      </Label>
                      <Input
                        id={`measurements.${index}.data.sleeves`}
                        type="number"
                        {...register(`measurements.${index}.data.sleeves`)}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                      />
                    </div>
                    <div>
                      <Label
                        htmlFor={`measurements.${index}.data.neck`}
                        className="block text-sm font-medium text-gray-700"
                      >
                        Neck
                      </Label>
                      <Input
                        id={`measurements.${index}.data.neck`}
                        type="number"
                        {...register(`measurements.${index}.data.neck`)}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h4 className="text-md font-semibold">Lower Body</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      <div>
                        <Label
                          htmlFor={`measurements.${index}.data.lowerBody.length`}
                          className="block text-sm font-medium text-gray-700"
                        >
                          Length
                        </Label>
                        <Input
                          id={`measurements.${index}.data.lowerBody.length`}
                          type="number"
                          {...register(
                            `measurements.${index}.data.lowerBody.length`
                          )}
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                        />
                      </div>
                      <div>
                        <Label
                          htmlFor={`measurements.${index}.data.lowerBody.waist`}
                          className="block text-sm font-medium text-gray-700"
                        >
                          Waist
                        </Label>
                        <Input
                          id={`measurements.${index}.data.lowerBody.waist`}
                          type="number"
                          {...register(
                            `measurements.${index}.data.lowerBody.waist`
                          )}
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                        />
                      </div>
                      <div>
                        <Label
                          htmlFor={`measurements.${index}.data.lowerBody.inseam`}
                          className="block text-sm font-medium text-gray-700"
                        >
                          Inseam
                        </Label>
                        <Input
                          id={`measurements.${index}.data.lowerBody.inseam`}
                          type="number"
                          {...register(
                            `measurements.${index}.data.lowerBody.inseam`
                          )}
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                        />
                      </div>
                      <div>
                        <Label
                          htmlFor={`measurements.${index}.data.lowerBody.thigh`}
                          className="block text-sm font-medium text-gray-700"
                        >
                          Thigh
                        </Label>
                        <Input
                          id={`measurements.${index}.data.lowerBody.thigh`}
                          type="number"
                          {...register(
                            `measurements.${index}.data.lowerBody.thigh`
                          )}
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                        />
                      </div>
                      <div>
                        <Label
                          htmlFor={`measurements.${index}.data.lowerBody.ankle`}
                          className="block text-sm font-medium text-gray-700"
                        >
                          Ankle
                        </Label>
                        <Input
                          id={`measurements.${index}.data.lowerBody.ankle`}
                          type="number"
                          {...register(
                            `measurements.${index}.data.lowerBody.ankle`
                          )}
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <Button
                type="button"
                onClick={() => append({ title: "", data: {} })}
                className="mt-4 w-full bg-blue-500 text-white py-2 rounded-md shadow-sm"
              >
                Add Measurement
              </Button>
            </div>
          )}

          <CardFooter className="px-0">
            <Button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded-md shadow-sm"
            >
              Save Profile
            </Button>
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  );
}

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

export default function UserProfileForm() {
  const [showMeasurements, setShowMeasurements] = useState(true);
  const { getUserProfile, user, updateUserProfile } = useUser();
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

  const onSubmit = async (data) => {
    try {
      await updateUserProfile(data);
      console.log("Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>User Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input id="name" {...register("name")} />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" {...register("email")} />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>
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
              <Label htmlFor="contactInfo.phone">Phone</Label>
              <Input
                id="contactInfo.phone"
                {...register("contactInfo.phone")}
              />
            </div>
            <div>
              <Label htmlFor="contactInfo.address.line1">Address Line 1</Label>
              <Input
                id="contactInfo.address.line1"
                {...register("contactInfo.address.line1")}
              />
            </div>
            <div>
              <Label htmlFor="contactInfo.address.line2">Address Line 2</Label>
              <Input
                id="contactInfo.address.line2"
                {...register("contactInfo.address.line2")}
              />
            </div>
            <div>
              <Label htmlFor="contactInfo.address.city">City</Label>
              <Input
                id="contactInfo.address.city"
                {...register("contactInfo.address.city")}
              />
            </div>
            <div>
              <Label htmlFor="contactInfo.address.state">State</Label>
              <Input
                id="contactInfo.address.state"
                {...register("contactInfo.address.state")}
              />
            </div>
            <div>
              <Label htmlFor="contactInfo.address.postalCode">
                Postal Code
              </Label>
              <Input
                id="contactInfo.address.postalCode"
                {...register("contactInfo.address.postalCode")}
              />
            </div>
            <div>
              <Label htmlFor="contactInfo.address.country">Country</Label>
              <Input
                id="contactInfo.address.country"
                {...register("contactInfo.address.country")}
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="showMeasurements"
              checked={showMeasurements}
              onCheckedChange={() => setShowMeasurements(!showMeasurements)}
            />
            <label
              htmlFor="showMeasurements"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Include measurements
            </label>
          </div>

          {showMeasurements && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Measurements</h3>
              {fields.map((field, index) => (
                <div key={field.id} className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="text-md font-semibold">
                      Measurement {index + 1}
                    </h4>
                    <Button type="button" onClick={() => remove(index)}>
                      Remove
                    </Button>
                  </div>
                  <div>
                    <Label htmlFor={`measurements.${index}.title`}>Title</Label>
                    <Input
                      id={`measurements.${index}.title`}
                      {...register(`measurements.${index}.title`)}
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor={`measurements.${index}.data.height`}>
                        Height
                      </Label>
                      <Input
                        id={`measurements.${index}.data.height`}
                        type="number"
                        {...register(`measurements.${index}.data.height`)}
                      />
                    </div>
                    <div>
                      <Label htmlFor={`measurements.${index}.data.chest`}>
                        Chest
                      </Label>
                      <Input
                        id={`measurements.${index}.data.chest`}
                        type="number"
                        {...register(`measurements.${index}.data.chest`)}
                      />
                    </div>
                    <div>
                      <Label htmlFor={`measurements.${index}.data.waist`}>
                        Waist
                      </Label>
                      <Input
                        id={`measurements.${index}.data.waist`}
                        type="number"
                        {...register(`measurements.${index}.data.waist`)}
                      />
                    </div>
                    <div>
                      <Label htmlFor={`measurements.${index}.data.hips`}>
                        Hips
                      </Label>
                      <Input
                        id={`measurements.${index}.data.hips`}
                        type="number"
                        {...register(`measurements.${index}.data.hips`)}
                      />
                    </div>
                    <div>
                      <Label htmlFor={`measurements.${index}.data.shoulder`}>
                        Shoulder
                      </Label>
                      <Input
                        id={`measurements.${index}.data.shoulder`}
                        type="number"
                        {...register(`measurements.${index}.data.shoulder`)}
                      />
                    </div>
                    <div>
                      <Label htmlFor={`measurements.${index}.data.wrist`}>
                        Wrist
                      </Label>
                      <Input
                        id={`measurements.${index}.data.wrist`}
                        type="number"
                        {...register(`measurements.${index}.data.wrist`)}
                      />
                    </div>
                    <div>
                      <Label htmlFor={`measurements.${index}.data.sleeves`}>
                        Sleeves
                      </Label>
                      <Input
                        id={`measurements.${index}.data.sleeves`}
                        type="number"
                        {...register(`measurements.${index}.data.sleeves`)}
                      />
                    </div>
                    <div>
                      <Label htmlFor={`measurements.${index}.data.neck`}>
                        Neck
                      </Label>
                      <Input
                        id={`measurements.${index}.data.neck`}
                        type="number"
                        {...register(`measurements.${index}.data.neck`)}
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h4 className="text-md font-semibold">Lower Body</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      <div>
                        <Label
                          htmlFor={`measurements.${index}.data.lowerBody.length`}
                        >
                          Length
                        </Label>
                        <Input
                          id={`measurements.${index}.data.lowerBody.length`}
                          type="number"
                          {...register(
                            `measurements.${index}.data.lowerBody.length`
                          )}
                        />
                      </div>
                      <div>
                        <Label
                          htmlFor={`measurements.${index}.data.lowerBody.waist`}
                        >
                          Waist
                        </Label>
                        <Input
                          id={`measurements.${index}.data.lowerBody.waist`}
                          type="number"
                          {...register(
                            `measurements.${index}.data.lowerBody.waist`
                          )}
                        />
                      </div>
                      <div>
                        <Label
                          htmlFor={`measurements.${index}.data.lowerBody.inseam`}
                        >
                          Inseam
                        </Label>
                        <Input
                          id={`measurements.${index}.data.lowerBody.inseam`}
                          type="number"
                          {...register(
                            `measurements.${index}.data.lowerBody.inseam`
                          )}
                        />
                      </div>
                      <div>
                        <Label
                          htmlFor={`measurements.${index}.data.lowerBody.thigh`}
                        >
                          Thigh
                        </Label>
                        <Input
                          id={`measurements.${index}.data.lowerBody.thigh`}
                          type="number"
                          {...register(
                            `measurements.${index}.data.lowerBody.thigh`
                          )}
                        />
                      </div>
                      <div>
                        <Label
                          htmlFor={`measurements.${index}.data.lowerBody.ankle`}
                        >
                          Ankle
                        </Label>
                        <Input
                          id={`measurements.${index}.data.lowerBody.ankle`}
                          type="number"
                          {...register(
                            `measurements.${index}.data.lowerBody.ankle`
                          )}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <Button
                type="button"
                onClick={() => append({ title: "", data: {} })}
              >
                Add Measurement
              </Button>
            </div>
          )}

          <CardFooter className="px-0">
            <Button type="submit" className="w-full">
              Save Profile
            </Button>
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  );
}

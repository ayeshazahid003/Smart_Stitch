import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MeasurementsArraySchema } from "../../../validation/UserProfile";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useUser } from "../../../context/UserContext";
import { toast } from "react-toastify";
import { useState, useEffect } from "react";

export default function MeasurementForm() {
  const { user, updateUserProfile } = useUser();
  const [loading, setLoading] = useState(true);

  console.log("User in MeasurementForm:", user.measurements);

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(MeasurementsArraySchema),
    defaultValues: {
      measurements: [],
    },
  });

  useEffect(() => {
    if (user) {
      reset({
        measurements: Array.isArray(user.measurements) ? user.measurements : [],
      });
      setLoading(false);
    }
  }, [user, reset]);

  const { fields, append, remove } = useFieldArray({
    control,
    name: "measurements",
  });

  //   console.log("Measurements", user?.measurements);
  console.log("error", errors);
  const onSubmit = async (data) => {
    try {
      console.log("Submitted Data:", data);
      // send user data as well along with the measurements
      //   await updateUserProfile({ measurements: data.measurements });
      await updateUserProfile({
        ...user,
        measurements: data.measurements,
      });
      toast.success("Measurements updated successfully");
    } catch (error) {
      console.error("Error updating measurements:", error);
      toast.error("Failed to update measurements");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-md shadow-md">
      {/* <h2 className="text-lg font-semibold mb-4">Update Measurements</h2> */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
            className="w-full bg-[#111827] text-white py-2 rounded-md"
          >
            Add Measurement
          </Button>
          <Button
            type="submit"
            className="w-full bg-[#111827] text-white py-2 rounded-md"
          >
            Save
          </Button>
        </div>
      </form>
    </div>
  );
}

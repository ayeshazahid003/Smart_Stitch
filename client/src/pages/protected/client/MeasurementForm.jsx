import React, { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MeasurementsArraySchema } from "../../../validation/UserProfile";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useUser } from "../../../context/UserContext";
import { toast } from "react-toastify";

export default function MeasurementForm() {
  const { user, updateUserProfile } = useUser();
  const [loading, setLoading] = useState(true);

  const {
    control,
    register,
    handleSubmit,
    setError,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(MeasurementsArraySchema),
    defaultValues: { measurements: [] },
  });

  useEffect(() => {
    if (user) {
      reset({
        measurements: Array.isArray(user.measurements)
          ? user.measurements
          : [],
      });
      setLoading(false);
    }
  }, [user, reset]);

  const { fields, append, remove } = useFieldArray({
    control,
    name: "measurements",
  });

  const onSubmit = async (data) => {
    // 1) Negative‐value check
    let hasError = false;

    data.measurements.forEach((m, idx) => {
      // top‐level numeric fields
      Object.entries(m.data || {}).forEach(([key, raw]) => {
        const num = Number(raw);
        if (!isNaN(num) && num < 0) {
          setError(
            `measurements.${idx}.data.${key}`,
            { type: "manual", message: "Cannot be negative" },
            { shouldFocus: true }
          );
          hasError = true;
        }
      });

      // lowerBody sub‐fields
      const lb = m.data.lowerBody || {};
      Object.entries(lb).forEach(([key, raw]) => {
        const num = Number(raw);
        if (!isNaN(num) && num < 0) {
          setError(
            `measurements.${idx}.data.lowerBody.${key}`,
            { type: "manual", message: "Cannot be negative" },
            { shouldFocus: true }
          );
          hasError = true;
        }
      });
    });

    if (hasError) {
      toast.error("Please fix the negative values before saving.");
      return;
    }

    // 2) If all clear, persist
    try {
      await updateUserProfile({
        ...user,
        measurements: data.measurements,
      });
      toast.success("Measurements updated successfully");
    } catch (err) {
      console.error("Error updating measurements:", err);
      toast.error("Failed to update measurements");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-md shadow-md">
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
                {[
                  "height",
                  "chest",
                  "waist",
                  "hips",
                  "shoulder",
                  "wrist",
                  "sleeves",
                  "neck",
                ].map((part) => (
                  <div key={part}>
                    <Label
                      htmlFor={`measurements.${index}.data.${part}`}
                      className="block text-sm font-medium text-gray-700"
                    >
                      {part.charAt(0).toUpperCase() + part.slice(1)}
                    </Label>
                    <Input
                      id={`measurements.${index}.data.${part}`}
                      type="number"
                      min={0}
                      {...register(
                        `measurements.${index}.data.${part}`,
                        { valueAsNumber: true }
                      )}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                    />
                    {errors.measurements?.[index]?.data?.[part] && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.measurements[index].data[part].message}
                      </p>
                    )}
                  </div>
                ))}
              </div>
              <div className="space-y-4">
                <h4 className="text-md font-semibold">Lower Body</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {["length", "waist", "inseam", "thigh", "ankle"].map(
                    (part) => (
                      <div key={part}>
                        <Label
                          htmlFor={`measurements.${index}.data.lowerBody.${part}`}
                          className="block text-sm font-medium text-gray-700"
                        >
                          {part.charAt(0).toUpperCase() + part.slice(1)}
                        </Label>
                        <Input
                          id={`measurements.${index}.data.lowerBody.${part}`}
                          type="number"
                          min={0}
                          {...register(
                            `measurements.${index}.data.lowerBody.${part}`,
                            { valueAsNumber: true }
                          )}
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                        />
                        {errors.measurements?.[index]?.data?.lowerBody?.[
                          part
                        ] && (
                          <p className="text-red-500 text-xs mt-1">
                            {
                              errors.measurements[index].data.lowerBody[
                                part
                              ].message
                            }
                          </p>
                        )}
                      </div>
                    )
                  )}
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

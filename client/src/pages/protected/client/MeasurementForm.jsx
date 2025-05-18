import React, { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MeasurementsArraySchema } from "../../../validation/UserProfile";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useUser } from "../../../context/UserContext";
import { toast } from "react-toastify";

// Standard measurement data for different sizes
const standardSizes = {
  XS: {
    height: 160,
    chest: 84,
    waist: 68,
    hips: 90,
    shoulder: 40,
    wrist: 16,
    sleeves: 56,
    neck: 36,
    lowerBody: {
      length: 98,
      waist: 68,
      inseam: 76,
      thigh: 54,
      ankle: 36,
    },
  },
  S: {
    height: 165,
    chest: 88,
    waist: 73,
    hips: 94,
    shoulder: 42,
    wrist: 16,
    sleeves: 58,
    neck: 37,
    lowerBody: {
      length: 100,
      waist: 73,
      inseam: 78,
      thigh: 56,
      ankle: 37,
    },
  },
  M: {
    height: 170,
    chest: 96,
    waist: 80,
    hips: 100,
    shoulder: 44,
    wrist: 17,
    sleeves: 60,
    neck: 38,
    lowerBody: {
      length: 102,
      waist: 80,
      inseam: 80,
      thigh: 58,
      ankle: 38,
    },
  },
  L: {
    height: 175,
    chest: 104,
    waist: 88,
    hips: 106,
    shoulder: 46,
    wrist: 17,
    sleeves: 62,
    neck: 39,
    lowerBody: {
      length: 104,
      waist: 88,
      inseam: 82,
      thigh: 60,
      ankle: 39,
    },
  },
  XL: {
    height: 180,
    chest: 112,
    waist: 96,
    hips: 112,
    shoulder: 48,
    wrist: 18,
    sleeves: 64,
    neck: 40,
    lowerBody: {
      length: 106,
      waist: 96,
      inseam: 84,
      thigh: 62,
      ankle: 40,
    },
  },
  XXL: {
    height: 185,
    chest: 120,
    waist: 104,
    hips: 118,
    shoulder: 50,
    wrist: 18,
    sleeves: 66,
    neck: 41,
    lowerBody: {
      length: 108,
      waist: 104,
      inseam: 86,
      thigh: 64,
      ankle: 41,
    },
  },
};

export default function MeasurementForm() {
  const { user, updateUserProfile } = useUser();
  const [loading, setLoading] = useState(true);
  const [showStandardSizes, setShowStandardSizes] = useState(false);
  const [activeMeasurementIndex, setActiveMeasurementIndex] = useState(null);

  const {
    control,
    register,
    handleSubmit,
    setError,
    formState: { errors },
    reset,
    setValue,
    getValues,
  } = useForm({
    resolver: zodResolver(MeasurementsArraySchema),
    defaultValues: { measurements: [{ title: "", data: {} }] }, // Start with one empty measurement
  });

  useEffect(() => {
    if (user) {
      // Check if user has measurements and use them to populate form
      if (Array.isArray(user.measurements) && user.measurements.length > 0) {
        // Convert any undefined data fields to empty objects to prevent errors
        const cleanedMeasurements = user.measurements.map((m) => ({
          ...m,
          data: m.data || {},
          lowerBody: m.lowerBody || {},
        }));
        reset({ measurements: cleanedMeasurements });
      }
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

  // Function to apply a standard size to a measurement
  const applyStandardSize = (size, index) => {
    const sizeData = standardSizes[size];
    console.log(
      "Applying standard size:",
      size,
      "to measurement index:",
      index
    );

    // Set each measurement field
    Object.entries(sizeData).forEach(([key, value]) => {
      if (key !== "lowerBody") {
        setValue(`measurements.${index}.data.${key}`, value);
      }
    });

    // Set lower body measurements
    Object.entries(sizeData.lowerBody).forEach(([key, value]) => {
      setValue(`measurements.${index}.data.lowerBody.${key}`, value);
    });

    // If the title is empty, suggest a standard size name
    const currentTitle = getValues(`measurements.${index}.title`);
    console.log("current title:", currentTitle);

    setValue(`measurements.${index}.title`, `Standard ${size}`);

    // Hide the standard sizes panel
    setShowStandardSizes(false);

    toast.success(`Applied ${size} standard size`);
  };

  // Function to toggle standard sizes panel
  const toggleStandardSizesPanel = (index) => {
    if (activeMeasurementIndex === index && showStandardSizes) {
      setShowStandardSizes(false);
      setActiveMeasurementIndex(null);
    } else {
      setShowStandardSizes(true);
      setActiveMeasurementIndex(index);
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
                <div className="flex space-x-2">
                  <Button
                    type="button"
                    onClick={() => toggleStandardSizesPanel(index)}
                    className="bg-gray-100 text-gray-700 hover:bg-gray-200 transition text-sm"
                  >
                    Use Standard Size
                  </Button>
                  <Button
                    type="button"
                    onClick={() => remove(index)}
                    className="text-red-500"
                  >
                    Remove
                  </Button>
                </div>
              </div>

              {/* Standard Sizes Panel */}
              {showStandardSizes && activeMeasurementIndex === index && (
                <div className="mb-4 p-3 border rounded-md bg-gray-50">
                  <h5 className="font-semibold mb-2">Select a Standard Size</h5>
                  <p className="text-xs text-gray-600 mb-3">
                    Select a standard size to automatically fill measurement
                    fields. You can adjust values afterward.
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
                    {Object.keys(standardSizes).map((size) => (
                      <Button
                        key={size}
                        type="button"
                        onClick={() => applyStandardSize(size, index)}
                        className="bg-white border border-gray-300 text-gray-800 hover:bg-gray-100"
                      >
                        {size}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <Label
                  htmlFor={`measurements.${index}.title`}
                  className="block text-sm font-medium text-gray-700"
                >
                  Title <span className="text-red-500">*</span>
                </Label>
                <Input
                  id={`measurements.${index}.title`}
                  {...register(`measurements.${index}.title`)}
                  className={`mt-1 block w-full border-gray-300 rounded-md shadow-sm ${
                    errors.measurements?.[index]?.title ? "border-red-500" : ""
                  }`}
                />
                {errors.measurements?.[index]?.title && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.measurements[index].title.message}
                  </p>
                )}
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
                      {part.charAt(0).toUpperCase() + part.slice(1)}{" "}
                      <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id={`measurements.${index}.data.${part}`}
                      type="number"
                      min={0}
                      {...register(`measurements.${index}.data.${part}`, {
                        valueAsNumber: true,
                      })}
                      className={`mt-1 block w-full border-gray-300 rounded-md shadow-sm ${
                        errors.measurements?.[index]?.data?.[part]
                          ? "border-red-500"
                          : ""
                      }`}
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
                          {part.charAt(0).toUpperCase() + part.slice(1)}{" "}
                          <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id={`measurements.${index}.data.lowerBody.${part}`}
                          type="number"
                          min={0}
                          {...register(
                            `measurements.${index}.data.lowerBody.${part}`,
                            { valueAsNumber: true }
                          )}
                          className={`mt-1 block w-full border-gray-300 rounded-md shadow-sm ${
                            errors.measurements?.[index]?.data?.lowerBody?.[
                              part
                            ]
                              ? "border-red-500"
                              : ""
                          }`}
                        />
                        {errors.measurements?.[index]?.data?.lowerBody?.[
                          part
                        ] && (
                          <p className="text-red-500 text-xs mt-1">
                            {
                              errors.measurements[index].data.lowerBody[part]
                                .message
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

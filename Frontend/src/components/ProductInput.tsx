"use client";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  useForm,
  SubmitHandler,
  FieldError,
  UseFormRegisterReturn,
} from "react-hook-form";
import { OctagonAlert, PackageOpen } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Textarea } from "./ui/textarea";
import { useState } from "react";
import { useQRDataStore } from "@/store/qrData";

type FormValues = {
  manufacturerName: string;
  source: string;
  time: string;
  date: Date;
  destination: string;
  batchNumber: number;
  batchInfo: string;
};

type InputBoxData = {
  label: string;
  id: string;
  type?: "text" | "date";
  placeholder?: string;
  error?: FieldError;
  register: UseFormRegisterReturn;
};

type Props = {};

function ProductInput({}: Props) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormValues>();

  const setQRData = useQRDataStore((state) => state.setQRData);

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setQRData(data);
  };

  return (
    <AnimatePresence>
      <div className="w-full h-full font-poppins relative">
        <motion.div
          initial={{
            opacity: 0,
            scale: 1.5,
          }}
          whileInView={{
            opacity: 1,
            scale: 1,
          }}
          exit={{
            opacity: 0,
            scale: 1.5,
          }}
          viewport={{
            once: true,
          }}
          transition={{
            type: "fade",
          }}
          className="w-full h-full flex justify-center items-center"
        >
          <Card className="w-full h-full rounded-none flex flex-col z-10">
            <CardHeader className="bg-indigo-500 text-white">
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                Product details
                <PackageOpen />
              </CardTitle>
              <CardDescription className="text-white">
                Fill all the fields with the corresponding details
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-4 flex-grow overflow-auto">
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="relative w-full flex flex-col items-center justify-center gap-4"
              >
                <InputBlock
                  label="Manufacturer name"
                  id="manufacturerName"
                  placeholder="Enter the manufacturer name"
                  error={errors.manufacturerName}
                  register={register("manufacturerName", {
                    required: "manufacturer name is required",
                  })}
                />

                <InputBlock
                  label="Source"
                  id="source"
                  placeholder="e.g. dehradun"
                  error={errors.source}
                  register={register("source", {
                    required: "Source is required",
                  })}
                />

                <InputBlock
                  label="Destination"
                  id="destination"
                  placeholder="e.g. delhi"
                  error={errors.destination}
                  register={register("destination", {
                    required: "Destination is required",
                  })}
                />

                <div className="w-full flex items-center gap-3">
                  <div className="w-full flex flex-col gap-2">
                    <InputBlock
                      label="Time"
                      id="time"
                      placeholder="e.g. 9:15"
                      error={errors.time}
                      register={register("time", {
                        required: "Time is required",
                      })}
                    />
                  </div>

                  <div className="w-full flex flex-col gap-2">
                    <InputBlock
                      label="Date"
                      id="date"
                      type="date"
                      placeholder="e.g. 1/2/2024"
                      error={errors.date}
                      register={register("date", {
                        required: "Date is required",
                      })}
                    />
                  </div>
                </div>

                <InputBlock
                  label="BatchNumber"
                  id="batchNumber"
                  placeholder="Enter the batch no."
                  error={errors.batchNumber}
                  register={register("batchNumber", {
                    required: "Batch number is required",
                  })}
                />

                <div className="w-full flex flex-col gap-2">
                  <Label
                    htmlFor="description"
                    className="font-semibold text-base pl-[2px]"
                  >
                    Description
                  </Label>
                  <Textarea
                    rows={4}
                    className="rounded-lg  px-3 py-4 border-4 border-gray-300 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-indigo-500"
                    id="batchInfo"
                    placeholder="Describe about the product"
                    {...register("batchInfo", {
                      required: {
                        value: true,
                        message: "Enter the batchInfo",
                      },
                    })}
                  />
                  {errors.batchInfo && (
                    <span className="mt-1 ml-1 text-sm text-red-500 flex items-center gap-1">
                      <OctagonAlert className="w-5 h-5" />
                      {errors.batchInfo.message}
                    </span>
                  )}
                </div>

                <div className="w-full flex justify-between items-center gap-4">
                  <Button
                    type="submit"
                    className="bg-indigo-500 w-full hover:bg-orange-600"
                  >
                    Submit
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

function InputBlock({
  label,
  id,
  type = "text",
  placeholder,
  error,
  register,
}: InputBoxData) {
  return (
    <div className="w-full flex flex-col gap-2">
      <Label htmlFor={id} className="font-semibold text-base pl-[2px]">
        {label}
      </Label>
      <Input
        type={type}
        id={id}
        placeholder={placeholder}
        className="h-11 rounded-lg px-3 py-4 border-4 border-gray-300 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-indigo-500"
        {...register}
      />
      {error && (
        <span className="mt-1 ml-1 text-sm text-red-500 flex items-center gap-1">
          <OctagonAlert className="w-5 h-5" />
          {error.message}
        </span>
      )}
    </div>
  );
}

export default ProductInput;

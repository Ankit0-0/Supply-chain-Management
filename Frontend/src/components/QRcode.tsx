"use client";
import React, { ReactNode, useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import { useQRDataStore } from "@/store/qrData";
import { motion } from "framer-motion";

type qrData = {
  manufacturerName: string;
  source: string;
  time: string;
  date: Date;
  destination: string;
  batchNumber: number;
  batchInfo: string;
};

type Props = {};

function QRcode({}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const qrData = useQRDataStore((state) => state.qrData);
  const isGenerated = useQRDataStore((state) => state.generated);

  useEffect(() => {
    const generateQr = async (data: qrData) => {
      try {
        const qrData = JSON.stringify(data); // Convert form data to JSON
        await QRCode.toCanvas(canvasRef.current, qrData);
      } catch (error) {
        console.error("Error generating QR code:", error);
      }
    };
    generateQr(qrData);
  }, [qrData]);

  return (
    <div className="w-full h-full font-poppins flex justify-center items-center">
      {isGenerated && (
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
          className="flex flex-col items-center gap-4"
        >
          <div className="p-2 border-4 w-fit border-dashed border-indigo-400">
            <canvas ref={canvasRef} />
          </div>
          <p className="font-semibold text-white text-center">Scan this QR to get the product details</p>
        </motion.div>
      )}
    </div>
  );
}

export default QRcode;

"use client";
import { create } from "zustand";
import { produce } from "immer";

type qrData = {
  manufacturerName: string;
  source: string;
  time: string;
  date: Date;
  destination: string;
  batchNumber: number;
  batchInfo: string;
};

type QRDataStore = {
  qrData: qrData;
  setQRData: (data: qrData) => void;
  generated: boolean;
};

const initialState = {
  qrData: {
    manufacturerName: "ankit",
    source: "delhi",
    time: "9:15",
    date: new Date(),
    destination: "dehradun",
    batchNumber: 45,
    batchInfo: "hello world",
  },
  generated: true
};

export const useQRDataStore = create<QRDataStore>((set) => ({
  ...initialState,
  setQRData: (data: qrData) => {
    set((state) => ({
      qrData: data,
      generated: true
    }));
  },
}));

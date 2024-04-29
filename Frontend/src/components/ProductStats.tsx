"use client";
import React, { useEffect, useState } from "react";
import { AreaChart } from "@tremor/react";
import { useQRDataStore } from "@/store/qrData";

type Props = {};

function ProductStats({}: Props) {
  const [chartData, setChartData] = useState<any>([]);
  const [fetchCount, setFetchCount] = useState(0);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASEURL}/get-log-detail`,
          {
            method: "POST",
            headers: {
              "content-type": "application/json",
            },
            body: JSON.stringify({
              batchId: 263967062395604,
            }),
          }
        );

        const result = await response.json();

        if (result.success) {
          setChartData(result.Data);
        } else {
          console.error(result.message);
        }

        console.log("result: ", result);
        setFetchCount(prevCount => prevCount + 1);
      } catch (error: any) {
        console.error(error.message);
      }
    };

    if (fetchCount < 4) {
      const intervalId = setInterval(fetchUserDetails, 10000); // Call fetchUserDetails every 10 seconds

      return () => {
        clearInterval(intervalId);
      };
    }
  }, []);
  return (
    <div className="min-h-screen flex justify-center text-white max-w-7xl mx-auto font-poppins">
      <div className="w-full flex flex-col gap-4 p-7">
        <h1 className="text-2xl font-bold">Log Details</h1>
        <p className="">Temperature Humidity & Shock</p>
        <AreaChart
          showAnimation={true}
          className="h-80"
          data={chartData}
          index="time"
          categories={["temperature", "humidity", "shock"]}
          colors={["indigo", "rose", "green"]}
          yAxisWidth={20}
          showGridLines={true}
          onValueChange={(v) => console.log(v)}
        />
      </div>
    </div>
  );
}

export default ProductStats;

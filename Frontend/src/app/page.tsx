import ProductInput from "@/components/ProductInput";
import QRcode from "@/components/QRcode";

export default function Home() {
  return (
    <main className="flex gap-7 min-h-screen mx-auto">
      <div className="w-[40%] h-screen">
        <ProductInput />
      </div>
      <div className="w-[60%] h-screen">
        <QRcode />
      </div>
    </main>
  );
}

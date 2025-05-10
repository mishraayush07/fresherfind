import LocationHeader from "@/components/LocationHeader";
import ServicesGrid from "@/components/ServicesGrid";
import HandpickedHostels from "@/components/HandpickedHostels";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <LocationHeader />
      <ServicesGrid />
      <HandpickedHostels />
    </main>
  );
} 

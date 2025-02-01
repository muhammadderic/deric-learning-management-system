import Header from "../Header";
import Footer from "../Footer";
import { Outlet } from "react-router-dom";

export default function MainLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-[#F3F4F6] text-[#111827]">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}

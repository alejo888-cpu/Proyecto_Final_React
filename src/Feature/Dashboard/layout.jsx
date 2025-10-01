import { Outlet } from "react-router-dom";
import Sidebar from "./Components/Sidebar";
import Header from "./Components/Header";

export const Dashboard = () => {
  return (
    <div className="flex h-screen bg-gray-50 w-screen overflow-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <main className="flex-1 bg-gray-100 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
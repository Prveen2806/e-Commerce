import { Outlet } from "react-router-dom";

const AppLayout = () => {
  return (
    <div>
      {/* Header / Navbar / Sidebar */}
      <Outlet /> {/* 👈 Where child routes render */}
    </div>
  );
};

export default AppLayout;

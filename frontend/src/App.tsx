import type { ReactElement } from "react";
import { Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import { useUser } from "@clerk/clerk-react";
import Layout from "./pages/Layout";

export default function App(): ReactElement {
  const { user } = useUser();

  return (
    <div>
      <Routes>
        <Route path="/" element={!user ? <Login /> : <Layout />} />
      </Routes>
    </div>
  );
}

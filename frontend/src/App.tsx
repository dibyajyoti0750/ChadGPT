import type { ReactElement } from "react";
import { Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Chat from "./pages/Chat";

export default function App(): ReactElement {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Login />}>
          <Route index element={<Chat />} />
        </Route>
      </Routes>
    </div>
  );
}

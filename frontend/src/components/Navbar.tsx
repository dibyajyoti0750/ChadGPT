import { Popover } from "@mui/material";
import { Atom, Check, ChevronDown } from "lucide-react";
import { useState, type MouseEvent, type ReactElement } from "react";

export default function Navbar(): ReactElement {
  const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null);

  const handleClick = (event: MouseEvent<HTMLDivElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  return (
    <div className="w-full border-b border-neutral-700/50 p-2">
      <div
        onClick={handleClick}
        className="flex items-center gap-2 w-fit p-3 rounded-lg hover:bg-neutral-700/90 cursor-pointer"
      >
        <h1 className="text-xl">ChadGPT</h1>
        <ChevronDown size={18} />
      </div>

      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <div className="p-1.5">
          <div className="flex items-center gap-1.5 cursor-pointer p-2 rounded hover:bg-indigo-200">
            <Atom size={22} />
            <div className="flex flex-col">
              <span className="font-medium text-sm">ChadGPT</span>
              <span className="flex items-center gap-1 text-xs">
                Great for everyday tasks <Check size={12} />
              </span>
            </div>
          </div>
        </div>
      </Popover>
    </div>
  );
}

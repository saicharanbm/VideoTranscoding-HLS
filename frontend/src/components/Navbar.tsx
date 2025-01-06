import { NavLink } from "react-router-dom";
function Navbar() {
  return (
    <nav className=" flex justify-center p-4 bg-gray-300">
      <ul className="flex gap-4">
        <li>
          <NavLink
            to={"/"}
            className={({ isActive }) =>
              `text-lg py-1 px-2 rounded cursor-pointer text-center md:font-medium hover:bg-[#245e5a]   hover:text-[#EEEFF1] ${
                isActive && "bg-[#245e5a] text-[#EEEFF1] "
              }`
            }
          >
            Home
          </NavLink>
        </li>
        <li>
          {" "}
          <NavLink
            to={"/upload"}
            className={({ isActive }) =>
              `text-lg py-1 px-2 rounded cursor-pointer text-center md:font-medium hover:bg-[#245e5a]   hover:text-[#EEEFF1] ${
                isActive && "bg-[#245e5a] text-[#EEEFF1] "
              }`
            }
          >
            Upload
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;

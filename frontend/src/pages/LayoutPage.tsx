import { Button } from "@/components/ui/button";
import { useUser } from "@/hooks/use-user";
import { Outlet, NavLink } from "react-router-dom";

const LayoutPage = () => {
  const { is_logged_in } = useUser();
  console.log(is_logged_in)
  return (
    <>
      <header
        className="bg-gradient-to-r
                 from-blue-500 to-blue-700 text-white 
                 flex items-center justify-between px-4 py-6"
      >
        <div className="flex justify-between w-full items-center">
          <h1>FindIt</h1>
          <nav>
            <ul className="flex gap-4">
              <li className="flex justify-end">
                <NavLink
                  to="/"
                  className={({ isActive }) => (isActive ? "underline" : "")}
                >
                  <Button variant={"link"} className="text-white">
                    Accueil
                  </Button>
                </NavLink>
              </li>
              {!is_logged_in && (
                <li>
                  <NavLink
                    to="/login"
                    className={({ isActive }) => (isActive ? "underline" : "")}
                  >
                    <Button
                      variant={"outline"}
                      className="bg-transparent hover:bg-transparent"
                    >
                      Se connecter
                    </Button>
                  </NavLink>
                </li>
              )}

              <li>
                <Button className="bg-green-800 hover:bg-green-700">
                  Poster un objet
                </Button>
              </li>
            </ul>
          </nav>
        </div>
      </header>
      <Outlet />
    </>
  );
};

export default LayoutPage;

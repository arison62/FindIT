import { Button } from "@/components/ui/button";
import { NavLink, Outlet } from "react-router-dom";

const HomePage = () => {
  return (
    <div
      className="flex flex-row h-[calc(100vh-90px)] 
            w-screen max-w-7xl
             m-auto shadow-lg border"
    >
      <div className="flex flex-col w-fit px-2 bg-gray-50 py-8">
        <ul className="*:w-full space-y-6">
          <li>
            <NavLink
              to="/"
              className={({ isActive }) => (isActive ? "group isActive" : "")}
            >
              <Button
                variant={"secondary"}
                className="group-[.isActive]:bg-blue-300 group-[isActive]:text-white w-full"
              >
                <svg
                  className="w-6 h-6 text-gray-800 dark:text-white"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill-rule="evenodd"
                    d="M11.293 3.293a1 1 0 0 1 1.414 0l6 6 2 2a1 1 0 0 1-1.414 1.414L19 12.414V19a2 2 0 0 1-2 2h-3a1 1 0 0 1-1-1v-3h-2v3a1 1 0 0 1-1 1H7a2 2 0 0 1-2-2v-6.586l-.293.293a1 1 0 0 1-1.414-1.414l2-2 6-6Z"
                    clip-rule="evenodd"
                  />
                </svg>
                Accueil
              </Button>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="post"
              className={({ isActive }) => (isActive ? "group isActive" : "")}
            >
              <Button
               variant={"secondary"}
                className="group-[.isActive]:bg-blue-200 group-[isActive]:text-white w-full"
              >
                <svg
                  className="w-6 h-6 text-gray-800 dark:text-white"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill-rule="evenodd"
                    d="M11.32 6.176H5c-1.105 0-2 .949-2 2.118v10.588C3 20.052 3.895 21 5 21h11c1.105 0 2-.948 2-2.118v-7.75l-3.914 4.144A2.46 2.46 0 0 1 12.81 16l-2.681.568c-1.75.37-3.292-1.263-2.942-3.115l.536-2.839c.097-.512.335-.983.684-1.352l2.914-3.086Z"
                    clip-rule="evenodd"
                  />
                  <path
                    fill-rule="evenodd"
                    d="M19.846 4.318a2.148 2.148 0 0 0-.437-.692 2.014 2.014 0 0 0-.654-.463 1.92 1.92 0 0 0-1.544 0 2.014 2.014 0 0 0-.654.463l-.546.578 2.852 3.02.546-.579a2.14 2.14 0 0 0 .437-.692 2.244 2.244 0 0 0 0-1.635ZM17.45 8.721 14.597 5.7 9.82 10.76a.54.54 0 0 0-.137.27l-.536 2.84c-.07.37.239.696.588.622l2.682-.567a.492.492 0 0 0 .255-.145l4.778-5.06Z"
                    clip-rule="evenodd"
                  />
                </svg>
                Post un objet
              </Button>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="chat"
              className={({ isActive }) => (isActive ? "group isActive" : "")}
            >
              <Button
                variant={"secondary"}
                className="group-[.isActive]:bg-blue-200 group-[isActive]:text-white w-full"
              >
                <svg
                  className="w-6 h-6 text-gray-800 dark:text-white"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill-rule="evenodd"
                    d="M4 3a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h1v2a1 1 0 0 0 1.707.707L9.414 13H15a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1H4Z"
                    clip-rule="evenodd"
                  />
                  <path
                    fill-rule="evenodd"
                    d="M8.023 17.215c.033-.03.066-.062.098-.094L10.243 15H15a3 3 0 0 0 3-3V8h2a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1h-1v2a1 1 0 0 1-1.707.707L14.586 18H9a1 1 0 0 1-.977-.785Z"
                    clip-rule="evenodd"
                  />
                </svg>
                Messages
              </Button>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="profile"
              className={({ isActive }) => (isActive ? "group isActive" : "")}
            >
              <Button
                variant={"secondary"}
                className="group-[.isActive]:bg-blue-200 group-[isActive]:text-white w-full"
              >
                <svg
                  className="w-6 h-6 text-gray-800 dark:text-white"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill-rule="evenodd"
                    d="M12 4a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm-2 9a4 4 0 0 0-4 4v1a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-1a4 4 0 0 0-4-4h-4Z"
                    clip-rule="evenodd"
                  />
                </svg>
                Mon compte
              </Button>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="notifications"
              className={({ isActive }) => (isActive ? "group isActive" : "")}
            >
              <Button
                variant={"secondary"}
                className="group-[.isActive]:bg-blue-200 group-[isActive]:text-white w-full"
              >
                <svg
                  className="w-6 h-6 text-gray-800 dark:text-white"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M17.133 12.632v-1.8a5.406 5.406 0 0 0-4.154-5.262.955.955 0 0 0 .021-.106V3.1a1 1 0 0 0-2 0v2.364a.955.955 0 0 0 .021.106 5.406 5.406 0 0 0-4.154 5.262v1.8C6.867 15.018 5 15.614 5 16.807 5 17.4 5 18 5.538 18h12.924C19 18 19 17.4 19 16.807c0-1.193-1.867-1.789-1.867-4.175ZM8.823 19a3.453 3.453 0 0 0 6.354 0H8.823Z" />
                </svg>
                Notifications
              </Button>
            </NavLink>
          </li>
        </ul>
      </div>
      <div className="flex flex-col w-full bg-white overflow-scroll">
        <Outlet />
      </div>
    </div>
  );
};

export default HomePage;

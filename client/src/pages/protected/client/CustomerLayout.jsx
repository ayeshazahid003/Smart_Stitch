import { useEffect, useState } from "react";
import { Link, Outlet, useLocation } from "react-router";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  TransitionChild,
} from "@headlessui/react";
import {
  Bars3Icon,
  XMarkIcon,
  HomeIcon,
  UserIcon,
  CalendarIcon,
  BriefcaseIcon,
  SparklesIcon,
  PhotoIcon,
  ChatBubbleLeftRightIcon,
  ClipboardDocumentListIcon,
  GiftIcon,
  TagIcon,
} from "@heroicons/react/24/outline";
import { useUser } from "../../../context/UserContext";
import { useNavigate } from "react-router";

const getNavigation = (role) => {
  const customerNav = [
    { name: "Home", href: "/", icon: HomeIcon },
    { name: "Profile", href: "/user-profile", icon: UserIcon },
    { name: "Measurements", href: "/measurements", icon: CalendarIcon },
    { name: "Requests", href: "/offers", icon: GiftIcon },
    { name: "Chats", href: "/chats", icon: ChatBubbleLeftRightIcon },
    { name: "Orders", href: "/orders", icon: ClipboardDocumentListIcon },
  ];

  const tailorNav = [
    { name: "Home", href: "/", icon: HomeIcon },
    { name: "Dashboard", href: "/tailor", icon: HomeIcon },
    { name: "Profile", href: "/user-profile", icon: UserIcon },
    { name: "Shop Details", href: "/add-shop-details", icon: BriefcaseIcon },
    { name: "Measurements", href: "/measurements", icon: CalendarIcon },
    { name: "Services", href: "/all-services", icon: BriefcaseIcon },
    { name: "Extra Services", href: "/all-extra-services", icon: SparklesIcon },
    { name: "Portfolio", href: "/all-portfolio", icon: PhotoIcon },
    { name: "Orders", href: "/tailor/orders", icon: ClipboardDocumentListIcon },
    { name: "Offers", href: "/offers", icon: GiftIcon },
    { name: "Chats", href: "/chats", icon: ChatBubbleLeftRightIcon },
    { name: "Campaigns", href: "/campaigns", icon: TagIcon },
    { name: "Vouchers", href: "/vouchers", icon: GiftIcon },
  ];

  const platformAdminNav = [
    { name: "Blogs", href: "/platform-admin/blogs", icon: SparklesIcon },
    { name: "Trending Designs", href: "/trending-designs", icon: SparklesIcon },
    // { name: "Dashboard", href: "/admin", icon: HomeIcon },
    // { name: "Users", href: "/users", icon: UserIcon },
    // { name: "Tailors", href: "/tailors", icon: BriefcaseIcon },
    // { name: "Services", href: "/services", icon: CalendarIcon },
    // { name: "Orders", href: "/orders", icon: ClipboardDocumentListIcon },
    // { name: "Campaigns", href: "/campaigns", icon: TagIcon },
  ];

  return role === "tailor"
    ? tailorNav
    : role === "platformAdmin"
    ? platformAdminNav
    : customerNav;
};

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function CustomerLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useUser();
  const location = useLocation(); // Get the current location
  const navigate = useNavigate(); // Hook to navigate programmatically

  return (
    <>
      <div>
        <Dialog
          open={sidebarOpen}
          onClose={setSidebarOpen}
          className="relative z-50 lg:hidden"
        >
          <DialogBackdrop
            transition
            className="fixed inset-0 bg-gray-900/80 transition-opacity duration-300 ease-linear data-[closed]:opacity-0"
          />

          <div className="fixed inset-0 flex">
            <DialogPanel
              transition
              className="relative mr-16 flex w-full max-w-xs flex-1 transform transition duration-300 ease-in-out data-[closed]:-translate-x-full"
            >
              <TransitionChild>
                <div className="absolute left-full top-0 flex w-16 justify-center pt-5 duration-300 ease-in-out data-[closed]:opacity-0">
                  <button
                    type="button"
                    onClick={() => setSidebarOpen(false)}
                    className="-m-2.5 p-2.5"
                  >
                    <span className="sr-only">Close sidebar</span>
                    <XMarkIcon
                      aria-hidden="true"
                      className="size-6 text-white"
                    />
                  </button>
                </div>
              </TransitionChild>
              {/* Sidebar component, swap this element with another sidebar if you like */}
              <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-gray-900 px-6 pb-2 ring-1 ring-white/10">
                <div className="flex h-16 shrink-0 items-center">
                  <h1 className="text-2xl font-ibarra font-bold italic text-white">
                    Smart Stitch
                  </h1>
                </div>
                <nav className="flex flex-1 flex-col">
                  <ul role="list" className="flex flex-1 flex-col gap-y-7">
                    <li>
                      <ul role="list" className="-mx-2 space-y-1">
                        {getNavigation(user?.role).map((item) => (
                          <li key={item.name}>
                            <Link
                              to={item.href}
                              className={classNames(
                                location.pathname === item.href
                                  ? "bg-gray-800 text-white"
                                  : "text-gray-400 hover:bg-gray-800 hover:text-white",
                                "group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold"
                              )}
                            >
                              <item.icon
                                aria-hidden="true"
                                className="size-6 shrink-0"
                              />
                              {item.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </li>
                    <li className="mt-auto">
                      <div className="border-t border-white/25 pt-6">
                        {user && (
                          <button
                            onClick={() => {
                              logout();
                              navigate("/"); // Redirect to login page after logout
                            }}
                            className="block w-full rounded-md px-3 py-2 text-base font-semibold text-white hover:underline"
                          >
                            Log out
                          </button>
                        )}
                      </div>
                    </li>
                  </ul>
                </nav>
              </div>
            </DialogPanel>
          </div>
        </Dialog>

        {/* Static sidebar for desktop */}
        <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
          {/* Sidebar component, swap this element with another sidebar if you like */}
          <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-gray-900 px-6">
            <div className="flex h-16 shrink-0 items-center">
              <h1 className="text-2xl font-ibarra font-bold italic text-white">
                Smart Stitch
              </h1>
            </div>
            <nav className="flex flex-1 flex-col">
              <ul role="list" className="flex flex-1 flex-col gap-y-7">
                <li>
                  <ul role="list" className="-mx-2 space-y-1">
                    {getNavigation(user?.role).map((item) => (
                      <li key={item.name}>
                        <Link
                          to={item.href}
                          className={classNames(
                            location.pathname === item.href
                              ? "bg-gray-800 text-white"
                              : "text-gray-400 hover:bg-gray-800 hover:text-white",
                            "group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold"
                          )}
                        >
                          <item.icon
                            aria-hidden="true"
                            className="size-6 shrink-0"
                          />
                          {item.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </li>

                <li className="-mx-6 mt-auto">
                  <Link
                    to="/user-profile"
                    className="flex items-center gap-x-4 px-6 py-3 text-sm/6 font-semibold text-white hover:bg-gray-800"
                  >
                    <img
                      alt=""
                      src={
                        user?.profilePicture ||
                        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                      }
                      className="size-8 rounded-full bg-gray-800"
                    />
                    <span className="sr-only">Your profile</span>
                    <span aria-hidden="true">{user?.name || "Najam"}</span>
                  </Link>
                  <div className="mt-6 border-t border-white/25 pt-6">
                    {user && (
                      <button
                        onClick={() => {
                          logout();
                          navigate("/"); // Redirect to login page after logout
                        }}
                        className="block w-full rounded-md px-3 py-2 text-base font-semibold text-white hover:underline"
                      >
                        Log out
                      </button>
                    )}
                  </div>
                </li>
              </ul>
            </nav>
          </div>
        </div>

        <div className="sticky top-0 z-40 flex items-center gap-x-6 bg-gray-900 px-4 py-4 shadow-sm sm:px-6 lg:hidden">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="-m-2.5 p-2.5 text-gray-400 lg:hidden"
          >
            <span className="sr-only">Open sidebar</span>
            <Bars3Icon aria-hidden="true" className="size-6" />
          </button>
          <div className="flex-1 text-sm/6 font-semibold text-white">
            Dashboard
          </div>
          <Link to="/user-profile">
            <span className="sr-only">Your profile</span>
            <img
              alt=""
              src={
                user?.profilePicture ||
                "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
              }
              className="size-8 rounded-full bg-gray-800"
            />
          </Link>
        </div>

        <main className="py-10 lg:pl-72">
          <div className="px-4 sm:px-6 lg:px-8">
            <Outlet />
          </div>
        </main>
      </div>
    </>
  );
}

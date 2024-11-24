import { Bell, LogOut } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router";

export function Header() {
  const navigate = useNavigate();
  return (
    <header className="bg-primary text-primary-foreground py-4">
      <div className="container mx-auto flex items-center justify-between">
        <h1 className="text-xl font-bold">Dashboard</h1>
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="sr-only">Notifications</span>
            <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src="data:image/jpeg;base64,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"
                    alt="User's profile picture"
                  />
                  <AvatarFallback>Zain</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">John Doe</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    john.doe@example.com
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Button
                  variant="ghost"
                  className="text-left w-full"
                  onClick={() => navigate("/profile")}
                >
                  Profile
                </Button>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}

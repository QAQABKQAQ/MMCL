import { Sidebar } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Menu, PlusCircle, Download, Home } from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
export function AppSidebar() {
   const location = useLocation();
   const SidebarContent = [
      {
         id: 0,
         name: "下载版本",
         size: "default" as const,
         icon: <Download />,
         route: "/versions",
      },
      {
         id: 1,
         size: "icon" as const,
         icon: <Home />,
         route: "/",
      },
   ];

   return (
      <div
         data-slot="sidebar"
         className="h-[60px] hidden w-full border-border border-t flex items-center justify-end px-3 gap-3"
      >
         <Button variant={"ghost"} className="mr-auto">
            <img src="/steve.png" alt="" className="h-6 w-6" />
            <p className="font-bold text-md">Creteper</p>
         </Button>
         {SidebarContent.map((item) => (
            <Link to={item.route} key={item.id}>
               <Button
                  key={item.id}
                  variant="ghost"
                  size={item.size}
                  className={cn(
                     "hover:bg-primary! transition-colors hover:text-primary-foreground",
                     location.pathname === item.route
                        ? "bg-primary text-primary-foreground hover:bg-primary! hover:text-primary-foreground!"
                        : "",
                  )}
               >
                  <div>{item.icon}</div>
                  {item.name && <p className="text-sm">{item.name}</p>}
               </Button>
            </Link>
         ))}
      </div>
   );
}

export function SidebarProvider({
   children,
   ...props
}: { children: React.ReactNode } & React.ComponentProps<"div">) {
   return (
      <div
         data-slot="sidebarProvider"
         className={cn("h-[calc(100vh)] w-full", props.className)}
         {...props}
      >
         <div className="pt-16 h-full w-full">{children}</div>
      </div>
   );
}

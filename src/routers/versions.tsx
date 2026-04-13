import PageLayOut, { AnimateLayOut } from "@/components/layout/page-layout";
import VersionsSidebar from "@/components/layout/versions-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export default function VersionLayOut() {
  return (
    <PageLayOut>
      <AnimateLayOut>
        <div
        className="w-full h-full"
        >
          <VersionsSidebar />
        </div>
      </AnimateLayOut>
    </PageLayOut>
  )
}
import "@/App.css";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ThemeProvider } from "@/components/theme/theme-prov";
import Titlebar from "@/components/title-bar";
function RootLayOut() {
  return (
    <ThemeProvider defaultTheme="light">
      <Titlebar isTrashed={true} title="MMCL" isMaximized={false} />
      <main className="mt-10">
        <h1>Hello World</h1>
        <Button onClick={() => toast.success("test")}>123</Button>
      </main>
    </ThemeProvider>
  );
}

export default RootLayOut;

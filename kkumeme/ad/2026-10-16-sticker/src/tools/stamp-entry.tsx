import { createRoot } from "react-dom/client";
import { StampMaker } from "@/components/editor/stamp-maker";
createRoot(document.getElementById("root")!).render(<StampMaker owner="ad-local" onClose={()=>{}} onStored={()=>{}} />);

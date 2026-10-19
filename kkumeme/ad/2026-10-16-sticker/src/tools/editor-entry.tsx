import { createRoot } from "react-dom/client";
import Editor from "@/components/editor/editor";
import "./fixture";
createRoot(document.getElementById("root")!).render(<Editor />);

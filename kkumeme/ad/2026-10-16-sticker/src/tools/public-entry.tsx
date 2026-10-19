import { createRoot } from "react-dom/client";
import { PageView } from "@/components/editor/page-view";
import { fixture } from "./fixture";
createRoot(document.getElementById("root")!).render(<PageView document={fixture(true)} enableStickerPeel displayCopies={false} displayMode="mobile-area" />);

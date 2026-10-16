import { createRoot } from "react-dom/client";
import { PageView } from "@/components/editor/page-view";
import { blankDocument, createElement } from "@/lib/editor/model";
const doc = blankDocument();
const page = doc.pages[0];
page.background = "#fff6e8";
page.pattern = "dots";
page.height = 900;
page.elements = [
  createElement("text", { x: 440, y: 60, width: 400, height: 60, content: "떼었다 붙였다", fontSize: 34, fontFamily: "round", fontWeight: "700", align: "center" }),
  createElement("sticker", { x: 470, y: 180, width: 220, height: 293, src: "/api/assets/11111111-1111-4111-8111-111111111111", rotation: -6 }),
  createElement("sticker", { x: 690, y: 420, width: 160, height: 160, src: "/api/assets/22222222-2222-4222-8222-222222222222", rotation: 8 }),
];
createRoot(document.getElementById("root")!).render(
  <PageView document={doc} enableStickerPeel displayCopies={false} displayMode="mobile-area" />,
);

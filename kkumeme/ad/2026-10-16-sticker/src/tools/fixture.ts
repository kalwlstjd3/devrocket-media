import { blankDocument, createElement } from "@/lib/editor/model";
export const ASSETS = {
  cat: "/api/assets/11111111-1111-4111-8111-111111111111",
  heart: "/api/assets/22222222-2222-4222-8222-222222222222",
  flower: "/api/assets/33333333-3333-4333-8333-333333333333",
} as const;
export function fixture(publicPage = false) {
  const doc = blankDocument();
  doc.title = "내 스티커 기록";
  const page = doc.pages[0];
  page.background = "#fff9ee"; page.pattern = "dots"; page.height = 1000;
  page.elements = [createElement("text", {id:"ad-title",x:438,y:62,width:400,height:85,content:"좋아하는 것들로\n내 공간 한 장",fontFamily:"gaegu",fontWeight:"700",fontSize:38,rotation:-2})];
  if(publicPage)page.elements.push(
    createElement("sticker",{id:"ad-cat",x:560,y:230,width:160,height:192,src:ASSETS.cat,rotation:0}),
    createElement("sticker",{id:"ad-heart",x:430,y:465,width:100,height:100,src:ASSETS.heart,rotation:8}),
    createElement("sticker",{id:"ad-flower",x:710,y:500,width:105,height:105,src:ASSETS.flower,rotation:-6}),
    createElement("text",{id:"ad-note",x:455,y:650,width:350,height:80,content:"떼었다 붙여 봐요",fontFamily:"gaegu",fontWeight:"700",fontSize:32,rotation:3}),
  );
  return doc;
}
// A deterministic fixture in the recording page only; no app source is patched.
(window as unknown as {AD_FIXTURE: unknown}).AD_FIXTURE=fixture();

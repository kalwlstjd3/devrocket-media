# samples-1109 — original artwork and layout studies

2026-11-09 / GPT. Original, hand-authored SVG geometry; no third party characters, logos, photos, generated photorealistic imagery, fonts, scripts or remote resources in sticker files. Project owner may use, modify, and distribute these assets for kkumeme.

- `a/01-*.svg`–`a/08-*.svg`: 8 year-review stickers.
- `b/01-*.svg`–`b/08-*.svg`: 8 pink stickers.
- `*/preview-sheet.png`: visual review sheets only (cream background is intentional on the sheet).
- Individual stickers: 1024×1024 transparent root canvas, 256-unit viewBox, #3b2618 7-unit outline. Keep transparent when rendering/uploading; do not upload the sheet as a sticker.
- `a/photo-art/`: 9 original illustrated picture-slot sources, SVG and ready-to-use 1024 PNG. These square pictures intentionally have opaque colored backgrounds; upload them as ordinary photos, not custom stickers. No Unsplash dependencies or credits required.
- `*/layout-study.{svg,png}`: planning illustrations, not screenshots or publishable page images. System Noto font in studies differs from editor font selections. Rebuild using editable elements; never flatten the whole page.
- `*/home-card-study.png`: 160×280 size study; `*/share-study.png`: top 480×251 crop study. Neither is the actual service-generated thumbnail.
- B's stamp in the layout study is a schematic rectangle. Create the real perforated stamp through the editor (square / mid teeth / wide margin / #f7dde3 / none tone / PINK caption / bold font), using b/03-shell.svg rendered to PNG as source. The output is a new sticker; do not treat the rectangle as the finished stamp.
- Server: render each of the 16 sticker SVGs to 1024 transparent PNG with installed sharp, register via custom-sticker, assign names from manifest.json. A illustrative photo PNGs use ordinary photo upload; B stamp source uses album input in stamp maker. No admin catalog.
- Detailed implementation plan: kkumeme reports branch `2026-11-09/samples-1109-plan-gpt.md`.

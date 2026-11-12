# 열어 보는 편지 — AI 실사 시안 이미지

**AI 생성 · 파일별 사용 범위 구분(CEO 2026-11-12 14:39)**

CEO 승인(2026-11-12 14:39·14:48)에 따라 이 폴더 6장 모두 제품·홍보에 사용할 수 있습니다. 손편지·아이 그림·포스트잇 3장은 아래 추가 조건을 지켜야 합니다. 조건: 로고·브랜드가 없고 기존 캐릭터와 닮지 않은 소재만 사용합니다(사진 프레임 AI 예외와 같은 기준).

| 사용 범위 | 파일 |
| --- | --- |
| 제품·홍보 영상 사용 가능 | cover-envelope.jpg, cover-hanji.jpg, cover-tracing.jpg |
| 제품·홍보 사용 가능 · 매 사용처 「AI 활용」 4개 언어 표기 · 실제 사용자 사연처럼 소개 금지 | drawing-kid.jpg, letter-hand.jpg, postit.jpg |

손편지·아이 그림·포스트잇 3장은 AI로 새로 만든 예시이며 실제 사용자 편지·아이 그림·사연으로 소개하지 않습니다. 화면·영상 등 쓰는 곳마다 해당 소재와 함께 「AI 활용」을 표시합니다. 공통 푸터나 게시글 설명에 한 번 적는 것으로 대신하지 않습니다. 실제 사용자 콘텐츠라는 오해를 만드는 계정·인용·후기 문맥을 사용하지 않습니다.

| 언어 | 표시 문구(초안) |
| --- | --- |
| ko | AI 활용 |
| en | Made with AI |
| ja | AIを活用 |
| zh-TW | 使用 AI 製作 |

기본 언어 표시는 사용처 언어와 맞추며, 번역은 제품 사전에 문장 키 하나로 등록할 예정입니다(이번 코드/사전 변경 없음). 덮개 질감 3장의 14:39 승인에는 이 추가 표기 조건이 붙지 않았습니다. 아래 생성 프롬프트의 Internal design mock only는 생성 당시 목적 기록이며, 현재 허용 범위는 위 표와 14:48 조건이 정본입니다.

생성 도구: ChatGPT 내장 OpenAI 이미지 생성 도구 `image_gen.imagegen`. 생성된 PNG를 Pillow로 RGB JPG 품질 85, optimize/progressive, 4:2:0으로 인코딩했습니다. 원본 해상도를 유지했고 EXIF는 전달하지 않았습니다.

| 파일 | 크기(px) | 바이트 | 용도 |
| --- | --- | ---: | --- |
| [drawing-kid.jpg](drawing-kid.jpg) | 1254×1254 | 328,796 | 크레파스 가족 그림·나무 책상 |
| [letter-hand.jpg](letter-hand.jpg) | 1254×1254 | 313,257 | 연필 손글씨 편지·접힌 자국 |
| [postit.jpg](postit.jpg) | 1254×1254 | 290,465 | 노란 메모·한 줄·웃는 얼굴 |
| [cover-envelope.jpg](cover-envelope.jpg) | 1254×1254 | 286,047 | 빈 크라프트 봉투 앞면 질감 |
| [cover-hanji.jpg](cover-hanji.jpg) | 1254×1254 | 228,471 | 미색 한지 섬유 질감 |
| [cover-tracing.jpg](cover-tracing.jpg) | 1254×1254 | 83,857 | 트레이싱지·희미한 뒤 무늬 |

6장 모두 1024px 이상이며 장당 500,000바이트 미만입니다. 4~6번 덮개는 종이 면만 화면을 채우도록 생성했습니다. 트레이싱지는 반투명한 재질의 사진 표현이며 JPG 파일 자체에 알파 채널은 없습니다.

## 생성 프롬프트 기록

### drawing-kid.jpg

Use case: photorealistic-natural. Generate one photorealistic smartphone overhead photograph, at least 1024x1024 pixels. A whole A4 white sheet on a natural wooden desk, with an unskilled young child's wax-crayon family drawing: three crude stick-figure people, a small yellow sun and simple red hearts, uneven scribbled lines and white paper margins. These are drawings on paper only, not actual people. Soft everyday window daylight, believable crayon wax and paper texture, casual home snapshot, nearly top-down. No words, names, hands, real human faces, brands, logos, watermarks, props or stationery. One image, not a collage. For internal design mock review only.

### letter-hand.jpg

Use case: photorealistic-natural. One photorealistic smartphone top-down close photograph, at least 1024x1024 pixels, of a portion of ordinary cream-white lined stationery with a natural Korean pencil handwritten letter. Legible modest uneven graphite handwriting, exact generic lines: '늘 고마워.' '오늘도 네 편이야.' '함께 웃는 날이 많았으면 좋겠어.' '작은 마음을 담아.' No date, greeting name, signature or real names. Show subtle horizontal fold creases and paper tooth; pale thin blue-gray rules. Paper fills almost entire image, a tiny neutral tabletop margin is okay, soft natural window daylight, subdued casual realism, not vector typography or calligraphy. No hands, people, faces, logos, brands, pencils, stamps or watermarks. One image, not a collage. Only for internal design review.

### postit.jpg

Use case: photorealistic-natural. One realistic smartphone photograph from directly overhead, at least 1024x1024 pixels. A single plain yellow square sticky note lying flat on a pale neutral desk, filling most of the frame with a modest margin. On it a casual graphite handwritten short Korean line exactly '오늘도 응원해!' and beneath it a small simple smiley face doodle. Natural imperfect handwriting, very slight paper curl at one corner, authentic matte yellow paper and soft natural daylight. No other sheets, no pencils, no people, no real names, no hands or human faces, no logos, branding, watermark. Not illustration, no collage. Internal design mock only.

### cover-envelope.jpg

Use case: photorealistic-natural. Generate one realistic top-down flat photograph of the BLANK FRONT FACE of a plain kraft-paper envelope, at least 1024x1024 pixels. Full-bleed material image: the envelope front surface fills every pixel to all four edges, camera exactly perpendicular, no envelope outline or desk visible. Warm natural brown kraft fibers with believable very subtle paper variation and tiny natural speckles, softly and uniformly lit by diffuse daylight. It must read as a clean unmarked envelope face, not the back: no flap, no triangular seams. Absolutely no cast shadows, vignette, folds, text, address, stamps, logos, seals, decorative marks, borders, objects, fingers, hands, people, or watermark. Flat usable cover-paper texture, realistic phone capture, not an illustration. Internal design mock only.

### cover-hanji.jpg

Use case: photorealistic-natural. Generate a photorealistic flat front-on top-down macro photograph of one sheet of cream-colored Korean hanji paper, at least 1024x1024 pixels. Paper fills the entire frame edge-to-edge with no margins, table, outline or paper edge visible. Warm off-white/ivory handmade mulberry-fiber paper, delicate visible irregular long natural fibers embedded in a fine matte texture, subtle authentic pale fiber variation, not dirty. Soft perfectly even diffuse natural daylight. No shadows, vignette, gradient, folds, lettering, drawings, people, fingers, logos, watermarks, border, stamps, or objects. An unmarked realistic paper cover texture, not a stylized illustration. Internal design mock only.

### cover-tracing.jpg

Use case: photorealistic-natural. A single photorealistic overhead perpendicular macro photograph, at least 1024x1024 pixels: one flat sheet of translucent tracing paper fully filling the frame edge to edge. Pale milky neutral white, smooth very fine vellum texture. A few extremely faint broad gray curved pencil-like strokes on the surface BELOW the sheet are barely visible through it, softly diffused and unreadable, enough to suggest gentle translucency. No recognizable figures or letters. The top sheet has no writing. Perfectly even soft natural daylight; flat front-on material cover. No shadows, shading gradient, vignette, paper edges, wrinkles, desk margin, folds, logos, brands, watermarks, people, fingers or objects. Not transparent PNG; photograph the translucent material and what is softly visible beneath. Internal design mock only.

### cover-tracing.jpg 보정

Edit this tracing-paper photograph only: preserve its full-bleed flat, evenly naturally lit translucent white paper texture, square crop, no visible edges, no cast shadow. Make the translucency meaningfully visible: underneath the sheet place two or three broad, very softly defocused pale blue-gray curved handwritten-pencil squiggles, clearly faint but visible through the milky paper, around the central and lower area, approximately 10% contrast. No legible letters, names, words, identifiable drawings, or objects. They must look physically below the tracing paper, blurred by its translucency, not written on its top. Keep no logos, people, hands, marks at the edges, vignette or branding. At least 1024 pixels.


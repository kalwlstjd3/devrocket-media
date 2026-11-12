# 열어 보는 편지 — 콜라주 소재 시안

**AI 생성 · 시안 확인 전용 · 확정 전 제품/홍보/샘플 반영 금지**

하늘 사진 위에 실물 오리기·빈 말풍선·낙서·반응 스티커를 빽빽이 겹치는 콜라주 문법을 위한 신규 소재다. 특정 Pinterest 핀·그림·문구·외부 캐릭터 이미지를 가져오거나 생성 입력하지 않았다. 반응 4종만 앞서 자체 생성한 수달·고슴도치 시트를 그림체·정체성 참조로 입력했다(이 저장소 `kkumeme/open-letter-chars/`, 82aeb51e2c7434c49096baea6c9ba3a45b3c9295).

## 파일
| 파일 | 크기 | bytes | 내용 |
|---|---|---:|---|
| bubble-burst.png | 1024×1024 | 26302 | 글자 없는 빈 말풍선/라벨 |
| bubble-cloud.png | 1024×1024 | 25647 | 글자 없는 빈 말풍선/라벨 |
| bubble-label.png | 1024×1024 | 30154 | 글자 없는 빈 말풍선/라벨 |
| bubble-round.png | 1024×1024 | 23918 | 글자 없는 빈 말풍선/라벨 |
| bubble-tag.png | 1024×1024 | 17059 | 글자 없는 빈 말풍선/라벨 |
| bubble-ticket.png | 1024×1024 | 45359 | 글자 없는 빈 말풍선/라벨 |
| clover-1.png | 1024×1024 | 205587 | 실사 클로버 다이컷 |
| clover-2.png | 1024×1024 | 184652 | 실사 클로버 다이컷 |
| clover-3.png | 1024×1024 | 80855 | 실사 클로버 다이컷 |
| doodle-flower.png | 1024×1024 | 43308 | 손그림 낙서 |
| doodle-heart.png | 1024×1024 | 23103 | 손그림 낙서 |
| doodle-sparkle.png | 1024×1024 | 39844 | 손그림 낙서 |
| doodle-star.png | 1024×1024 | 63581 | 손그림 낙서 |
| hedgehog-clap.png | 1024×1024 | 77883 | 자체 캐릭터 반응 |
| hedgehog-love.png | 1024×1024 | 78863 | 자체 캐릭터 반응 |
| otter-cry.png | 1024×1024 | 69311 | 자체 캐릭터 반응 |
| otter-wow.png | 1024×1024 | 66898 | 자체 캐릭터 반응 |
| sky.jpg | 1080×1920 | 168237 | 실사 낮 하늘 |

- `clover-1`: 네잎, 넓은 정면. `clover-2`: 세잎. `clover-3`: 긴 줄기 네잎, 비스듬한 시점.
- 말풍선 6종은 가운데 채움만 남긴 빈 상태다. 글자는 별도 레이어로 얹는다. PNG 투명 여백 포함 1024 정사각형이며, 실제 모양의 종횡비는 유지했다.
- `bubble-tag`의 구멍은 투명하다. 티켓의 양끝 파임·외곽 여백도 투명하다.
- 반응: 수달 놀람/감동 눈물, 고슴도치 하트 눈/박수. 긴 귀 흰 토끼·브랜드·기존 유명 캐릭터 모사 지시 없음.
- 모든 PNG는 흰 다이컷 테두리, 300,000 bytes 이하. `sky.jpg`는 1080×1920(9:16), 500,000 bytes 이하.

## 도구·처리
- 생성: OpenAI ChatGPT 내장 ImageGen, 자산별 1회(18회).
- PNG: 각 이미지를 순수 #00FF00 그린 배경으로 생성 → ImageMagick 7로 그린 영역 알파 제거 → 투명 경계 인접 픽셀만 초록 번짐 보정 → 종횡비 유지, 긴 변 940px 내외/1024 정사각형 투명 캔버스 → 64색 최적화 PNG.
- JPG: ImageMagick 7, 1080×1920 맞춤·중앙 크롭, quality 85, 4:2:0, 메타데이터 제거.
- 검증: Pillow 읽기 전용으로 치수·알파·용량·키 그린 잔여 픽셀 검사. 초록 제거가 꽃의 연초록 잎을 회색으로 바꾸는 중간 결과를 폐기하고 경계 전용 보정으로 다시 추출했다. 클로버 잎·연초록 채움은 보존했다.
- 자산별 목시 확인: 빈 내부·브랜드/문자 없음·흰 테두리·클로버 잎수·반응 표정. 실제 제품 통합·모바일 앱 렌더·애니메이션 미검증.

## 프롬프트 원문
### sky.jpg
```text
Use case: photorealistic-natural. Original smartphone sky background for a maximal paper collage. Vertical 9:16 composition 1080x1920. Clear bright daytime blue sky with fluffy soft white cumulus clouds, natural realistic sunlight, fresh cheerful mood, sky only from top to bottom, no ground, horizon buildings wires airplane birds people logos text or brands. Cloud clusters scattered through upper and lower thirds with blue breathing room in center. Authentic photographic cloud texture, not illustration.
```

### clover-1.png
```text
Use case: product-mockup. ONE original photorealistic freshly picked FOUR-LEAF CLOVER sticker, four distinct heart-shaped green leaves and a short curved stem, detailed real leaf veins, face-on slightly irregular natural arrangement. Thick WHITE paper diecut border around complete silhouette, all leaves connected. Uniform pure chroma green #00FF00 background, no shadow outside white border. Clover leaf colors must be deep forest/olive green with warm yellow veins, never luminous chroma green. Entire sticker centered with 12% margin square canvas, no other objects, no letters logos brands. Made for playful cut-and-paste scrapbook collage.
```

### clover-2.png
```text
Use case: product-mockup. ONE newly created photorealistic botanical cutout sticker, natural leaf veins, thick WHITE diecut paper border around the whole silhouette. Pure vivid #00FF00 chroma background, no cast shadow. Deep natural forest green leaves with olive veins, distinctly darker than background, no neon green leaves. Centered whole sticker with wide margins, square composition, no text logo brand props. A THREE-LEAF CLOVER, exactly THREE heart-shaped leaflets forming a triangular trefoil, one small gracefully curling stem, slight diagonal lean left. Real fresh shamrock.
```

### clover-3.png
```text
Use case: product-mockup. ONE newly created photorealistic botanical cutout sticker, natural leaf veins, thick WHITE diecut paper border around the whole silhouette. Pure vivid #00FF00 chroma background, no cast shadow. Deep natural forest green leaves with olive veins, distinctly darker than background, no neon green leaves. Centered whole sticker with wide margins, square composition, no text logo brand props. A small FOUR-LEAF CLOVER on a long slender curving stem, exactly FOUR small rounded heart-shaped leaflets, slight side angle right, pale natural chevron markings on leaves. Different silhouette from a broad flat four-leaf sticker.
```

### bubble-round.png
```text
Use case: illustration-story. ONE original empty hand-drawn scrapbook speech-label sticker. Bold imperfect BLACK marker outline, flat pastel fill, thick WHITE diecut outer border. Center 70% of shape completely blank flat fill for later text overlay; NO letters words symbols faces logos brands. Full sticker with broad square green margins, pure uniform chroma GREEN #00FF00 backdrop, no shadows. Playful maximal collage stationery, intentionally simple paper shapes, not polished UI. Wide ROUND OVAL speech bubble, off-white fill, little curved tail pointing bottom-left. Shape aspect ratio about 1.5:1.
```

### bubble-cloud.png
```text
Use case: illustration-story. ONE original empty hand-drawn scrapbook speech-label sticker. Bold imperfect BLACK marker outline, flat pastel fill, thick WHITE diecut outer border. Center 70% of shape completely blank flat fill for later text overlay; NO letters words symbols faces logos brands. Full sticker with broad square green margins, pure uniform chroma GREEN #00FF00 backdrop, no shadows. Playful maximal collage stationery, intentionally simple paper shapes, not polished UI. Wide CLOUD shaped speech bubble with six big rounded scallops, very pale PINK fill, two small connected thought-bubble circles toward lower right enclosed by same white border. Broad blank writing interior.
```

### bubble-burst.png
```text
Use case: illustration-story. ONE original empty hand-drawn scrapbook speech-label sticker. Bold imperfect BLACK marker outline, flat pastel fill, thick WHITE diecut outer border. Center 70% of shape completely blank flat fill for later text overlay; NO letters words symbols faces logos brands. Full sticker with broad square green margins, pure uniform chroma GREEN #00FF00 backdrop, no shadows. Playful maximal collage stationery, intentionally simple paper shapes, not polished UI. Comic EXPLOSION BURST bubble, bright pale YELLOW fill, 12 irregular sharp pointed rays around broad horizontal blank oval center. No printed exclamation mark. Energetic handcut silhouette.
```

### bubble-label.png
```text
Use case: illustration-story. ONE original empty hand-drawn scrapbook speech-label sticker. Bold imperfect BLACK marker outline, flat pastel fill, thick WHITE diecut outer border. Center 70% of shape completely blank flat fill for later text overlay; NO letters words symbols faces logos brands. Full sticker with broad square green margins, pure uniform chroma GREEN #00FF00 backdrop, no shadows. Playful maximal collage stationery, intentionally simple paper shapes, not polished UI. Wide rectangular LABEL, pale MINT green fill, slightly wonky corners, double handdrawn black border near outer edge. Horizontal 1.8:1, broad empty center.
```

### bubble-tag.png
```text
Use case: illustration-story. ONE original empty hand-drawn scrapbook speech-label sticker. Bold imperfect BLACK marker outline, flat pastel fill, thick WHITE diecut outer border. Center 70% of shape completely blank flat fill for later text overlay; NO letters words symbols faces logos brands. Full sticker with broad square green margins, pure uniform chroma GREEN #00FF00 backdrop, no shadows. Playful maximal collage stationery, intentionally simple paper shapes, not polished UI. One wide pale PINK paper gift TAG, clipped corners at left end, a punched circular hole near left end and a loose black string loop attached there curling upward outside tag. White diecut edge also outlines string. No writing, no decorative print, blank rectangular center.
```

### bubble-ticket.png
```text
Use case: illustration-story. ONE original empty hand-drawn scrapbook speech-label sticker. Bold imperfect BLACK marker outline, flat pastel fill, thick WHITE diecut outer border. Center 70% of shape completely blank flat fill for later text overlay; NO letters words symbols faces logos brands. Full sticker with broad square green margins, pure uniform chroma GREEN #00FF00 backdrop, no shadows. Playful maximal collage stationery, intentionally simple paper shapes, not polished UI. One pale YELLOW horizontal admission TICKET shape, semicircular notches at left and right edges, black handdrawn dashed perforation lines close to each side, large empty center. NO numbers, text, symbols or barcode. Thick white diecut border.
```

### doodle-heart.png
```text
Use case: illustration-story. One original playful handdrawn doodle sticker for dense photo scrapbook collage. Thick imperfect black felt-tip marker contour, simple flat colors, thick WHITE diecut outer border. Centered entire sticker with generous margins on uniform pure chroma GREEN #00FF00 backdrop, NO shadows, no letters/text/brands/logos, no face, no existing mascot. Not a sheet, ONE motif only. One big wonky HOT PINK heart, smaller white highlight stroke inside top left, slightly tilted.
```

### doodle-star.png
```text
Use case: illustration-story. One original playful handdrawn doodle sticker for dense photo scrapbook collage. Thick imperfect black felt-tip marker contour, simple flat colors, thick WHITE diecut outer border. Centered entire sticker with generous margins on uniform pure chroma GREEN #00FF00 backdrop, NO shadows, no letters/text/brands/logos, no face, no existing mascot. Not a sheet, ONE motif only. One lopsided FIVE POINT yellow star, rough black handdrawn outline, tiny interior pink dash accent.
```

### doodle-sparkle.png
```text
Use case: illustration-story. One original playful handdrawn doodle sticker for dense photo scrapbook collage. Thick imperfect black felt-tip marker contour, simple flat colors, thick WHITE diecut outer border. Centered entire sticker with generous margins on uniform pure chroma GREEN #00FF00 backdrop, NO shadows, no letters/text/brands/logos, no face, no existing mascot. Not a sheet, ONE motif only. One cluster of THREE four-point diamond twinkles, biggest pale mint green in center, two smaller pale pink and yellow on either side, connected by common white diecut silhouette. Rounded black uneven contour.
```

### doodle-flower.png
```text
Use case: illustration-story. One original playful handdrawn doodle sticker for dense photo scrapbook collage. Thick imperfect black felt-tip marker contour, simple flat colors, thick WHITE diecut outer border. Centered entire sticker with generous margins on uniform pure chroma GREEN #00FF00 backdrop, NO shadows, no letters/text/brands/logos, no face, no existing mascot. Not a sheet, ONE motif only. One simple five-petal PINK flower, circular yellow center, short curved black stem with one pale MINT green leaf. No face or expression, bold naive school-notebook drawing.
```

### otter-wow.png
```text
Use case: precise-object-edit. Supplied image is OUR OWN original animal sheet; use only to match character identity and chunky handdrawn dark brown outline, warm flat chestnut/apricot/cream palette, white diecut border. Create ONE isolated reaction sticker, not a sheet, full character centered with wide margins on uniform PURE GREEN #00FF00 chroma background. Preserve unique short round ears, broad cream muzzle, whisker lines and paddle tail of otter. No text lettering logos brands, no famous character likeness, no props. Only the chestnut baby OTTER, frontal, surprised delighted expression: eyebrows high, round wide eyes, little O-shaped open mouth, both paws on cheeks. Whole short body and tail visible. Emotion reads at70px.
```

### otter-cry.png
```text
Use case: precise-object-edit. Supplied image is OUR OWN original animal sheet; use only to match character identity and chunky handdrawn dark brown outline, warm flat chestnut/apricot/cream palette, white diecut border. Create ONE isolated reaction sticker, not a sheet, full character centered with wide margins on uniform PURE GREEN #00FF00 chroma background. Preserve unique short round ears, broad cream muzzle, whisker lines and paddle tail of otter. No text lettering logos brands, no famous character likeness, no props. Only the chestnut baby OTTER, frontal, tears of JOY / deeply touched: smiling curved eyes with two large pale blue teardrops rolling down cheeks, warm smiling mouth, paws clasped to chest. Happy emotional not sad. Whole short body and paddle tail visible.
```

### hedgehog-love.png
```text
Use case: precise-object-edit. Supplied image is OUR OWN original character sheet, use as identity/style reference. Create ONE isolated reaction sticker of the apricot baby HEDGEHOG ONLY, cream face and belly, tiny triangular nose, small round ears, five-scallop cocoa back silhouette. Match reference's chunky handdrawn brown lines, flat warm palette, white diecut border. Full small body centered with wide square margins on uniform pure chroma GREEN #00FF00 background, no shadow. NO letters text logo brand props, not a sheet, no other animals. Happy adoring expression with TWO PINK HEART-SHAPED EYES, open smiling mouth, both paws pressed against cheeks. Emotion clear at 70px, no floating text.
```

### hedgehog-clap.png
```text
Use case: precise-object-edit. Supplied image is OUR OWN original character sheet, use as identity/style reference. Create ONE isolated reaction sticker of the apricot baby HEDGEHOG ONLY, cream face and belly, tiny triangular nose, small round ears, five-scallop cocoa back silhouette. Match reference's chunky handdrawn brown lines, flat warm palette, white diecut border. Full small body centered with wide square margins on uniform pure chroma GREEN #00FF00 background, no shadow. NO letters text logo brand props, not a sheet, no other animals. Ecstatic CLAPPING expression: closed smiling curved eyes, cheerful open smile, TWO small cream paws visibly meeting palm-to-palm in front of chest, small curved brown action strokes beside paws. Anatomically simple, exactly two arms, no extra paws. Emotion readable at70px.
```

# 열어 보는 편지 — 당김 포옹 카드 캐릭터 시안

**AI 생성 · 오리지널 창작 시안 · 확정 전 제품 반영 금지**

밤색 아기 수달(왼쪽) + 살구색 아기 고슴도치(오른쪽). 선·눈·코·실루엣은 독자 프롬프트로 신규 생성했다. @a.tiny.hole Hug Card는 당김 작동 방식만 전달받았으며 레퍼런스 이미지·영상은 조회하거나 생성 입력에 사용하지 않았다. 흰 긴 귀 토끼 및 기존 유명 캐릭터를 모사하도록 지시하지 않았다. 전 세계 기존 캐릭터와의 유사성에 대한 법률 검증을 뜻하지 않는다.

## 파일
전부 1024×1024 투명 PNG, 흰 다이컷 테두리. 몸 전체는 동일 880px 높이 기준, 중앙 정렬. 팔은 동일 405px 이내 폭 기준, 중앙 정렬.
- `hedgehog-arm-back.png` — 7,308 bytes
- `hedgehog-arm-front.png` — 7,435 bytes
- `hedgehog-base.png` — 63,713 bytes
- `hedgehog-body.png` — 39,007 bytes
- `hedgehog-hug.png` — 73,122 bytes
- `hug-assembly-preview.png` — 47,223 bytes
- `hug-preview.png` — 54,628 bytes
- `otter-arm-back.png` — 9,910 bytes
- `otter-arm-front.png` — 9,836 bytes
- `otter-base.png` — 45,171 bytes
- `otter-body.png` — 48,348 bytes
- `otter-hug.png` — 44,229 bytes

- `*-base.png`: 정면, 상대 방향으로 양팔 뻗기.
- `*-hug.png`: 상대 쪽으로 기울인 개별 포옹 자세.
- `*-body.png`: 팔 없는 몸통. `*-arm-back/front.png`: 각각 별도 팔 파츠. 애니메이션 시안용이며 몸통에 얹을 때 어깨 연결·회전축 조정이 필요하다. 완성 자세의 정확한 픽셀 분해본은 아니다.
- `hug-preview.png`: 두 캐릭터가 팔로 감싼 완성 장면 확인용 생성 합본. 개별 PNG와 픽셀 단위로 동일하지 않다.
- `hug-assembly-preview.png`: 개별 hug PNG를 각 600×600으로 축소, 1024 캔버스 (0,220)/(424,220)에 순서대로 겹친 실제 조립 확인본. 손을 맞댄 단계이며, 감싸기 동작에는 분리 팔 레이어 조정이 필요하다.

## 제작·검증
도구: OpenAI ChatGPT 내장 ImageGen. 배경 제거·크롭·동일 캔버스·48색 PNG 압축: ImageMagick 7. 치수·알파·크기·색 검사: Pillow(읽기 전용).
순수 #00FF00 배경으로 생성 → 초록 우세 픽셀 알파 제거 → 남은 녹색 성분 제거 → 캐릭터/팔별 크롭 및 정렬. 자동 투명화 시도는 외곽 잔여물이 있어 폐기하고 그린 원본에서 추출했다.
모든 PNG: 300,000 bytes 이하, alpha 0/255 포함, 불투명 픽셀에서 G가 R·B 양쪽보다 12 이상 높은 잔여 초록 픽셀 0. 70px 축소 표정·실루엣 시각 확인. 실제 애니메이션·제품 통합·실기기 검증은 하지 않았다.

## 프롬프트 원문
### 기본·포옹 자세 시트
```text
Use case: illustration-story. Original pull-tab hug-card sticker character design sheet, no text. TWO DISTINCT NEW ANIMALS: left a warm chestnut baby otter with tiny round ears, cream broad muzzle and belly, little rounded paddle tail; right an apricot baby hedgehog with a five-scallop cocoa back silhouette, cream face, tiny triangular nose. Chunky asymmetric handdrawn dark-brown line, flat chestnut/apricot/cream with dark ink, white diecut border. Extremely simple expressive eyes and smiles legible at 70px, no gradients, no blush details, no accessories. Not rabbits, no long ears, no existing mascot resemblance. Uniform pure chroma green #00FF00 background, no shadows. 1024 square sheet with FOUR fully separate sticker figures in a 2x2 grid with wide green gutters. Top left: otter frontal standing, both short arms reaching RIGHT toward partner. Top right: hedgehog frontal standing, both arms reaching LEFT. Bottom left: same otter same size, leaning RIGHT in hugging pose, arms wrapping to right. Bottom right: same hedgehog same size, leaning LEFT in complementary hugging pose, arms wrapping left. All entire bodies visible, each figure fully contained in its quadrant, equal head/body scale, feet common baseline per row. Bottom poses should form a tender embrace when brought together. No labels, letters, logo, heart props, brands, scenery. Create unique identities from this prompt only; no reference imagery used.
```
### 확인용 완성 포옹 합본
```text
Use case: precise-object-edit. Input is our own newly created otter/hedgehog design sheet, identity and style reference ONLY. Create ONE combined hug scene: chestnut baby otter on LEFT and apricot baby hedgehog on RIGHT, standing cheek-to-cheek, leaning into each other, each visibly wrapping short arms around the other in a tender reciprocal hug. Preserve character identities, proportions, round otter ears, hedgehog scalloped cocoa silhouette, cream muzzles, closed smiling eyes and chunky handdrawn brown lines with white diecut border. Flat simple palette no gradients. Full bodies, equal size, centered, occupy 85% square. Uniform pure chroma green #00FF00 background, no shadows, no text/logos/props. This is an original sticker preview, not any existing character.
```
### 몸통·팔 분리 시트
```text
Use case: precise-object-edit. Our generated sheet is the identity reference. Make an animation parts sheet, uniform PURE GREEN #00FF00 background. FOUR ISOLATED items in equal 2x2 cells with generous green gutters, no touching. Top LEFT: the exact baby chestnut otter frontal full body, NO ARMS at all, uninterrupted body contour, retain round ears, cream muzzle and belly, paddle tail, feet, smiling eyes. Top RIGHT: the exact apricot baby hedgehog frontal full body, NO ARMS at all, uninterrupted body contour, cocoa scalloped back, cream face and belly, feet. Bottom LEFT: ONLY a pair of short otter forearms/paws reaching RIGHT, detached from body, grouped in this cell but each arm separated by green. Bottom RIGHT: ONLY pair of cream/apricot hedgehog forearms reaching LEFT, detached and separated. Same character scale as top row, not giant arms; arm lengths about 35% of full body height. White diecut borders, chunky brown handdrawn outlines, original same faces. NO extra heads or bodies in bottom row. No labels/text/brands/shadows. These parts will be layered by an animator.
```
### 폐기한 자동 투명화 시도
```text
Use case: background-extraction. Edit the supplied newly generated character sheet only. Remove all chroma green background, including green gaps and fringe, replace with genuine alpha transparency. Preserve all four drawings, exact positions, silhouettes, white diecut border, expressions, scale, colors and linework; no green spill. No added content, no checkerboard baked in. Keep same square canvas.
```

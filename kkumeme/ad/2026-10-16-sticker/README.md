# 꾸밈 스티커 광고 — 20초 초안

**렌더 미실행. 현재는 소스만 있으며 MP4·board.png가 없습니다. 고양이 원본도 이 대화에 아직 첨부되지 않아 placeholder를 사용합니다.**

- 제작: GPT, 2026-10-19. 지시서의 지정 경로/브랜치 날짜 `2026-10-16`을 유지했습니다.
- 브랜치: `ad/2026-10-16-sticker` → Draft PR. main 직접 변경·merge·배포 없음.
- 목표: `kkume-sticker-ad-20s.mp4` — 1080×1920, 30fps, 20초/600프레임, 무음, H.264/yuv420p.
- 목표 스토리보드: `board.png` — 7컷 대표 정지 화면.
- 메시지: 「찍으면 스티커, 붙이면 내 공간」. 마지막 대표 문구는 「내 마음대로 꾸미고 공유하기」 그대로.

## 구성 (CEO 확정 시간표)
| 시간 | 컷 | 자막 | 제작 방식 |
|---|---|---|---|
| 0–2초 | 고양이 사진→배경 없는 흰 테두리 스티커 | 이거, 스티커 돼요 | HTML 모션. 현재 원본/결과 모두 임시 소재 |
| 2–5초 | 스티커 만들기→앨범 선택→스캔→결과 | 찍기만 하면 배경 제거 + 테두리까지 | 실제 Editor + StickerZipbag, API 모킹 촬영 스크립트 |
| 5–8초 | 결과가 지퍼백으로 날아가고 지퍼 닫힘·개수 증가 | 내 스티커 지퍼백에 차곡차곡 | 위 실제 UI 녹화의 연속 구간 |
| 8–11초 | 고양이·하트·꽃 3개 꺼내 붙이기, 크기·회전 | 꺼내서 마음대로 붙이고 | 실제 Editor UI 조작. 긴 take를 3초로 빠르게 편집 |
| 11–13초 | 사진 일부가 톱니 우표로 오려짐 | 우표로도 오려요 | 실제 StampMaker |
| 13–17초 | 공개 페이지 스티커 모서리 떼기→뒷면→이동·재부착 | 방문자도 떼었다 붙일 수 있어요 | 실제 PageView enableStickerPeel + CDP 터치 |
| 17–20초 | 꾸밈 로고·대표 문구·kkume.me·주소 칩 | 내 마음대로 꾸미고 공유하기 | 기존 브랜드 SVG + HTML 모션 |

## 기준과 사실
- 먼저 읽은 자료: 15초판 README/index.html/render.cjs/tools/frames.cjs·entry.tsx, `sticker-peel-ref/README.md·entry.tsx·peel.cjs`.
- 실제 UI 소스 고정: kkumeme **4a1056f**. Editor, StickerZipbag, StampMaker, PageView를 import합니다. UI 문구·로직을 복제하거나 소스를 수정하지 않습니다.
- 서버 배경 제거는 사용하지 않습니다. 촬영 컨텍스트의 `page.route`와 같은 context.route로 `/api/assets/custom-sticker` 응답을 오프라인 결과 PNG로 대체합니다. GET `/api/user-stickers`는 2개→3개, `/api/workspace`는 메모리 저장만 합니다. 미계획 API/외부 네트워크는 차단하므로 실제 계정·D1·R2·Images·게시 요청이 없습니다.
- 실제 UI가 연출을 담당하므로 생성 결과가 자동으로 페이지에 붙는 모습을 새로 만들지 않습니다. 실제 지퍼백 상세에서 카드를 눌러 붙입니다.
- 공개 떼기는 저장하지 않는 시각 효과입니다. 실제 PNG는 `/api/assets/<uuid>`로 서빙하고, displayCopies=false로 표시용 사본 요청을 피합니다.
- 방문자에게 꾸밈의 공개 페이지 UI를 보여주는 것이며 편집기의 떼기 기능을 새로 만든 것이 아닙니다.

## 소재
- **CEO 고양이 원본: 미수신.** 광고 사용 승인 사실은 지시서에 있으나 사진 파일은 보이지 않습니다. 과거 고양이 사진을 임의로 검색·대체하지 않았습니다.
- 현재 `cat-original.placeholder.svg`와 `cat-result.placeholder.svg`는 GPT가 코드로 직접 그린 임시 도안입니다. 실제 고양이 사진/배경 제거 결과가 아닙니다.
- 하트·꽃: 직접 그린 SVG. 외부 사진·인물·브랜드·Unsplash 소재 없음.
- `logo.svg`: devrocket-media `kkumeme/brand/logo-horizontal.svg` 동일 blob 재사용. 꾸밈 자체 브랜드만 사용.
- 글꼴: 기존 검은고딕400·개구체만, kkumeme의 fonts.css/woff2/OFL을 로컬로 복사. 이모지·원문자·✿ 등 추가 기호는 쓰지 않았습니다. 신규 패키지·rembg 설치 없음.
- 사진을 받으면 `src/assets/`에 원본과 **배경 투명 + 흰 테두리까지 완성한 result PNG**를 두고 `assets.json` 경로 및 placeholder=false를 갱신합니다. 결과 PNG는 원본 고양이와 동일한 피사체여야 합니다. 사진을 이중 배경 제거하지 않습니다.
- placeholder=true면 합성 영상 하단에 「소재 대기 · 렌더 초안」이 표시됩니다. 이 상태를 완성 광고로 게시하면 안 됩니다.

## 파일
- `src/index.html`, `timeline.js`: 540×960 CSS 모션 스테이지, DPR2로 1080×1920. `window.render(t)` 결정적 렌더.
- `src/tools/fixture.ts`: 광고용 버전2 문서/가상 소유자. 실제 계정 아님. 공개 페이지 영웅 스티커는 회전0으로 두어 모서리 터치 동선을 검증하기 쉽게 했습니다.
- `editor-entry.tsx`/`stamp-entry.tsx`/`public-entry.tsx`: 실제 앱 모듈 import만 하는 촬영 엔트리.
- `prepare.cjs`: 기존 esbuild로 세 번들 생성, 빌드 CSS·기존 폰트 복사, ffmpeg로 소재 RGBA PNG 준비(EXIF 메타데이터 미전달). 새 도구를 설치하지 않습니다.
- `mock.cjs`: 촬영 컨텍스트에서만 API 응답을 메모리로 가로챔. custom-sticker 호출을 받아도 Cloudflare를 부르지 않습니다.
- `capture.cjs`, `touch.cjs`: Playwright 시계/성능 시계 고정, 33.333ms씩 진행 후 프레임 캡처. 기록하는 UI 조작은 **CDP Input.dispatchTouchEvent**. 마우스 없음. 손가락 좌표는 화면 내부(18~372,18~808)만 허용하며 밖이면 실패합니다.
- `render.cjs`: 기록한 컷들을 600프레임으로 합성, 7컷 board, 무음 H.264 인코딩, ffprobe 규격 검사.
- `tools/check.cjs`: 브라우저 없는 600시점·7개 seek·소스 프레임 범위·CDP 계약 검사. 화면 검증이 아닙니다.
- `render-status.json`: 렌더 미실행·고양이 소재 대기 상태.

## LLM클코 렌더 절차
Chromium 실행 파일이 있는 기존 환경에서 진행합니다. Node·기존 esbuild·기존 Playwright·ffmpeg/ffprobe가 필요합니다. **kkumeme에 커밋하지 않습니다.**

1. 기존/별도 kkumeme worktree를 4a1056f로 준비하고 그 worktree에서 `pnpm build`하여 CSS를 확보합니다. 촬영 스크립트는 브랜치를 바꾸지 않으며 SHA가 다르면 중단합니다.
2. devrocket-media의 이 브랜치/폴더에서 아래 실행:

```bash
node src/tools/prepare.cjs /path/to/kkumeme-at-4a1056f
node src/tools/check.cjs
node src/tools/capture.cjs
node src/render.cjs
```

Playwright가 일반 모듈 탐색 경로에 없으면 이미 설치된 모듈의 절대 경로를 PLAYWRIGHT_MODULE 환경변수로 지정합니다. 새 설치는 하지 않습니다.

prepare가 kkumeme에 만든 임시 `.ad-sticker-*` 엔트리 폴더는 번들 성공/실패의 finally에서 지웁니다. 해당 worktree에 untracked 촬영 파일이 남지 않았는지 마지막에 git status로 확인하세요. 생성 번들/이미지/프레임은 devrocket-media의 이 폴더 안 `src/work`, `src/recordings`, `src/frames`에만 남습니다.

### 실제 UI take
- 촬영 뷰포트390×826, DPR2, hasTouch:true, isMobile:true. 편집기/지퍼백/우표를 캡처합니다. 합성에서는 같은 비율의 폰 화면에 담습니다.
- 생성+지퍼백: 총180프레임을 연속 캡처해 2~8초에 배치. 실제 비동기 이미지 디코딩에 따라 연출 타이밍이 달라질 수 있으므로 결과 드러남/날아듦/지퍼 닫힘이 각 자막 구간에 맞는지 반드시 확인하세요. 필요하면 **촬영 take의 컷 지점만** 조정하고 앱 로직은 바꾸지 않습니다.
- 붙이기: 실제 지퍼백에서 3개를 꺼내고 첫 스티커의 se 크기 핸들·회전 핸들을 조작합니다. 소스 take가 길어져도 합성에서3초로 압축합니다. 장면 감각이 너무 빠르면 3개 중 손 조작 시간을 줄이거나 컷 편집으로 조정하되 실제 성공 장면을 남기세요.
- 우표: 앨범 소재를 준비한 뒤 오려내기를 눌러60프레임.
- 공개: 120프레임. **위 왼쪽 모서리 띠→아래 오른쪽 모서리 밖**으로 끌어 화면 왼쪽 이탈을 피했습니다. 완전 분리 class가 없으면 실패 처리합니다. 이후 다른 위치로 이동하고 touchEnd. 손가락·출발점·끝점·재부착 위치를 capture.json에 기록합니다.
- DOM의 lifted 확인은 제스처 오작동을 조기에 잡는 가드일 뿐입니다. **실제 뒷면·완전 분리·재부착 판정은 캡처/영상으로 하세요.**

### 렌더 후 검수
7컷 board 및 실제 영상 전체 재생을 확인합니다. 특히 원본/스티커 동일 고양이, 흰 테두리, 스캔 결과/지퍼백 타이밍·개수2→3, 3개 붙이기·크기/회전, 우표 톱니, 손가락 화면 이탈 없음·다른 자리에 재부착을 확인하세요. 한글 글리프·캡션·모달/폰 목업 잘림도 봅니다.

MP4 인코딩은 `-an -c:v libx264 -pix_fmt yuv420p -crf 18 -preset slow -movflags +faststart`. 1080×1920·30/1 fps·600프레임·20초 이내·오디오 없음은 ffprobe로 검사합니다. 성공 메타데이터는 화면 승인과 다릅니다. 검수 후 MP4/board와 필요한 src/recordings를 이 폴더에 추가하고 상태를 갱신하세요.

## 현재 검증
| 항목 | 결과 |
|---|---|
| 기준15초/떼기 참고 자료·4a1056f 코드/AGENTS 읽기 | 완료 |
| JS/CJS 구문 | 통과 |
| 모의 DOM600시점·7개 seek·프레임 인덱스 범위·CDP 계약 | 통과 |
| API mock 단독 검사(개수2→3·PNG 응답·외부호스트/게시 차단) | 통과, 실제 브라우저 연결 검증 아님 |
| Chromium launch | 실행 파일 없음으로 실패 |
| 실제 앱 번들·TS typecheck·실제 API mock 연결 | **미실행** |
| 실제 UI capture·영상·board | **미실행** |
| 고양이 오프라인 오리기 | **원본 미첨부로 미실행** |
| 화면·실기기·타이밍·손가락 동선 | **미확인** |

원본 미첨부와 브라우저 부재를 숨기지 않고 소스 초안으로 제출합니다.

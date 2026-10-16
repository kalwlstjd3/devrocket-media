# 꾸밈 광고 — 15초 기본안 (2026-10-16)

- 최종본: `kkume-ad-15s.mp4` — 1080×1920, 30fps, 15초, 무음(스레드 업로드 시 앱에서 음악 추가)
- 스토리보드: `board.png`
- 제작: LLM클코. CEO 확인 2026-10-16

## 구성
| 시간 | 장면 | 방식 |
|---|---|---|
| 0–2.4s | 로고 스티커 + 「내 마음대로 / 꾸미고 공유하기」 | 모션(HTML) |
| 2.4–6.0s | 폰 화면에 사진·스티커·손글씨가 붙음 「사진·스티커·글을 손으로 툭툭」 | 모션 |
| 6.0–11.0s | 실제 「우표 만들기」 화면(PR #84) 「사진을 우표로 오려 붙이고」 | 실제 UI 녹화 |
| 11.0–13.3s | 완성 페이지 + 주소 칩 `https://내아이디.kkume.me` 「내 주소로 바로 공유」 | 모션 |
| 13.3–15s | 로고 + kkume.me + 「지금 꾸며 보기」 | 모션 |

## 소스 (`src/`)
- `index.html`: 장면 전체. `window.render(t)` 로 t초 화면을 그린다(결정적). 540×960 CSS, deviceScaleFactor 2 → 1080×1920
- `render.cjs`: 450프레임 PNG 캡처(Playwright). `board.cjs`: 정지 컷
- 인코딩: `ffmpeg -framerate 30 -i frames/f%03d.png -c:v libx264 -pix_fmt yuv420p -crf 18 -preset slow -movflags +faststart out.mp4`
- `rec-stamp-maker.mp4`: 6–11초 실제 UI 원본(150프레임). index.html 은 `rf5/fNNN.png` 를 읽으므로 다시 만들 때 `ffmpeg -i rec-stamp-maker.mp4 rf5/f%03d.png` 로 풀어서 쓴다
- `tools/frames.cjs` + `tools/entry.tsx`: 실제 UI 녹화 방법. kkumeme 레포에서 StampMaker 를 esbuild 로 단독 번들(빌드 CSS 사용) → Playwright `clock.install()` + `clock.pauseAt()` 로 시간을 멈추고 프레임마다 `runFor(33.3)` 후 스크린샷(rAF 연출을 정확히 30fps 로 담기 위함. 녹화(recordVideo)는 CSS 해상도로만 찍혀 쓰지 않음)
- 글꼴: kkumeme `app/fonts.css` + `public/fonts/`(검은고딕·개구체, OFL) 를 서버 루트 `/fonts/` 로 둔다. 개구체에 없는 기호(✿ 등)는 쓰지 말 것
- 그림: `photo.jpg`(바다 노을)·하트·별·꽃 스티커는 LLM클코가 직접 그린 것. `stamp.png` 는 photo.jpg 로 실제 우표 렌더러가 만든 것. 로고·아이콘은 `kkumeme/brand/`

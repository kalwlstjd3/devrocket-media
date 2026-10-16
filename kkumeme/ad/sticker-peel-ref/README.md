# 스티커 떼기 장면 캡처 참고 (2026-10-16, LLM클코)

공개 페이지 떼기 연출(`enableStickerPeel`)을 헤드리스로 30fps 캡처한 시험. 결과: `peel-test.mp4`, `peel-test-strip.png`.

## 방법
1. `entry.tsx` 를 kkumeme 레포 안(예: `.adpeel/entry.tsx`)에 두고 esbuild 로 번들:
   `node_modules/.pnpm/esbuild@0.27.3/node_modules/esbuild/bin/esbuild .adpeel/entry.tsx --bundle --format=esm --jsx=automatic --alias:@=. --loader:.css=css --define:process.env.NODE_ENV='"production"' --banner:js='var process={env:{}};' --outfile=<작업폴더>/bundle.js`
   (번들 후 `.adpeel` 은 지운다. 레포에 커밋하지 않음)
2. CSS: kkumeme `pnpm build` 결과 `dist/client/_next/static/css/index.*.css` + `page-view.*.css` 를 이어 `app.css` 로
3. 스티커 이미지는 `/api/assets/<uuid>` 경로로 서빙해야 사진형 스티커로 그려진다(`isImageElement`). 예: `<작업폴더>/api/assets/1111...` 파일
4. `python3 -m http.server 8767` 로 작업폴더 서빙 → `peel.cjs <출력폴더>`
   - 390×693, deviceScaleFactor 1080/390, hasTouch·isMobile
   - `clock.install()` + `pauseAt` 후 프레임마다 `runFor(33.3)` → 스크린샷
   - 터치는 CDP `Input.dispatchTouchEvent`(마우스로는 판정이 다름). `#finger` 는 손가락 표시용 오버레이
5. 떼어 내려면 모서리(짧은 변 30% 띠 안)에서 시작해 반대편 모서리 **밖**까지 끌어야 한다(앞면 14% 미만). 덜 끌면 제자리로 돌아간다

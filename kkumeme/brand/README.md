# 꾸밈 브랜드 에셋 — 눈 스티커 B

2026-10-08 승인된 B 시안(눈 두 개, 노랑·보라, 오른쪽 아래가 들린 스티커)을 바탕으로 재구성한 벡터 제작본입니다. 생성 시안의 픽셀을 추출한 파일이 아니므로 곡선·글자·그림자는 원 시안과 미세하게 다릅니다. 앱 저장소 적용·배포는 하지 않았습니다.

## 파일

| 파일 | 용도 |
|---|---|
| `icon.svg` | 아이콘 벡터 원본, 투명 배경, 그라데이션 id `kkume-icon-yellow` / `kkume-icon-paper` |
| `logo-horizontal.svg` | 홈 상단용 아이콘 + 꾸밈 워드마크, 투명 배경, id `kkume-logo-yellow` / `kkume-logo-paper` |
| `logo-horizontal.png` | 동일 로고 1040×360 투명 PNG |
| `icon-512.png`, `icon-192.png` | 512×512 / 192×192 투명 PNG |
| `favicon.svg` | 기존 단색 아이콘, 그림자 없음, 사용하지 않는 그라데이션 정의 제거 |
| `icon-16.svg`, `icon-16.png` | 16px 전용 도안·투명 PNG: 흰 테두리·종이 뒷면 없음, 주 윤곽선 2px, 눈 각 1×2px, 정수 픽셀 좌표 |
| `icon-32.png`, `icon-48.png` | 기존 작은 크기용 투명 PNG, 기준 커밋 c0776d5와 바이트 동일 |
| `favicon.ico` | 전용 16px + 기존 32/48px PNG 프레임. 32/48 프레임 바이트 유지 |
| `apple-touch-icon.png` | 180×180 크림색 불투명 배경, 144×144 아이콘을 중앙에 배치(사방 18px 여백) |
| `preview.png` | 아이콘·로고·Apple 아이콘 및 픽셀 비교 미리보기 |
| `icon-size-comparison-8x.png` | 16/32/48px을 밝은 배경·어두운 배경 위에서 각각 최근접 보간으로 8배 확대한 비교 |

워드마크는 직접 작성한 SVG 경로이며 `<text>`·외부 글꼴·외부 이미지 참조가 없습니다. SVG의 `aria-label`은 아이콘 「꾸밈 스티커 아이콘」, 로고 「꾸밈」입니다. HTML `<img>`로 사용할 때에는 별도로 `alt="꾸밈"`을 지정하세요.

## 색

- 보라: `#493165`
- 16px 및 작은 아이콘 노랑: `#FFE483`
- 큰 아이콘 노랑: `#FFED9B` → `#FFDE73`
- 종이 뒷면: 흰색 → `#FFF6E3`
- 홈 화면 배경: `#FFF9EE`
- 픽셀 비교 배경: 밝음 `#FFF9EE` / 어두움 `#202124`

16px 도안은 완전 투명·보라·노랑 세 가지 RGBA 값만 사용합니다. 나머지 아이콘의 형태·색·워드마크는 유지했습니다.

## 사용 예

```html
<link rel="icon" href="/favicon.ico" sizes="16x16 32x32 48x48">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<img src="/logo-horizontal.svg" alt="꾸밈" width="208" height="72">
```

위 예는 16px 전용 도안을 포함한 ICO를 사용합니다. 일반 `favicon.svg` 링크를 함께 등록하면 브라우저가 SVG를 우선해 전용 16px 대신 기존 벡터 도안을 축소할 수 있습니다. 전용 SVG를 16px로 직접 쓸 때에는 `icon-16.svg`를 사용하세요.

512/192 PNG는 투명 배경 일반 아이콘입니다. Android maskable icon으로 검증한 파일은 아니므로 manifest에서 `purpose: "any"`로 사용하세요.

## 확인

SVG 렌더링과 파일별 id 중복 없음, favicon.svg의 미사용 정의 제거, 16px 픽셀 색·정수 경계, PNG 크기·알파 채널, ICO 16px 교체와 32/48px 프레임 바이트 유지, Apple 아이콘의 18px 배치 여백을 확인했습니다. 비교 이미지는 각 원래 크기에서 배경 합성 후 최근접 보간으로 8배 확대했습니다. 실브라우저 파비콘 캐시·iOS 홈 화면·앱 상단 적용은 별도 확인이 필요합니다. 꾸밈 앱 적용·배포는 하지 않았습니다.

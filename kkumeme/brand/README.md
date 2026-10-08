# 꾸밈 브랜드 에셋 — 눈 스티커 B

2026-10-08 승인된 B 시안(눈 두 개, 노랑·보라, 오른쪽 아래가 들린 스티커)을 바탕으로 재구성한 벡터 제작본입니다. 생성 시안의 픽셀을 추출한 파일이 아니므로 곡선·글자·그림자는 원 시안과 미세하게 다릅니다. 앱 저장소 적용·배포는 하지 않았습니다.

## 파일

| 파일 | 용도 |
|---|---|
| `icon.svg` | 아이콘 벡터 원본, 투명 배경, 은은한 노랑 그라데이션·짧은 그림자 |
| `logo-horizontal.svg` | 홈 상단용 아이콘 + 꾸밈 워드마크, 투명 배경 |
| `logo-horizontal.png` | 동일 로고 1040×360 투명 PNG |
| `icon-512.png`, `icon-192.png` | 512×512 / 192×192 투명 PNG |
| `favicon.svg` | 작은 크기용 단색 아이콘, 그림자 제거 |
| `icon-16.png`, `icon-32.png`, `icon-48.png` | 작은 크기용 투명 PNG |
| `favicon.ico` | PNG 프레임 16/32/48px을 담은 ICO |
| `apple-touch-icon.png` | 180×180, 크림색 불투명 배경 |
| `preview.png` | 아이콘·로고·축소 아이콘 비교 미리보기 |

워드마크는 직접 작성한 SVG 경로이며 `<text>`·외부 글꼴·외부 이미지 참조가 없습니다. SVG의 `aria-label`은 아이콘 「꾸밈 스티커 아이콘」, 로고 「꾸밈」입니다. HTML `<img>`로 사용할 때에는 별도로 `alt="꾸밈"`을 지정하세요.

## 색

- 보라: `#493165`
- 작은 아이콘 노랑: `#FFE483`
- 큰 아이콘 노랑: `#FFED9B` → `#FFDE73`
- 종이 뒷면: 흰색 → `#FFF6E3`
- 홈 화면 배경: `#FFF9EE`

## 사용 예

```html
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="icon" href="/favicon.ico" sizes="16x16 32x32 48x48">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<img src="/logo-horizontal.svg" alt="꾸밈" width="208" height="72">
```

512/192 PNG는 투명 배경 일반 아이콘입니다. Android maskable icon으로 검증한 파일은 아니므로 manifest에서 `purpose: "any"`로 사용하세요.

## 확인

SVG 렌더링, PNG 크기·알파 채널, ICO 프레임·길이, 워드마크 잘림 여부를 확인했습니다. 실브라우저 파비콘 캐시·iOS 홈 화면·앱 상단 적용은 별도 확인이 필요합니다.

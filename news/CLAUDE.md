# news/CLAUDE.md

이 파일은 뉴스(최근뉴스 조회 + TTS 브리핑) 기능을 다룰 때 참고하는 세부 규칙이다. 프로젝트 전체 공통 규칙(보안 등)은 루트 `CLAUDE.md`를 따르며, 여기서는 반복하지 않는다.

> 2026-07-24 React/Vite/Tailwind/shadcn 마이그레이션으로 뉴스 기능의 실제 구현 코드는 `src/features/news/`로 이동했다. 이 폴더(`news/`)에는 이제 문서(`CLAUDE.md`, `prd.md`)만 남아 있으며, 과거처럼 `news.js`/`news.css` 두 파일만 두는 구조가 아니다.

## 담당 범위

`src/features/news/`는 알람 앱의 "최근뉴스" 조회 및 TTS(음성) 브리핑 기능만 담당한다.

## 파일 구조 규칙

`src/features/news/` 아래에 책임별로 다음과 같이 나눈다. 새 파일을 추가할 때도 이 책임 구분을 따른다.

- `lib/news-api.ts` — 데이터 조회(`fetchXxx`)
- `lib/news-format.ts` — 순수 변환 함수(`buildXxx`, `stripXxx`)
- `lib/tts.ts` — TTS 재생/중지
- `components/*.tsx` — 화면 렌더링 (React 컴포넌트가 기존 `renderXxx` DOM 함수의 역할을 대체한다)
- `hooks/*.ts` — 조회 상태(로딩 등) 관리
- `types.ts` — 뉴스 아이템/응답 타입

## 함수 이름 규칙

- 데이터를 가져오는 함수: `fetchXxx` (예: `fetchRecentNews`)
- 순수 변환 함수(입출력만 있고 부수효과 없음): `buildXxx`, `stripXxx`
- 화면에 그리는 책임은 함수가 아니라 `components/`의 React 컴포넌트가 담당한다(기존 `renderXxx` 규칙은 컴포넌트 이름으로 대체됨).

## 함수 시그니처 규칙

> 과거 버전에는 `최근뉴스_기술명세서.md`의 예시 코드(`fetchNews()`, `readNews(text)`)를 시그니처 기준으로 삼는다고 적혀 있었으나, 실제 구현은 처음부터 그 예시와 다른 이름·파라미터로 작성되어 있었다(`fetchRecentNews(keyword, count)`, `speakBriefing(text)`/`stopBriefing()`). 이번 마이그레이션에서 문서를 실제 코드에 맞춰 정정한다.

- `fetchRecentNews(keyword, count = 5)`: 검색 키워드와 개수를 받아 뉴스 배열을 반환한다.
- `speakBriefing(text)`: `SpeechSynthesisUtterance`의 `lang`을 `'ko-KR'`로 고정해 읽어준다.
- `stopBriefing()`: 진행 중인 TTS를 중지한다.
- 새 함수를 추가해야 할 경우, 이름/파라미터를 임의로 확정하지 말고 사용자에게 먼저 확인한다.

## alarm 기능과의 경계

- `src/features/alarm/`(알람 로직)는 `src/features/news/`의 함수를 호출만 하고, 뉴스 조회·렌더링·TTS 관련 로직을 직접 작성하지 않는다.
- 뉴스 관련 로직이 필요하면 `src/features/news/`에 함수를 추가하고, `src/features/alarm/`에서는 해당 함수를 호출하는 코드만 작성한다.

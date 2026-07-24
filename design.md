# design.md — UI/기술 스택 마이그레이션 (React + Tailwind + shadcn/ui)

이 문서는 2026-07-24 진행한 프론트엔드 마이그레이션의 설계 결정을 기록한다. 기존 순수 HTML/CSS/바닐라 JS 정적 사이트를 React + Vite + TypeScript + Tailwind CSS + shadcn/ui 구조로 전면 전환했다.

## 1. 기술 스택

| 항목 | 선택 |
|---|---|
| 프레임워크 | React 19 + Vite 8 (TypeScript) |
| 스타일링 | Tailwind CSS v4 (`@tailwindcss/vite` 플러그인, `tailwind.config.js` 불필요) |
| 컴포넌트 | shadcn/ui (`shadcn` CLI, Radix 기반, Nova 프리셋) |
| 아이콘 | lucide-react |
| 상태/데이터 | React state + 커스텀 훅 (전역 상태 라이브러리 없음), `localStorage` 지속성 유지 |

기존 정적 파일(`index.html`, `script.js`, `style.css`, `news/news.js`, `news/news.css`, `config.js`)은 `src/` 아래 React 컴포넌트/훅으로 포팅 후 삭제했다.

## 2. 테마 — 블루톤 다크모드 기본 + 라이트 토글

- **기본값은 다크모드**다. 최초 진입 시 별도 설정이 없으면 다크 테마로 렌더링된다.
- 라이트모드는 헤더의 토글 버튼(해/달 아이콘)으로 전환 가능하며, 선택한 테마는 `localStorage`(`simple-alarm.theme`)에 저장되어 다음 방문 시에도 유지된다.
- shadcn 테마 변수는 **OKLCH** 색공간을 사용한다(HSL 아님, shadcn 최신 기본값). 기존 앱의 브랜드 블루(`#4f7cff`)를 OKLCH로 변환해 `--primary`에 그대로 매핑, 톤을 유지했다.

### 색상 토큰

| 토큰 | 다크(기본) | 라이트 |
|---|---|---|
| `--background` | `oklch(0.200 0.009 264.4)` | `oklch(0.970 0.003 264.5)` |
| `--foreground` | `oklch(0.964 0.003 264.5)` | `oklch(0.234 0.007 258.4)` |
| `--card` | `oklch(0.252 0.014 267.0)` | `oklch(1 0 0)` |
| `--primary` | `oklch(0.625 0.201 266.3)` (≈`#4f7cff`) | `oklch(0.544 0.196 266.2)` (≈`#3a63e0`) |
| `--border` / `--muted` | `oklch(0.309 0.019 268.1)` | `oklch(0.928 0.006 264.5)` |
| `--destructive` | `oklch(0.630 0.179 33.0)` (≈`#e0553a`) | 동일 |

전체 정의는 `src/index.css`의 `:root`(라이트)/`.dark`(다크, 기본값) 블록 참고.

### 구현

- `src/components/theme-provider.tsx`: shadcn 공식 Vite 다크모드 패턴 그대로, `defaultTheme="dark"`로 다크를 기본값으로 고정. `next-themes` 등 외부 패키지 의존성 없음.
- `src/components/mode-toggle.tsx`: 라이트/다크 2단 토글(별도 "system" 옵션 없음).

## 3. 컴포넌트 매핑

| 기존 요소 | shadcn/ui 컴포넌트 | 선택 이유 |
|---|---|---|
| 시간/라벨 입력 | `Input` | 1:1 대체 |
| 일월화수목금토 반복 선택 | `ToggleGroup` (`type="multiple"`) | Radix의 roving-tabindex 키보드 내비게이션과 `aria-pressed`를 기본 제공하며, 기존 `Set<number>` 모델과 `string[]` 경계 변환만으로 매핑 가능 |
| 알람 활성화 스위치 | `Switch` | 1:1 대체 |
| 알람 추가/뉴스조회 버튼 | `Button` | 1:1 대체 |
| 알람 삭제 버튼 | `Button` (`variant="ghost" size="icon"`) + lucide `Trash2` | |
| **알람 울림 오버레이** | **`AlertDialog`** (`Dialog` 아님) | 프로그래밍적으로(사용자 클릭 없이) 열려야 하고, 반드시 "끄기"/"스누즈" 중 하나를 눌러야만 닫혀야 한다. `Dialog`는 기본적으로 닫기(X) 버튼과 바깥 클릭/Escape 닫힘을 제공해 이를 막으려면 별도 오버라이드가 필요하지만, `AlertDialog`는 애초에 바깥 클릭으로 닫히지 않도록 설계되어 있다. Escape 키만 `onEscapeKeyDown`에서 명시적으로 `preventDefault()` 처리해 완전히 봉쇄했다. |
| 뉴스 카드 목록 | `Card` | |

## 4. 폴더 구조

```
src/
  main.tsx, App.tsx, index.css
  components/
    ui/                     # shadcn 생성 프리미티브(button, input, switch, toggle-group, alert-dialog, card, badge, dropdown-menu 등)
    theme-provider.tsx
    mode-toggle.tsx
  config/
    env.ts                  # Supabase 함수 URL/anon key (VITE_ 환경변수, 없으면 기존 커밋값 fallback)
  features/
    alarm/
      components/           # AlarmForm, RepeatDayToggle, AlarmList/AlarmListItem, RingingOverlay
      hooks/                 # useAlarms(로컬스토리지 CRUD), useBeep(오디오), useAlarmClock(1초 tick/트리거), useAlarmApp(조합)
      lib/alarm-utils.ts
      types.ts
    news/
      components/            # NewsSection, NewsCard, NewsBriefing
      hooks/useNews.ts
      lib/news-api.ts, news-format.ts, tts.ts
      types.ts
    weather/
      components/WeatherFooter.tsx
      hooks/useWeather.ts
      lib/weather-api.ts
public/
  images/                    # 기존 images/ 이동, `/images/...` 경로로 참조
```

## 5. 실패 허용 원칙 구현 (알람 소리 vs 뉴스 브리핑)

`useAlarmClock` 훅은 `setInterval`을 마운트 시 한 번만 생성하고(빈 deps), `alarms`/콜백은 ref로만 참조해 알람 추가/삭제 때마다 인터벌이 재생성되지 않는다. 알람이 울릴 시점에 실행되는 `handleDue` 콜백은 **`startBeep()`을 다른 어떤 비동기 작업(뉴스 조회 등)도 거치지 않고 인터벌 콜백 안에서 동기적으로 가장 먼저 호출**한다. 뉴스 브리핑 조회(`playNewsBriefing`)는 그 뒤에 `void`로 fire-and-forget 호출되며 자체 `try/catch`로 감싸, 뉴스 API가 실패하거나 느려도 알람 소리 재생에는 전혀 영향을 주지 않는다.

## 6. 기타 결정 사항

- **개발 서버 포트를 8080으로 고정**(`vite.config.ts`의 `server.port`). Supabase Edge Function(`supabase/functions/naver-news/index.ts`)의 CORS 허용 목록에 이미 `http://localhost:8080`이 등록되어 있어, 별도 재배포 없이 로컬 개발 시 뉴스 API를 그대로 호출할 수 있다.
- **`config.js` → `src/config/env.ts`**: `SUPABASE_NEWS_FUNCTION_URL`/`SUPABASE_ANON_KEY`는 `VITE_` 환경변수로 오버라이드 가능하되, 기존에 커밋되어 있던 값을 기본값(fallback)으로 두어 `.env` 설정 없이도 기존과 동일하게 동작한다. 두 값은 루트 `CLAUDE.md`의 "네이버 API 키 프론트엔드 금지" 규칙 대상이 아니다(Supabase 설계상 클라이언트에 공개되어도 되는 값).
- **`news/CLAUDE.md` 갱신**: 뉴스 구현 코드가 `news/` 폴더에서 `src/features/news/`로 이동함에 따라 파일-구조 규칙을 재작성했다. 기존 규칙의 의도(뉴스 로직과 알람 로직 분리, `fetchXxx`/`buildXxx`/`stripXxx` 네이밍)는 그대로 유지된다.
- **뉴스 API 실패 시 표시 문구는 결정하지 않음**: `news/prd.md`의 Open Questions에 "뉴스 조회 실패 시 어떤 문구를 보여줄지 미확정"이라고 명시되어 있어, 이번 마이그레이션에서도 실패 시 별도 안내 문구를 추가하지 않고 로딩 상태만 해제하도록 구현했다. 문구 확정이 필요하면 별도로 논의한다.

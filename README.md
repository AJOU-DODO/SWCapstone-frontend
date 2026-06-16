# TEAM DODO

SW 캡스톤디자인 1조 TEAM DODO

## 👥 Team Members

|                          프로필                          |       이름        |     담당     |                        이메일                         |                    GitHub                    |
| :------------------------------------------------------: | :---------------: | :----------: | :---------------------------------------------------: | :------------------------------------------: |
| <img src="https://github.com/kando0330.png" width="80">  | **한도훈** (팀장) | infra&server |    [gks9315@ajou.ac.kr](mailto:gks9315@ajou.ac.kr)    |  [@kando0330](https://github.com/kando0330)  |
|  <img src="https://github.com/defhoon.png" width="80">   |    **정의훈**     |   frontend   | [twilight22@ajou.ac.kr](mailto:twilight22@ajou.ac.kr) |    [@defhoon](https://github.com/defhoon)    |
| <img src="https://github.com/apdlwjwjwj.png" width="80"> |    **채승우**     | android app  | [apdlwjwjwj@ajou.ac.kr](mailto:apdlwjwjwj@ajou.ac.kr) | [@apdlwjwjwj](https://github.com/apdlwjwjwj) |
| <img src="https://github.com/Rain-fore.png" width="80">  |    **최환희**     |   frontend   | [choihh2660@ajou.ac.kr](mailto:choihh2660@ajou.ac.kr) |  [@Rain-fore](https://github.com/Rain-fore)  |

## 상세 소개

본 레포지토리는 **DODO JOURNEY**의 프론트엔드 소스코드를 포함하고 있으며, 사용자용 모바일 웹뷰와 비즈니스/운영을 위한 웹 서비스가 메인 서비스 레이어로 분리되어 구축되어 있습니다.

<details>
<summary><b> 1. 유저 서비스 (모바일 웹뷰 환경)</b></summary>
  
안드로이드 앱 내에서 유저가 실제로 마주하는 서비스 화면을 담당합니다.
- **둥지 확인 & 목록**: 내 주변 장소에 심어진 익명의 이야기(둥지)들을 확인하고 탐험합니다.
- **둥지 작성**: 내가 머문 장소에 나만의 감성적인 기록(둥지)을 남깁니다.
- **카테고리 선택**: 내 취향에 맞는 장소와 이야기만 필터링하여 탐험할 수 있습니다.
- **마이페이지**: 내가 찾은 둥지, 내가 쓴 엽서 및 이모지 리액션 내역을 관리합니다.
</details>

<details>
<summary><b> 2. 광고주 웹 서비스</b></summary>

웹 로그인을 통해 '광고주' 권한을 가진 유저가 진입하여 사용하는 비즈니스 대시보드입니다.
- **광고 신청**: 특정 로격/장소 기반으로 유저들에게 노출할 광고를 신청합니다.
- **내 광고 관리**: 현재 집행 중인 광고의 상태와 승인 여부를 실시간으로 모니터링합니다.
</details>

<details>
<summary><b> 3. 관리자 플랫폼</b></summary>
  
웹 로그인을 통해 '관리자' 권한을 가진 운영자가 진입하는 통합 백오피스입니다.
- **운영 관리**: 전체 유저 상태 조회, 생성된 전체 둥지 모니터링 및 신고 내역을 관리합니다.
- **비즈니스 관리**: 광고주 승인/거절 및 집행 중인 광고 데이터를 관리합니다.
- **통계 대시보드**: 로컬 활성 데이터, 신고 발생 추이 등 서비스 전체 통계를 직관적으로 확인합니다.
</details>


## 핵심 기술 스택

| 분류 | 기술 및 프레임워크 (Tech Stack) |
| :--- | :--- |
| **Framework** | Next.js 15, React 19 |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS, shadcn/ui |
| **State Management** | Zustand, TanStack Query (React Query) |
| **HTTP Client** | Axios, Fetch API |
| **Infrastructure** | Vercel |
| **DevOps** | GitHub Actions |
| **Testing** | Vitest, Testing Library, Storybook, Chromatic |
| **Bridge** | Android WebView Bridge |

## Repository 구조

```
src/
├── 📂 app                        # Next.js App Router 페이지
│   ├── 📂 (webview)              # 웹뷰 전용 페이지 (Android 앱 내 렌더링)
│   │   ├── 📂 nests              # 둥지 목록, 상세, 작성, 수정
│   │   ├── 📂 category           # 관심 카테고리 설정
│   │   └── 📂 mypage             # 마이페이지 (엽서함 등)
│   ├── 📂 admin                  # 어드민 관리자 페이지
│   │   ├── 📂 login              # 로그인 및 OAuth 콜백
│   │   ├── 📂 users              # 유저 관리
│   │   ├── 📂 stats              # 통계 확인
│   │   └── 📂 advertise          # 광고 심사
│   └── 📂 advertiser             # 광고주 전용 대시보드
│       └── 📂 proposals          # 광고 신청 및 수정
│
├── 📂 components                 # 재사용 컴포넌트
│   ├── 📂 webview                # 웹뷰 전용 컴포넌트
│   │   └── 📂 nest-detail        # 둥지 상세 관련 (댓글, 이미지 슬라이더 등)
│   ├── 📂 admin                  # 어드민 전용 컴포넌트
│   │   ├── 📂 layout             # 헤더, 네비게이션, 로그아웃 버튼
│   │   └── 📂 stats              # 통계 카드, 차트
│   ├── 📂 advertiser             # 광고주 전용 컴포넌트
│   │   └── 📂 layout             # 광고주 네비게이션 바
│   └── 📂 ui                     # shadcn/ui 공통 컴포넌트
│
├── 📂 lib                        # 유틸리티 및 설정
│   ├── 📂 store                  # Zustand 전역 상태관리 (nestEditorStore 등)
│   ├── 📂 hooks                  # 커스텀 훅 (useBridge 등)
│   ├── 📂 adminApi               # 어드민 API 함수
│   ├── 📄 api.ts                 # 웹뷰 fetch 기반 API 함수
│   ├── 📄 axios.ts               # axios 인스턴스 및 토큰 인터셉터
│   └── 📄 apiAdvertiser.ts       # 광고주 API 함수
│
├── 📂 types                      # TypeScript 타입 정의
│   ├── 📄 index.ts               # 웹뷰 공통 타입
│   ├── 📄 indexAdmin.ts          # 어드민 타입
│   ├── 📄 indexAdvertiser.ts     # 광고주 타입
│   └── 📄 bridge.d.ts            # AndroidBridge 인터페이스 타입
│
└── 📂 utils                      # 유틸리티 함수
    └── 📄 formatters.ts          # 날짜/좌표 포맷 함수
```

## 빌드 방법
프로젝트를 로컬 환경에서 처음 구동하거나 테스트할 때 아래의 순서대로 세팅을 진행합니다.

1. 의존성 라이브러리 설치
npm install

2. 환경 설정 파일 준비 (`.env.local`)

보안 및 API Key 유출 방지를 위해 `.gitignore` 처리된 환경 변수 파일을 프로젝트 루트 디렉토리에 직접 생성해야 합니다.

**파일 위치:** 프로젝트 최상위 루트 폴더

아래와 같이 백엔드 서버 주소 및 카카오 지도 API 키를 기입합니다.

```properties
NEXT_PUBLIC_SERVER_URL=백엔드 API 실서버 주소
NEXT_PUBLIC_SERVER_IP=백엔드 API 실서버 주소(위와 동일)
NEXT_PUBLIC_KAKAO_MAP_KEY=카카오 개발자 콘솔에서 발급받은 JavaScript 키
```

> ⚠️ **카카오맵 API 사용 전 필수 설정**
>
> 카카오 개발자 콘솔에서 JavaScript 키 발급 후 반드시 아래 설정을 확인하세요.
> 1. [카카오 개발자 콘솔](https://developers.kakao.com) → 내 애플리케이션 → 해당 앱 선택
> 2. **앱 설정 → 카카오맵 → 상태를 ON으로 변경**
> 3. **플랫폼 → Web → 사이트 도메인에 `http://localhost:3000` 추가**
>
> 위 설정을 누락하면 403 Forbidden 또는 카카오맵 API 호출 에러가 발생합니다.

3. 로컬 개발 서버 실행 (Default: http://localhost:3000)
```bash
npm run dev
```

4. 테스트 및 스토리북 실행 (선택)
```bash
npm run test:run      # Vitest 실행
npm run storybook     # Storybook 로컬 실행
```

## Frontend Testing Policy (프론트엔드 테스트 정책)

<details>
<summary><b> 테스트 핵심 원칙</b></summary>
1. **역할의 철저한 분리**: 화면(UI 스타일) 검증과 기능(비즈니스 로직) 검증을 분리하여 테스트 코드 유지보수 비용을 최소화합니다.
2. **자동화 검증 필수**: 작성된 모든 테스트는 로컬 환경에만 머무르지 않고, **GitHub Actions(CI)** 파이프라인과 연동되어 성공 지표를 달성해야만 브랜치 머지(Merge)가 가능합니다.

---

### 레이어별 검증 범위 및 담당 도구

| 테스트 종류 | 담당 도구 | 테스트 대상 및 범위 (What to test) | 품질 관리 기준 |
| :--- | :--- | :--- | :--- |
| **단위 테스트**<br>(Unit Test) | **Vitest** | • UI와 연결되지 않은 **순수 비즈니스 로직**<br>• 어드민 API 데이터 가공 및 정렬/필터링 함수<br>• 공통 유틸리티 함수 (토큰 파싱, 날짜 포맷팅 등) | 핵심 실패 케이스<br>(Edge Case)<br>**통과율 100%** |
| **인터랙션 테스트**<br>(Component Test) | **Storybook**<br>*(Play 함수)* | • 컴포넌트 단위의 **사용자 행동 시나리오 검증**<br>• 어드민 주요 기능 (둥지 관리 페이지네이션, 공지사항 체크박스 다중 선택 및 테이블 렌더링 등) | 핵심 유저 시나리오<br>**성공률 100%** |
| **시각적 회귀 테스트**<br>(Visual Test) | **Chromatic** | • 브라우저 픽셀 레벨에서의 **디자인/스타일 깨짐 검증**<br>• 페이지 수정 시 발생 가능한 CSS 사이드 이펙트 차단 | 매 PR 빌드 시<br>**팀원 전원 승인<br> 필수** |

---

### 🛑 Do & Don't

#### ❌ 이것은 테스트하지 않습니다 (Don't)
- **외부 라이브러리 자체 기능**: `Shadcn UI`나 `Radix UI` 등 검증된 라이브러리 자체의 내장 스타일 및 동작은 신뢰하고 테스트 대상에서 제외합니다.
- **순수 정적 컴포넌트**: 단순 마크업만 존재하는 UI(고정 아이콘, 단순 텍스트 레이블 등)는 단위 테스트를 생략하고 스토리북 등록으로 대체합니다.

#### ⭕ 이것은 반드시 테스트합니다 (Do)
- **권한 및 보안 분기**: 유저 등급/권한에 따른 메뉴 노출 및 접근 제어 로직은 `Vitest`로 철저하게 검증합니다.
- **복잡한 상태 구조**: 테이블 페이징, 다중 조건 필터링 등 상태(State)가 복잡하게 얽혀 문제가 발생하기 쉬운 UI 코어는 `Storybook Interaction`으로 테스트 시나리오를 작성해 방어합니다.
- **Next.js Production Build 검증**: 로컬 개발 환경(`npm run dev`)에서는 누락되기 쉬운 타입 체크, 린트 및 빌드 오류를 배포 전 단계에서 완벽하게 솎아냅니다.
</details>

## CI/CD
<details>
<summary>본 프로젝트는 GitHub Actions와 Vercel을 활용하여 자동화된 CI/CD 프로세스를 따릅니다.</summary>

1. **CI (Continuous Integration)**
   - `develop` 브랜치에 코드 푸시 및 PR 생성 시, GitHub Actions 워크플로우가 트리거됩니다.
   - **Next.js Production Build** 검증을 수행하여, 개발 환경에서 잡지 못한 오류(정적 최적화 및 서스펜스 지뢰)를 배포 전에 차단합니다.
   - **Vitest**를 통해 유닛 테스트 및 로직 검증을 수행하여 사이드 이펙트를 방지합니다.
   - **시각적 회귀 및 인터랙션 테스트 (`Storybook` & `Chromatic`)**
     - Chromatic 자동화 파이프라인을 연동하여, 컴포넌트 단위의 UI 변경 사항을 추적하는 시각적 회귀 테스트를 수행합니다.
     - PR 단계에서 의도치 않은 디자인 깨짐 등을 사전에 감지하고, 팀원의 시각적 승인(Approve)을 받도록 강제하여 UI 품질을 철저히 관리합니다.

2. **CD (Continuous Deployment)**
   - CI 검증을 통과한 코드는 Vercel을 통해 프로덕션 환경으로 자동 배포됩니다.
   - 모든 PR마다 독립적인 Preview 배포 링크가 생성되어, 기능 단위의 화면 검증 및 피드백 루프를 구축했습니다.
	
환경 변수는 GitHub Secrets와 Vercel을 통해 주입됩니다. 시각적 회귀 테스트 및 배포를 위해 다음 설정이 필요합니다.

**GitHub Secrets**

| 구분 | 시크릿 키 (Secret Key) | 설명 |
| :--- | :--- | :--- |
| **Storybook** | `CHROMATIC_PROJECT_TOKEN` | Chromatic 시각적 회귀 테스트 토큰 |

**Vercel Environment Variables**

| 구분 | 변수명 | 설명 |
| :--- | :--- | :--- |
| **Application** | `NEXT_PUBLIC_SERVER_URL` | 백엔드 API 서버 주소 |
| | `NEXT_PUBLIC_SERVER_IP` | 백엔드 API 서버 주소 (동일) |
| | `NEXT_PUBLIC_KAKAO_MAP_KEY` | 카카오 지도 API 키 |
</details>

## 협업 규칙

<details>
<summary><b>브랜치 전략 (Branch Strategy)</b></summary>

`Shared Repository` 모델을 사용하며, 브랜치명은 `kebab-case`를 사용합니다.
- **형식**: `type/issue-number/description`
- **예시**: `feat/18/mypage-ui`, `fix/84/admin-login-fix`
</details>

<details>
<summary><b>커밋 컨벤션 (Commit Convention)</b></summary>
  
커밋 메시지에는 반드시 관련 이슈 번호를 포함합니다.
- **형식**: `type/#issue-number: subject`
- **예시**: `feat/#68: 광고 승인 모달 구현`, `fix/#68: searchBar에서 useEffect 제거`

| 커밋 유형 | 의미 |
| --- | --- |
| `feat` | 새로운 기능 추가 |
| `fix` | 버그 수정 |
| `docs` | 문서 수정 |
| `refactor` | 코드 리팩토링 |
| `test` | 테스트 코드, 리팩토링 테스트 코드 추가 |
| `chore` | 패키지 매니저 수정, 그 외 기타 수정 ex) .gitignore |
| `!HOTFIX` | 급하게 치명적인 버그를 고쳐야 하는 경우 |
</details>

<details>
<summary><b>개발 및 코드 규칙 (Coding Standards)</b></summary>

지속 가능한 코드 품질을 위해 다음의 제약 사항을 준수합니다.

- **타입 안전성**: `any` 타입 사용을 지양하고 명확한 TypeScript 타입을 정의합니다.
- **컴포넌트 설계**: 외부 의존성(API, 브릿지) 없는 컴포넌트를 우선 분리하여 재사용성을 높입니다.
- **에러 처리**: fetch 기반 API는 `res.ok` 체크, axios 기반 API는 interceptor를 통해 일관된 에러 처리를 수행합니다.
</details>

<details>
<summary><b> 테스트 및 품질 관리 (Testing & QA)</b></summary>

- **단위 테스트 필수**: 새로운 순수 비즈니스 로직 추가 시 Vitest 테스트 코드를 포함해야 합니다.
- **시각적 회귀 테스트**: UI 컴포넌트 변경 시 Storybook 스토리를 작성하고 Chromatic을 통해 검증합니다.
- **회귀 테스트**: 버그 수정 시 해당 버그가 재발하지 않음을 증명하는 테스트를 먼저 작성합니다.
- **CI 연동**: 모든 PR은 GitHub Actions의 타입 체크, 린트, 빌드, 테스트를 통과해야 머지가 가능합니다.
</details>

<details>
<summary><b>문서화 및 보안 (Docs & Security)</b></summary>

- **비밀 키 관리**: 어떠한 경우에도 소스 코드에 API 키나 시크릿을 하드코딩하지 않습니다. 모든 환경 변수는 `.env.local`과 GitHub Secrets를 통해 관리합니다.
- **브랜치 보호**: `main`, `develop` 브랜치는 직접 push를 금지하며 반드시 PR을 통해 머지합니다.
</details>

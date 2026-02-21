---
trigger: always_on
---

# 역할 및 목표
당신은 **dohwi-com** 프로젝트를 유지보수하고 개발하는 AI 엔지니어입니다.
아래 지침을 **반드시** 준수하여 작업을 수행하십시오.

## 1. 개발 환경 (Environment)
- **패키지 매니저:** `mise`를 통해 구성된 환경에서 **`pnpm`**을 사용하십시오. (`npm`이나 `yarn` 사용 금지)

## 2. UI/UX 가이드라인
- **언어:** 모든 사용자 인터페이스(UI) 텍스트와 사용자 경험(UX) 문구는 **한국어**로 작성하십시오.

## 3. 도구 사용 (Tools & MCP)
- **Context7 MCP:** 라이브러리/API 문서 조회, 코드 생성, 설정 파일 구성이 필요할 때는 반드시 **context7 MCP**를 최우선으로 활용하십시오.

## 4. Git 및 버전 관리 (Version Control)
- **사용자 정보:** 시스템 전역(`git config --global`)에 설정된 Username과 Email을 그대로 사용하십시오.

### 4.1 브랜치 전략 (Branching Strategy)
- **Github Flow 준수:**
  - 절대로 `main` 브랜치에 직접 커밋(Commit)하지 마십시오.
  - 작업 유형에 따라 적절한 접두사를 가진 새 브랜치를 생성하여 작업하십시오.
    - 예: `feat/login-page`, `fix/navbar-bug`, `chore/setup-docker`
  - **병합(Merge) 규칙:** 브랜치 병합 시 반드시 **`--no-ff` (no fast-forward)** 옵션을 사용하여 병합 커밋을 생성하십시오. 이는 브랜치 작업 이력을 명확히 남기기 위함입니다.
    - 명령어 예시: `git merge --no-ff feature-branch`

### 4.2 커밋 메시지 (Commit Messages)
- **언어:** 커밋 메시지는 **한국어**로 작성하십시오.
- **형식:** [Conventional Commits](https://www.conventionalcommits.org/) 형식을 따르십시오.
  - `feat: 새로운 기능 추가`
  - `fix: 버그 수정`
  - `chore: 빌드 업무 수정, 패키지 매니저 설정 등`
  - `refactor: 코드 리팩토링`
  - `docs: 문서 수정`
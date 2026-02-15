## 기술 스택

| 분류 | 기술 |
|------|------|
| 프레임워크 | [Next.js 16](https://nextjs.org/) (App Router) |
| 언어 | [TypeScript](https://www.typescriptlang.org/) |
| UI 라이브러리 | [React 19](https://react.dev/) |
| 스타일링 | [Tailwind CSS 4](https://tailwindcss.com/) |
| 폰트 | [Pretendard](https://github.com/orioncactus/pretendard) |
| 콘텐츠 | [MDX](https://mdxjs.com/) + GitHub API |
| 코드 하이라이팅 | [Shiki](https://shiki.style/) (rehype-pretty-code) |
| 댓글 | [Giscus](https://giscus.app/ko) (GitHub Discussions) |
| 테마 | [next-themes](https://github.com/pacocoursey/next-themes) |
| 아이콘 | [Lucide React](https://lucide.dev/) |

## 프로젝트 구조

```
src/
├── app/                      # Next.js App Router
│   ├── api/                  # API 라우트
│   │   └── revalidate/       # ISR 재검증 API
│   ├── blog/                 # 블로그 페이지
│   │   ├── [slug]/           # 개별 포스트
│   │   │   ├── not-found.tsx
│   │   │   ├── opengraph-image.tsx
│   │   │   └── page.tsx
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── globals.css
│   ├── layout.tsx
│   ├── manifest.json
│   ├── not-found.tsx
│   ├── opengraph-image.tsx
│   ├── page.tsx
│   ├── robots.ts
│   └── sitemap.ts
│
├── components/               # React 컴포넌트
│   ├── blog/
│   │   ├── BlogCard.tsx
│   │   ├── Giscus.tsx
│   │   ├── Navbar.tsx
│   │   ├── ScrollToTop.tsx
│   │   ├── SearchModal.tsx
│   │   ├── TagFilter.tsx
│   │   └── TOC.tsx
│   ├── common/
│   │   ├── ThemeToggle.tsx
│   │   └── TitleManager.tsx
│   ├── main/
│   │   ├── PaintBackground.tsx
│   │   └── TypingAnimation.tsx
│   └── providers/
│       └── ThemeProvider.tsx
│
├── lib/
│   ├── github.ts
│   ├── mdx.ts
│   └── utils.ts
│
└── types/
    └── post.ts
```

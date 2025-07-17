# Bobob Monorepo

개발자를 위한 유용한 도구들을 모아놓은 모노레포입니다.

## 🎯 프로젝트 구조

```
bobob-monorepo/
├── apps/
│   ├── main/           # 메인 랜딩 페이지 (bobob.app)
│   ├── iframe-viewer/  # iframe 뷰어 도구 (iframe.bobob.app)
│   └── regax/          # 정규식 테스터 (regax.bobob.app)
├── packages/
│   └── ui/             # 공통 UI 컴포넌트
└── turbo.json          # Turborepo 설정
```

## 🚀 각 애플리케이션

### 메인 앱 (apps/main)
- **도메인**: bobob.app
- **기능**: 랜딩 페이지, 각 도구로의 링크 제공
- **포트**: 3000

### Iframe Viewer (apps/iframe-viewer)
- **도메인**: iframe.bobob.app
- **기능**: 웹사이트를 다양한 디바이스 크기로 미리보기
- **포트**: 3001

### RegAx (apps/regax)
- **도메인**: regax.bobob.app  
- **기능**: 정규식 패턴 테스터
- **포트**: 3002

## 🛠️ 개발 환경 설정

### 필수 요구사항
- Node.js 18 이상
- npm 9 이상

### 설치 및 실행
```bash
# 의존성 설치
npm install

# 모든 앱 개발 서버 실행
npm run dev

# 개별 앱 실행
cd apps/main && npm run dev          # 포트 3000
cd apps/iframe-viewer && npm run dev # 포트 3001  
cd apps/regax && npm run dev         # 포트 3002

# 전체 빌드
npm run build

# 특정 앱만 빌드
turbo build --filter=@bobob/main
turbo build --filter=@bobob/iframe-viewer
turbo build --filter=@bobob/regax
```

## 📦 패키지 관리

### 공통 UI 컴포넌트 (packages/ui)
모든 앱에서 사용하는 공통 컴포넌트들이 포함되어 있습니다:
- AdContainer
- IframeViewer  
- IframeViewerDescription
- ProTipsContent
- TranslationProvider
- useTranslation

### 패키지 빌드
```bash
cd packages/ui && npm run build
```

## 🌐 배포

각 앱은 Vercel에 개별적으로 배포됩니다:

1. **메인 앱**: Root Directory = `apps/main`
2. **Iframe Viewer**: Root Directory = `apps/iframe-viewer`
3. **RegAx**: Root Directory = `apps/regax`

## 🔧 Turborepo 기능

- **빠른 빌드**: 변경된 앱만 선택적으로 빌드
- **병렬 실행**: 여러 앱을 동시에 개발/빌드
- **캐싱**: 빌드 결과 캐싱으로 속도 향상
- **의존성 관리**: 앱 간 의존성 자동 해결

## 📝 개발 워크플로우

1. 새 기능 브랜치 생성
2. 해당 앱 디렉토리에서 개발
3. 공통 컴포넌트는 `packages/ui`에 추가
4. `npm run build`로 전체 빌드 테스트
5. 각 앱을 개별 Vercel 프로젝트로 배포

## 🚧 다음 계획

- [ ] 더 많은 개발자 도구 추가
- [ ] 공통 디자인 시스템 확장
- [ ] E2E 테스트 추가
- [ ] CI/CD 파이프라인 구축

## 🤝 기여하기

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 라이센스

MIT License

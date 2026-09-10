# 예매 확인 페이지

구글 폼 응답(구글 시트)에 이름+휴대폰번호가 정상적으로 접수됐는지, 참가자가 직접 조회할 수 있는 페이지입니다.

- `index.html` : 참가자가 보는 조회 페이지 (이름 + 휴대폰번호 입력 → 접수 여부 + 관람 인원 확인)
- 백엔드(Google Apps Script) 코드는 구글 시트 쪽에만 존재하고, 이 GitHub 저장소(공개 저장소)에는 올리지 않습니다. 정적 사이트 코드가 아니라 구글 쪽에 별도로 배포되는 로직이라 저장소에 포함할 필요가 없고, 로컬의 `apps-script/Code.gs` 파일로만 보관합니다.

## 1단계. 구글 시트에 Apps Script 연결하기

1. 구글 시트 열기: https://docs.google.com/spreadsheets/d/1YzDqAHmZc7ycX2-GbJYcbCHQcHE1uckZfLNpZX7EeME/edit
2. 상단 메뉴 [확장 프로그램] > [Apps Script] 클릭
3. 기본으로 열려있는 `Code.gs`의 내용을 전부 지우고, 로컬 `apps-script/Code.gs` 파일 내용을 그대로 붙여넣기
4. 저장 (Ctrl+S)
5. 우측 상단 [배포] > [새 배포] 클릭
6. 유형 선택(⚙️ 톱니바퀴 아이콘)에서 "웹 앱" 선택
7. 아래 항목 설정
   - 실행 인원: **나(본인 계정)**
   - 액세스 권한이 있는 사용자: **전체(익명 사용자 포함)**
8. [배포] 클릭 → 처음이면 권한 승인 팝업이 뜸 → 본인 계정으로 허용
9. 배포 완료 후 나오는 **웹 앱 URL**을 복사 (`https://script.google.com/macros/s/xxxxx/exec` 형태)

> 시트 문항 이름이나 순서가 바뀌어도, 헤더에 "성함"과 "휴대폰"이라는 단어가 포함되어 있으면 자동으로 열을 찾아 동작합니다.

## 2단계. 페이지에 API 주소 연결하기

`index.html` 파일을 열어 아래 줄을 찾습니다.

```js
const API_URL = "PUT_YOUR_APPS_SCRIPT_WEB_APP_URL_HERE";
```

`PUT_YOUR_APPS_SCRIPT_WEB_APP_URL_HERE` 부분을 1단계에서 복사한 웹 앱 URL로 교체합니다.

## 3단계. GitHub Pages로 배포하기

1. https://github.com 에서 새 리포지토리 생성 (예: `reservation-check`, Public)
2. 이 폴더(`reservation-check`)를 그 리포지토리로 push
   ```bash
   git init
   git add .
   git commit -m "예매 확인 페이지 추가"
   git branch -M main
   git remote add origin https://github.com/<본인계정>/reservation-check.git
   git push -u origin main
   ```
3. GitHub 리포지토리 페이지에서 [Settings] > [Pages] 이동
4. Source를 `main` 브랜치 / `/ (root)` 로 설정 후 저장
5. 잠시 후 `https://<본인계정>.github.io/reservation-check/` 주소로 페이지가 열립니다. 이 링크를 참가자에게 공유하면 됩니다.

## 이후 관리

- 시트에 응답이 새로 쌓여도 코드 수정 없이 그대로 반영됩니다 (실시간 조회).
- 문항 문구를 크게 바꾸는 경우, 로컬 `apps-script/Code.gs`의 `NAME_HEADER_KEYWORD`, `PHONE_HEADER_KEYWORD`, `PARTY_HEADER_KEYWORD` 값을 확인하고, 수정했다면 Apps Script 편집기에도 다시 붙여넣은 뒤 [배포] > [배포 관리] > 새 버전으로 재배포하세요 (URL은 그대로 유지됩니다).
- 페이지 문구나 디자인을 바꾸고 싶으면 `index.html`만 수정 후 다시 `git push` 하면 됩니다.
- `apps-script/Code.gs`는 저장소에 커밋되지 않으므로(`.gitignore` 처리), 다른 컴퓨터에서 다시 작업할 경우 이 파일을 별도로 백업해두세요.

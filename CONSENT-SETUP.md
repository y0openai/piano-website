# 동의 게이트 — Google Sheets 연동 설정

동의 기록을 Google Sheets에 자동 저장하는 설정 가이드입니다.
**소요 시간: 약 5분**

---

## 1단계: Google Sheets 생성

1. [Google Sheets](https://sheets.google.com) 에서 새 스프레드시트 생성
2. 시트 이름을 `동의기록` 으로 변경
3. 1행(헤더)에 아래 내용 입력:

| A | B | C | D | E | F | G |
|---|---|---|---|---|---|---|
| 타임스탬프 | 이름 | 연락처 | 이메일 | IP | User Agent | 동의항목 |

---

## 2단계: Apps Script 생성

1. 스프레드시트 메뉴 → **확장 프로그램** → **Apps Script** 클릭
2. 기존 코드를 모두 지우고 아래 코드 붙여넣기:

```javascript
function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('동의기록');
  var data = JSON.parse(e.postData.contents);

  var consents = data.consents.map(function(c) {
    return c.label + ': ' + (c.checked ? 'O' : 'X');
  }).join(' | ');

  sheet.appendRow([
    data.timestamp,
    data.name,
    data.phone,
    data.email,
    data.ip,
    data.user_agent,
    consents
  ]);

  return ContentService.createTextOutput(
    JSON.stringify({ status: 'ok' })
  ).setMimeType(ContentService.MimeType.JSON);
}
```

3. **저장** (Ctrl+S)

---

## 3단계: 웹 앱으로 배포

1. Apps Script 상단 → **배포** → **새 배포**
2. 유형 선택: **웹 앱**
3. 설정:
   - **설명**: 동의 기록 수집
   - **실행 사용자**: 나
   - **액세스 권한**: **모든 사용자** (Anyone)
4. **배포** 클릭
5. **웹 앱 URL**을 복사 (예: `https://script.google.com/macros/s/AKfyc.../exec`)

---

## 4단계: URL 연결

`js/consent.js` 파일의 4번째 줄에서:

```javascript
const GOOGLE_SCRIPT_URL = '';
```

복사한 URL로 교체:

```javascript
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/여기에_복사한_URL/exec';
```

---

## 완료!

이제 사이트에서 누군가 동의하면 Google Sheets에 자동으로 기록됩니다.

### 테스트 방법
1. 브라우저 개발자 도구 → Console 탭 열기
2. `localStorage.removeItem('piano_consent_agreed')` 입력
3. 페이지 새로고침 → 동의 게이트 다시 표시
4. 테스트 정보 입력 후 제출
5. Google Sheets에 기록 확인

### 참고
- URL 설정 전에도 동의 게이트는 정상 작동합니다 (기록만 콘솔에 출력)
- 동의 기록은 브라우저 localStorage에도 저장되어 재방문 시 게이트가 스킵됩니다

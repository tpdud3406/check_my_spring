/**
 * 예매 확인 웹페이지용 백엔드 API.
 *
 * 사용법:
 * 1. 구글 시트를 열고 [확장 프로그램] > [Apps Script] 메뉴로 들어간다.
 * 2. 기본 생성된 Code.gs 내용을 모두 지우고 이 파일 내용을 붙여넣는다.
 * 3. 저장 후 우측 상단 [배포] > [새 배포] 클릭.
 * 4. 유형 선택(톱니바퀴)에서 "웹 앱" 선택.
 * 5. "실행 인원": 나(본인), "액세스 권한이 있는 사용자": 전체(익명 사용자 포함) 로 설정.
 * 6. [배포] 클릭 후 나오는 웹 앱 URL을 복사한다. (권한 승인 팝업이 뜨면 허용)
 * 7. 복사한 URL을 index.html의 API_URL 값에 붙여넣는다.
 *
 * 이 스크립트는 이름+전화번호가 시트에 그대로 존재하는지 여부(true/false)만 응답하며,
 * 전체 명단이나 개인정보를 외부로 반환하지 않는다.
 */

// 시트 헤더에 포함된 키워드로 이름/전화번호 열을 찾는다.
// 설문지 문항 문구가 살짝 바뀌어도 동작하도록 키워드 매칭 방식을 사용한다.
var NAME_HEADER_KEYWORD = '성함';
var PHONE_HEADER_KEYWORD = '휴대폰';

function doGet(e) {
  var params = (e && e.parameter) || {};
  var inputName = (params.name || '').toString().trim();
  var inputPhone = (params.phone || '').toString().replace(/[^0-9]/g, '');

  var result = { found: false };

  if (inputName && inputPhone.length === 11) {
    result.found = isReservationFound_(inputName, inputPhone);
  }

  return ContentService
    .createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}

function isReservationFound_(inputName, inputPhone) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
  var data = sheet.getDataRange().getValues();
  if (data.length < 2) return false;

  var headers = data[0];
  var nameCol = -1;
  var phoneCol = -1;
  for (var i = 0; i < headers.length; i++) {
    var header = String(headers[i]);
    if (nameCol === -1 && header.indexOf(NAME_HEADER_KEYWORD) !== -1) nameCol = i;
    if (phoneCol === -1 && header.indexOf(PHONE_HEADER_KEYWORD) !== -1) phoneCol = i;
  }
  if (nameCol === -1 || phoneCol === -1) return false;

  for (var r = 1; r < data.length; r++) {
    var rowName = String(data[r][nameCol]).trim();
    var rowPhone = String(data[r][phoneCol]).replace(/[^0-9]/g, '');
    if (rowName === inputName && rowPhone === inputPhone) {
      return true;
    }
  }
  return false;
}

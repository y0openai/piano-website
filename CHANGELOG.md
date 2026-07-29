# PIANO 웹사이트 변경 이력 (Changelog)

> 홈페이지 공개 콘텐츠·실적 수치의 주요 변경을 기록합니다.
> 비개발자도 "왜 이 숫자가 바뀌었는지" 나중에 바로 이해할 수 있도록 작성합니다.

---

## 2026-07-29 — 트랙레코드 수익률 정의 수정 (회전 마진 → 계좌 순자산)

### 왜 (배경)

홈페이지 트랙레코드의 "수익률"이 실제 계좌 성과보다 **약 10배 낮게** 표시되고
있었다. 라벨은 "투입자본 대비(on deployed capital)"였지만, 실제 발행 값은
`순손익 ÷ 청산된 모든 거래의 마진 누적합`이었다. 같은 자본이 수백 번 회전하며
분모에 중복 계산되어(회전율 희석), 실제 투자자가 계좌에서 겪은 수익률과
크게 어긋났다. 라벨과 계산식도 서로 달랐다.

- 검증 수치(라흐마니노프/gamma, 2026-06-05~07-29):
  - 순손익 835.64 USDT ÷ 마진 누적 17,468.71 USDT = **4.78%** (표시되던 값)
  - 계좌 순자산 8,429.04 → 9,374.31 USDT (입출금 없음, 순수 매매 성과) = **+11.22%**

### 무엇을 (변경)

수익률 정의를 **기간 중 계좌 순자산 변화율**로 교체. 세 지표(수익률·승률·거래수)를
모두 순자산 기록이 존재하는 구간(2026-06-05~)으로 통일해 기간을 일치시켰다.

- `js/metrics.js`: 발행 필드 `capitalRoiPct` → `accountRoiPct`
- `js/i18n.js`: 라벨 "수익률 (투입자본 대비)" → "수익률 (계좌 기준)"
  (영문 "Return (on deployed capital)" → "Return (account)"),
  disclaimer 문구를 "계좌 순자산 변화(입출금 없음 기준)"로 수정 (영/한)
- `index.html`: 정적 라벨 폴백 일치
- `piano-coin-gamma/scripts/publish_metrics.py`: 순자산 변화율로 `accountRoiPct`
  발행, 기간을 equity 구간으로 정렬, 승률·거래수 동일 구간 재계산

### 발효 수치

2026-06-05 ~ 07-29 (54일): 수익률 **+11.22%** · 승률 **59.0%** · 청산 거래 **156건**

### 컴플라이언스

`COMPLIANCE_GUIDELINE.md` 대조 완료. 실현 과거 실적 + "미래 보장 없음/원금 손실 가능"
고지가 함께 표시되어 §2 회색지대·§4 체크리스트상 허용. 계좌 기준 실현 수치는
가장 보수적·정직한 표현이라 컴플라이언스상 안전하다.

### 운영 메모

`홈페이지-실적-갱신.bat`은 `data/metrics.json`만 커밋/푸시하므로, 이번 라벨·JS
변경은 별도 1회 커밋으로 반영했다. 이후 bat은 새 `accountRoiPct` 필드와 호환되어
정상 동작한다.

### 커밋

- piano-website `08bc824` fix(track): publish account-equity return instead of turnover-diluted margin ROI
- piano-coin-gamma `801b008` fix(metrics): publish account-equity return, not turnover-diluted margin ROI

# Score Calculator (KR 5 vs JP 5)

## 폴더 구조
```
index.html / style.css / script.js
operators.js     ← 오퍼레이터 목록 (실제로 사용)
operators.json   ← 같은 데이터 (참고용)
image/relic/rogue_5_relic_final_1|2|5.webp
image/operators/avatar_char_{F열}_{G열}.png
```
`image/` 폴더는 직접 넣어야 합니다.

## 오퍼레이터 추가
`operators.js`의 `OPS` 배열에 `[id, EN, JP, KR, "F열_G열"]` 추가 (id는 999 이하). 플레이어당 오퍼레이터는 최대 99명.

## 규칙 추가
`script.js` 상단 `RULES` 배열 참조. 규칙 구성이 바뀌면 기존 프리셋 코드는 호환되지 않습니다.

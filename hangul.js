// 한글 자모 분해 · 타수 계산 (ES 모듈)
const CHO = ['ㄱ','ㄲ','ㄴ','ㄷ','ㄸ','ㄹ','ㅁ','ㅂ','ㅃ','ㅅ','ㅆ','ㅇ','ㅈ','ㅉ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ'];
const JUNG = ['ㅏ','ㅐ','ㅑ','ㅒ','ㅓ','ㅔ','ㅕ','ㅖ','ㅗ','ㅘ','ㅙ','ㅚ','ㅛ','ㅜ','ㅝ','ㅞ','ㅟ','ㅠ','ㅡ','ㅢ','ㅣ'];
const JONG = ['','ㄱ','ㄲ','ㄳ','ㄴ','ㄵ','ㄶ','ㄷ','ㄹ','ㄺ','ㄻ','ㄼ','ㄽ','ㄾ','ㄿ','ㅀ','ㅁ','ㅂ','ㅄ','ㅅ','ㅆ','ㅇ','ㅈ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ'];

const SPLIT = {
  'ㅘ':'ㅗㅏ','ㅙ':'ㅗㅐ','ㅚ':'ㅗㅣ','ㅝ':'ㅜㅓ','ㅞ':'ㅜㅔ','ㅟ':'ㅜㅣ','ㅢ':'ㅡㅣ',
  'ㄳ':'ㄱㅅ','ㄵ':'ㄴㅈ','ㄶ':'ㄴㅎ','ㄺ':'ㄹㄱ','ㄻ':'ㄹㅁ','ㄼ':'ㄹㅂ',
  'ㄽ':'ㄹㅅ','ㄾ':'ㄹㅌ','ㄿ':'ㄹㅍ','ㅀ':'ㄹㅎ','ㅄ':'ㅂㅅ'
};

function expand(out, jamo) {
  const s = SPLIT[jamo];
  if (s) { out.push(s[0]); out.push(s[1]); } else out.push(jamo);
}

export function strokes(ch) {
  const code = ch.charCodeAt(0);
  if (code >= 0xAC00 && code <= 0xD7A3) {
    const i = code - 0xAC00;
    const out = [CHO[Math.floor(i / 588)]];
    expand(out, JUNG[Math.floor((i % 588) / 28)]);
    const jong = JONG[i % 28];
    if (jong) expand(out, jong);
    return out;
  }
  if (code >= 0x3131 && code <= 0x3163) {
    const single = [];
    expand(single, ch);
    return single;
  }
  return [ch];
}

export function countStrokes(text) {
  let total = 0;
  for (const ch of text) total += strokes(ch).length;
  return total;
}

export function isPartialOf(typedCh, targetCh) {
  if (typedCh === targetCh) return true;
  const a = strokes(typedCh), b = strokes(targetCh);
  if (a.length > b.length) return false;
  return a.every((v, i) => v === b[i]);
}

export function cpm(text, elapsedMs) {
  if (!elapsedMs || elapsedMs <= 0) return 0;
  return Math.round(countStrokes(text) / (elapsedMs / 60000));
}

export const nfc = t => String(t ?? '').normalize('NFC');

const enc={';':'%3B','=':'%3D'};
const decr={'%3B':';','%3D':'='};
const quoteOut = (txt) => txt.replace(/(\;|\=)/g,($1)=>enc[$1]);
const quoteIn = (esc) => esc.replace(/(\%3B|\%3D)/g,($1)=>decr[$1]);
const slice16 = (full) => full.map((e,idx)=>idx%16==0 ? full.slice(idx,idx+16) : null).filter(e=>e);
const containsAd = (dec) => dec.match(/(;admin=true;)/g) ? true : false;
const randomKey=randomBytes(16);
const randomIV=randomBytes(16);

function randomBytes (num) {
  if (!num||num<1) { throw new Error ('Must create at least one byte!'); }
  let res=[];
  for (var i=0;i<num;i++) { res.push(parseInt(Math.floor(Math.random()*255),10).toString(16)); }
  return res;
}

const randomDecrypt = (c) => quoteIn(aesDecryptCBC(c,randomKey,randomIV,16).map(hexToText).join(""));
function randomEncrypt(pText) {
  let pre=quoteOut("comment1=cooking%20MCs;userdata=");
  let post=quoteOut(";comment2=%20like%20a%20pound%20of%20bacon");
  let input=PKCS7(txtToHex(pre+pText+post).map(hexPad),16);
  return aesEncryptCBC(input,randomKey,randomIV,16);
}

let e=randomEncrypt('0000000000000000000000000');
let dPrior=randomDecrypt(e);
let theReplacements='%3Badmin%3Dtrue'.split("").map(e=>parseInt(e.charCodeAt(),10).toString(16)).map(e=>hexXOR(e,'30'));
for (var i=0;i<theReplacements.length;i++) { e[32+i]=hexXOR(e[32+i],theReplacements[i]); }
let D=randomDecrypt(e);

console.log(`${D}\n${containsAd(D)}`);

window.onload = function () {
  document.querySelector('div#result').innerHTML=`
    <p><b>prior to twiddling:</b>${dPrior}</p>
    <p><b>result string:</b>${D}</p>
    <p><b>contains the string ';admin=true;'?</b> ${containsAd(D)}</p>
  `;
};

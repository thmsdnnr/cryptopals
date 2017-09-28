let randomKey=randomBytes(16).map(e=>hexPad(e));

const isAmpEql = (t) => t.match(/\=\&/) ? true : false;
const keyValueObjToString = (obj) => Object.keys(obj).map(k=>`${k}=${obj[k]}`).join("&");
const profileFor = (e) => keyValueObjToString(keyValueParse(`email=${e}&uid=10&role=user`));
const decryptAndParse = (eProf) => chopPKCS7(aesDecryptECB(eProf,randomKey,16).map(hexToText)).join("");
function encryptProf(pText) {
  pText=PKCS7(txtToHex(pText).map(e=>hexPad(e)),16);
  return aesEncryptECB(pText,randomKey,16);
}

function keyValueParse(top) {
  let amps=top.split("&");
  let equals=amps.map(e=>e.split("="));
  if (!amps.length||equals.some(e=>isAmpEql(e.join(""))||e.length!==2)) { throw new Error('Invalid. Keys and values cannot contain metacharacters.'); }
  let dict={};
  equals.forEach(v=>dict[v[0]]=v[1]);
  return dict;
}

function randomBytes (num) {
  if (!num||num<1) { throw new Error ('Must create at least one byte!'); }
  let res=[];
  for (var i=0;i<num;i++) { res.push(parseInt(Math.floor(Math.random()*255),10).toString(16)); }
  return res;
}

window.onload=function() {
  PO=profileFor("          foo@bar.com     admin           AAAAAAAAAAAAA      ");
  E=encryptProf(PO);
  let newCipher=E.slice(0,32).concat(E.slice(64,80),E.slice(32,48));
  document.querySelector('div#result').innerHTML=`original padded profile:<br />${PO}<br />
  manipulated ciphertext:<br />${newCipher.join("")}<br />
  decrypted manipulation:<br />${decryptAndParse(newCipher)}`;
}

let theRecord=[];
const theOracle = (cText) => areRepeats(cText.join(""),16) ? 'ECB' : 'CBC';

function areRepeats(txt,sZ) {
  txt=txt.split("");
  let blocks=[];
  for (var i=0;i<txt.length;i+=sZ) { blocks.push(txt.slice(i,i+sZ).join("")); }
  for (var i=0;i<blocks.length;i++) {
    let lIdx=blocks.lastIndexOf(blocks[i]);
    if (i!==lIdx) { return true; }
  }
  return false;
}

function randomCrypto(pText) {
  pText=txtToHex(pText).map(e=>hexPad(e));
  let randKey=randomBytes(16).map(e=>hexPad(e));
  let randIV=randomBytes(16).map(e=>hexPad(e));
  let rPreNum=Math.floor(Math.random()*6)+5
  let rPostNum=Math.floor(Math.random()*6)+5
  let rPreBytes=randomBytes(rPreNum);
  let rPostBytes=randomBytes(rPostNum);
  let padText=rPreBytes.concat(pText,rPostBytes);
  let input=PKCS7(padText,16);
  let eRes;
  if (Math.random()>0.5) {
    eRes=aesEncryptCBC(input,randKey,randIV,16);
    theRecord.push('CBC');
  }
  else {
    eRes=aesEncryptECB(input,randKey,16);
    theRecord.push('ECB');
  }
  return eRes;
}

function guess(text) {
  let randResults=[];
  let its=50;
  for (var i=0;i<its;i++) { randResults.push(randomCrypto(text)); }
  let answers=randResults.map(e=>theOracle(e));
  let numRight=theRecord.map((e,idx)=>e===answers[idx]?1:0).reduce((a,b)=>a+=b,0);
  return (numRight/50)*100;
}

console.log(`% guessed correctly: ${guess('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA')}`);

let result,cipher,decryptKey,encKey,plainText,encryptionResult,aE,aD,cBits,padInfo;
let E=[]; //TODO fix global wrap keygen in a class or something

const hexChunk = (arr) => arr.split("").map(e=>e.charCodeAt().toString(16));

function flattenArray(array) {
  let res=[];
  for (var i=0;i<array.length;i++) {
    if (Array.isArray(array[i])) { res = res.concat(flattenArray(array[i])); }
    else { res.push(array[i]); }
  }
  return res;
}

const hexToDec = (hex) => parseInt(hex,16).toString(10);
const binToDec = (bin) => parseInt(bin,2).toString(10);
function decToBin(dec) {
  dec=parseInt(dec,10).toString(2);
  while (dec.length<8) { dec="0"+dec; }
  return dec;
}
const hexToBin = (hex) => decToBin(hexToDec(hex));

function selectors() {
  result=document.querySelector('div#result');
  encryptionResult=document.querySelector('div#result');
  cipher=document.querySelector('input#base64Cipher');
  decryptKey=document.querySelector('input#decryptKey');
  encKey=document.querySelector('input#encKey');
  plainText=document.querySelector('input#plainText');
  aE=document.querySelector('button#encrypt');
  aD=document.querySelector('button#decrypt');
  cBits=document.querySelector('select#bits');
  padInfo=document.querySelector('div#padInfo');
}

function hexToText(hex) {
  hex=hex.split("");
  let chunkHex=[];
  for (var i=0;i<hex.length;i+=2) { chunkHex.push(hex.slice(i,i+2).join("")); }
  console.log(chunkHex);
  chunkHex=chunkHex.map(e=>String.fromCharCode(parseInt(e,16).toString(10)));
  return chunkHex;
}

function handleInputChange(e) {
  let act=e.target.id;
  if (act==='encrypt'||act==='decrypt') {
    let plain=plainText.value;
    let key=encKey.value;
    let bits=Number(cBits.selectedOptions[0].value);

    let keyCeil=bits*Math.floor(key.length/bits)+bits;
    //fixed blocksize, just need even multiple of 16!
    let plainCeil=16*Math.floor(plain.length/16)+16;
    if (plain.length%16!==0) { plain=padToN(plain,plainCeil); }
    else { plain=plain+new Array(16).fill(10).join(""); }
    if (key.length%bits!==0) { key=padToN(key,keyCeil); }
    padInfo.innerHTML=`padded text: ${plain}, len: ${plain.length}<br />
    padded key: ${key}, len: ${key.length}`;

    //TODO -> input of text / Hex / Base64

    plain=plain.split("").map(e=>parseInt(e.charCodeAt(),10).toString(16));
    key=key.split("").map(e=>parseInt(e.charCodeAt(),10).toString(16));
    console.log(plain.join(""),plain);
    console.log(key.join(""),key);
    let Z = act==='encrypt' ? aesEncrypt(plain,key,bits) : aesDecrypt(plain,key,bits);
    let readable=Z.map(e=>String.fromCharCode(parseInt(e,16).toString(10))).join("")
    console.log(Z);
    result.innerHTML=`readable: ${readable}<br />hex: ${Z.join("").toUpperCase()}`;
    console.log(plain,plain.length,key,key.length);
  }
}

  const shiftRow = (row, n) => n ? row.slice(n).concat(row.slice(0,n)) : row;

  function bytesToM(bytes) {
    if (bytes.length!==16) { return null; }
    //arranges bytes 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16
    /* into a matrix:
      1 5 9 13  ->0 start at 0 add 4
      2 6 10 14 ->1 start at 1 add 4
      3 7 11 15 ->2 start at 2 add 4
      4 8 12 16 ->3 start at 3 add 4
    */
    let M=[];
    let tempRow=[];
    for (var i=0;i<4;i++) {
      for (var j=0;j<16;j+=4) { tempRow.push(bytes[i+j]); }
      M.push(tempRow);
      tempRow=[];
    }
    return M;
  }

  function byteXOR(a,b) {
    //accepts two binary strings length 8; returns one string length 8, bitwise XOR
    if ((a.length!==8||b.length!==8)||(a.match(/[^0-1]/)||b.match(/[^0-1]/))) { return null; }
    a=a.split("");
    b=b.split("");
    return a.map((e,idx)=>e^b[idx]).join("");
  }

  const hexXOR = (a,b) => parseInt(byteXOR(hexToBin(a),hexToBin(b)),2).toString(16);

  function CBI(M,idx) { //returns column of M at given idx
    if (!M||!Number.isInteger(idx)) { return null; }
    if (JSON.stringify(flattenArray(M))===JSON.stringify(M)) { return null; }
    if (M[0].length-1<idx) { return null; }
    let temp=[];
    for (var i=0;i<M.length;i++) { temp.push(M[i][idx]); }
    return temp;
  }

  function RBI(M,idx) { //returns row of M at given idx
    if (!M||!Number.isInteger(idx)) { return null; }
    if (JSON.stringify(flattenArray(M))===JSON.stringify(M)) { return null; }
    if (M.length-1<idx) { return null; }
    let temp=[];
    for (var i=0;i<M[0].length;i++) { temp.push(M[idx][i]); }
    return temp;
  }

  let eT='01 03 05 0F 11 33 55 FF 1A 2E 72 96 A1 F8 13 35 5F E1 38 48 D8 73 95 A4 F7 02 06 0A 1E 22 66 AA E5 34 5C E4 37 59 EB 26 6A BE D9 70 90 AB E6 31 53 F5 04 0C 14 3C 44 CC 4F D1 68 B8 D3 6E B2 CD 4C D4 67 A9 E0 3B 4D D7 62 A6 F1 08 18 28 78 88 83 9E B9 D0 6B BD DC 7F 81 98 B3 CE 49 DB 76 9A B5 C4 57 F9 10 30 50 F0 0B 1D 27 69 BB D6 61 A3 FE 19 2B 7D 87 92 AD EC 2F 71 93 AE E9 20 60 A0 FB 16 3A 4E D2 6D B7 C2 5D E7 32 56 FA 15 3F 41 C3 5E E2 3D 47 C9 40 C0 5B ED 2C 74 9C BF DA 75 9F BA D5 64 AC EF 2A 7E 82 9D BC DF 7A 8E 89 80 9B B6 C1 58 E8 23 65 AF EA 25 6F B1 C8 43 C5 54 FC 1F 21 63 A5 F4 07 09 1B 2D 77 99 B0 CB 46 CA 45 CF 4A DE 79 8B 86 91 A8 E3 3E 42 C6 51 F3 0E 12 36 5A EE 29 7B 8D 8C 8F 8A 85 94 A7 F2 0D 17 39 4B DD 7C 84 97 A2 FD 1C 24 6C B4 C7 52 F6 01';
  eT=eT.split(" ");
  let lT='00 00 19 01 32 02 1A C6 4B C7 1B 68 33 EE DF 03 64 04 E0 0E 34 8D 81 EF 4C 71 08 C8 F8 69 1C C1 7D C2 1D B5 F9 B9 27 6A 4D E4 A6 72 9A C9 09 78 65 2F 8A 05 21 0F E1 24 12 F0 82 45 35 93 DA 8E 96 8F DB BD 36 D0 CE 94 13 5C D2 F1 40 46 83 38 66 DD FD 30 BF 06 8B 62 B3 25 E2 98 22 88 91 10 7E 6E 48 C3 A3 B6 1E 42 3A 6B 28 54 FA 85 3D BA 2B 79 0A 15 9B 9F 5E CA 4E D4 AC E5 F3 73 A7 57 AF 58 A8 50 F4 EA D6 74 4F AE E9 D5 E7 E6 AD E8 2C D7 75 7A EB 16 0B F5 59 CB 5F B0 9C A9 51 A0 7F 0C F6 6F 17 C4 49 EC D8 43 1F 2D A4 76 7B B7 CC BB 3E 5A FB 60 B1 86 3B 52 A1 6C AA 55 29 9D 97 B2 87 90 61 BE DC FC BC 95 CF CD 37 3F 5B D1 53 39 84 3C 41 A2 6D 47 14 2A 9E 5D 56 F2 D3 AB 44 11 92 D9 23 20 2E 89 B4 7C B8 26 77 99 E3 A5 67 4A ED DE C5 31 FE 18 0D 63 8C 80 C0 F7 70 07';
  lT=lT.split(" ");

  function multiplyG(A,B) {
    //returns result of Galois multiplication of two hex values, correcting for overflow
    let a10=parseInt(A,16).toString(10);
    let b10=parseInt(B,16).toString(10);
    if (a10==0||b10==0) { return '00'; }
    let sum=Number(parseInt(lT[a10],16).toString(10))+Number(parseInt(lT[b10],16).toString(10));
    let res=sum<256 ? sum : sum-255;
    return eT[res];
  }

  const binToHex = (bin) => parseInt(bin,2).toString(16);

  function mixColumns(state,encrypt=true) {
    //takes state in 4x4 matrix and multiplies per 5.4.1, returns a 4x4 matrix
    if (state.length!==4||state[0].length!==4) { return null; }
    let MM = encrypt ? [['02','03','01','01'],['01','02','03','01'],['01','01','02','03'],['03','01','01','02']] :
    [['0E','0B','0D','09'],['09','0E','0B','0D'],['0D','09','0E','0B'],['0B','0D','09','0E']];
    let sCol=[];
    let newBytes=[];
    let newArr=[];
    let XORd=[];
    let temp=[];
    for (var i=0;i<16;i++) { //for each new byte
      let xorVals=[];
      if (i%4===0) { sCol=CBI(state,i/4); } //grab new col each 4
      for (var j=0;j<4;j++) { xorVals.push([sCol[j],MM[i%4][j]]); }
      newBytes.push(xorVals);
      xorVals=[];
    }
    for (var j=0;j<newBytes.length;j++) {
      for (var k=0;k<newBytes[j].length;k++) {
        temp.push(multiplyG(newBytes[j][k][0],newBytes[j][k][1]));
      }
      newArr.push(temp);
      temp=[];
    }
    for (var p=0;p<newArr.length;p++) { XORd.push(newArr[p].reduce((a,b)=>hexXOR(a,b))); }
    return XORd;
  }

  function padToN(m,n) {
    //pads message m to n hex bytes with PKCS7 algorithm
    if (!m||n<m.length) { return null; }
    else {
      let dist=parseInt((n-m.length),10).toString(16);
      while (m.length<n) { m=m+dist; }
    }
    return m;
  }

  const rconLUT = ["01000000","02000000","04000000","08000000","10000000","20000000","40000000","80000000","1B000000","36000000","6C000000","D8000000","AB000000","4D000000","9A000000"];

  function Rcon(idx) { //returns 4 bytes in hex
    if ((idx<0||idx>14)||!Number.isInteger(idx)) { return null; }
    let hex=rconLUT[idx].split("");
    let chunkHex=[];
    for (var i=0;i<hex.length;i+=2) { chunkHex=chunkHex.concat(hex.slice(i,i+2).join("")); }
    return chunkHex;
  }

  function rotWord(word) { //rotates array length 4 by 1
    if (word.length!==4) { return null; }
    return shiftRow(word,1);
  }

  const EK = (offset) => E.slice(offset,offset+4);

  /*TODO
  There is an exception of this rule where if the key is 32 bytes long
  an additional call to the Sub Word function is called every 8 rounds
  starting on the 13th round.
  TODO */

  function generateExpandedKey(key,keyBytes=16) {
    let expKey=[];
    E=[]; //TODO fix global
    if (key.length<keyBytes) { return null; }
    const totRounds = {'16':44,'24':52,'32':60};
    let numRounds = totRounds[keyBytes]||44; //default to 16-byte
    for (var i=0;i<numRounds;i++) { expandKey(key, i, keyBytes); }
    return E;
  }

  function clampHex(val) {
    if (!val||!val.length) { return null; }
    let dec=parseInt(val,16).toString(10);
    if (dec<256) { return val; }
    else {
      while (dec>256) { dec-=255; }
      return parseInt(dec,10).toString(16);
    }
  }

  function expandKey(key, round, keyBytes=16) {
    if (round<keyBytes/4) { E=E.concat(key.slice(round*4,round*4+4)); }
    else if (round%(keyBytes/4)===0) {
      let res=[];
      let A=subWord(rotWord(EK((round-1)*4)),true);
      let B=Rcon((round/(keyBytes/4))-1);
      let C=EK((round-(keyBytes/4))*4);
      for (var i=0;i<A.length;i++) { res.push(hexXOR(hexXOR(A[i],B[i]),C[i])); }
      E=E.concat(res);
    }
    else {
      let res=[];
      let A=EK((round-1)*4);
      let B=EK((round-(keyBytes/4))*4);
      if (keyBytes===32&&(round>=12&&round%8==4)) { //special handling for 32-bit keys
        //extra subWord on the EK req'd every 8th round starting @ round 12
        A=subWord(A);
        //console.log(round,'YEAH!');
      }
      for (var i=0;i<A.length;i++) { res.push(hexXOR(A[i],B[i])); }
      E=E.concat(res);
    }
  }

  //byteSub
  const sBE = `63 7c 77 7b f2 6b 6f c5 30 01 67 2b fe d7 ab 76 ca 82 c9 7d fa 59 47 f0 ad d4 a2 af 9c a4 72 c0 b7 fd 93 26 36 3f f7 cc 34 a5 e5 f1 71 d8 31 15 04 c7 23 c3 18 96 05 9a 07 12 80 e2 eb 27 b2 75 09 83 2c 1a 1b 6e 5a a0 52 3b d6 b3 29 e3 2f 84 53 d1 00 ed 20 fc b1 5b 6a cb be 39 4a 4c 58 cf d0 ef aa fb 43 4d 33 85 45 f9 02 7f 50 3c 9f a8 51 a3 40 8f 92 9d 38 f5 bc b6 da 21 10 ff f3 d2 cd 0c 13 ec 5f 97 44 17 c4 a7 7e 3d 64 5d 19 73 60 81 4f dc 22 2a 90 88 46 ee b8 14 de 5e 0b db e0 32 3a 0a 49 06 24 5c c2 d3 ac 62 91 95 e4 79 e7 c8 37 6d 8d d5 4e a9 6c 56 f4 ea 65 7a ae 08 ba 78 25 2e 1c a6 b4 c6 e8 dd 74 1f 4b bd 8b 8a 70 3e b5 66 48 03 f6 0e 61 35 57 b9 86 c1 1d 9e e1 f8 98 11 69 d9 8e 94 9b 1e 87 e9 ce 55 28 df 8c a1 89 0d bf e6 42 68 41 99 2d 0f b0 54 bb 16`.split(" ")
  const sBD = `52 09 6a d5 30 36 a5 38 bf 40 a3 9e 81 f3 d7 fb 7c e3 39 82 9b 2f ff 87 34 8e 43 44 c4 de e9 cb 54 7b 94 32 a6 c2 23 3d ee 4c 95 0b 42 fa c3 4e 08 2e a1 66 28 d9 24 b2 76 5b a2 49 6d 8b d1 25 72 f8 f6 64 86 68 98 16 d4 a4 5c cc 5d 65 b6 92 6c 70 48 50 fd ed b9 da 5e 15 46 57 a7 8d 9d 84 90 d8 ab 00 8c bc d3 0a f7 e4 58 05 b8 b3 45 06 d0 2c 1e 8f ca 3f 0f 02 c1 af bd 03 01 13 8a 6b 3a 91 11 41 4f 67 dc ea 97 f2 cf ce f0 b4 e6 73 96 ac 74 22 e7 ad 35 85 e2 f9 37 e8 1c 75 df 6e 47 f1 1a 71 1d 29 c5 89 6f b7 62 0e aa 18 be 1b fc 56 3e 4b c6 d2 79 20 9a db c0 fe 78 cd 5a f4 1f dd a8 33 88 07 c7 31 b1 12 10 59 27 80 ec 5f 60 51 7f a9 19 b5 4a 0d 2d e5 7a 9f 93 c9 9c ef a0 e0 3b 4d ae 2a f5 b0 c8 eb bb 3c 83 53 99 61 17 2b 04 7e ba 77 d6 26 e1 69 14 63 55 21 0c 7d`.split(" ");
  const byteSub = (byte, enc=false) => enc ? sBE[parseInt(byte,16).toString(10)] : sBD[parseInt(byte,16).toString(10)];

  function subWord(word, enc=false) {
    if (word.length!==4) { return null; }
    return word.map(e=>byteSub(e,enc));
  }

window.onload=function() {
  selectors();
  cipher.addEventListener('keyup', function(e){handleInputChange(e);});
  decryptKey.addEventListener('keyup', function(e){handleInputChange(e);});
  encKey.addEventListener('keyup', function(e){handleInputChange(e);});
  plainText.addEventListener('keyup', function(e){handleInputChange(e);});

  aE.addEventListener('click', function(e){handleInputChange(e);});
  aD.addEventListener('click', function(e){handleInputChange(e);});
  cBits.addEventListener('change', function(e){handleInputChange(e);});
};

  function addRoundKey(state,rKey) { //expects state as concat array
    let roundResult=[];
    let temp=[];
    for (var j=0;j<state.length;j+=16) {
      let curSlice=state.slice(j,j+16);
      for (var k=0;k<16;k++) { temp.push(hexXOR(curSlice[k],rKey[k])); }
      roundResult=roundResult.concat(temp); //TODO changed from roundResult.push(temp) change enc?
      temp=[];
    }
    return roundResult;
  }

  function bSub(state,enc) {
    let bSubResult=[];
    for (var j=0;j<state.length;j++) { bSubResult.push(byteSub(state[j],enc)); }
    return bSubResult;
  }

  function sRow(state,enc) {
    let kMult = enc ? 1 : -1;
    let sRowResult=[];
    let newChunk=[];
    let newState=[];
    for (var j=0;j<state.length;j+=16) {
      let cStateChunk=bytesToM(state.slice(j,j+16));
      for (var k=0;k<4;k++) { newChunk.push(shiftRow(cStateChunk[k],kMult*k)); }
      newState.push(newChunk);
      newChunk=[];
    }
    return newState;
  }

  function mC(state,enc) { //state is already 4x4
    let mCResult=[];
    for (var j=0;j<state.length;j++) { mCResult.push(mixColumns(state[j],enc)); }
    return mCResult;
  }

  function mToBytes(M) {
    let newRes=[];
    let temp=[];
    for (var i=0;i<M[0].length;i++) {
      for (var j=0;j<4;j++) { temp.push(M[j][i]); }
      newRes=newRes.concat(temp);
      temp=[];
    }
    return newRes;
  }

  const hexPad = (hex) => hex.length===1 ? "0"+hex : hex;

  function aesEncrypt(plainText, key, numBits) {
    const numRounds = { '16':9,'24':11,'32':13 };
    if (!numRounds[numBits]) { return null; }
    let totalRounds = numRounds[numBits];
    let expKey=generateExpandedKey(key,numBits);
    //initial state
    let curKey=expKey.slice(0,16);
    let temp=[];
    for (var i=0;i<plainText.length;i+=16) { temp.push(addRoundKey(plainText.slice(i,i+16),curKey)); }
    let currentState=flattenArray(temp);
    for (var i=0;i<totalRounds+1;i++) {
      let curKey=expKey.slice(i*16+16,i*16+2*16);
      if (i<totalRounds) {
        temp=[];
        for (var j=0;j<currentState.length;j+=16) {
          let state=currentState.slice(j,j+16);
          temp.push(addRoundKey(mC(sRow(bSub(state,true),true))[0],curKey));
        }
        currentState=flattenArray(temp);
      }
      else {
        temp=[];
        for (var j=0;j<currentState.length;j+=16) {
          let state=currentState.slice(j,j+16);
          temp.push(addRoundKey(mToBytes(sRow(bSub(state,true),true)[0]),curKey));
        }
        currentState=temp;
      }
    }
    return flattenArray(currentState).map(e=>hexPad(e));
  }

  function aesDecrypt(cipherText, key, numBits) {
    const numRounds = { '16':9,'24':11,'32':13 };
    if (!numRounds[numBits]) { return null; }
    let totalRounds = numRounds[numBits];
    let expKey=generateExpandedKey(key,numBits);
    let curKey=expKey.slice(expKey.length-16);
    let temp=[];
    for (var i=0;i<cipherText.length;i+=16) {
      let state=cipherText.slice(i,i+16);
      temp.push(bSub(mToBytes(sRow(addRoundKey(state,curKey),false)[0]),false));
    }
    let currentState=flattenArray(temp);
    for (var i=0;i<totalRounds+1;i++) {
      let curKey=expKey.slice(expKey.length-(i*16+16*2),expKey.length-(i*16+16));
      if (i<totalRounds) {
        temp=[];
        for (var j=0;j<currentState.length;j+=16) {
          let state=currentState.slice(j,j+16)
          let Z=mixColumns(bytesToM(addRoundKey(state,curKey),false),false);
          Z=bSub(mToBytes(sRow(Z,false)[0]),false);
          temp.push(Z);
        }
        currentState=flattenArray(temp);
      }
      else {
        temp=[];
        for (var j=0;j<currentState.length;j+=16) { temp.push(addRoundKey(currentState.slice(j,j+16),curKey)); }
        currentState=temp;
      }
    }
    return flattenArray(currentState);//.map(e=>hexPad(e));
  }

//TODO test 24-bit decryption and encryption
//TODO test 16-bit encryption and decryption



let vanillaIce=atob(`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`);


//TODO: the decryption payoff
let iceMelter='YELLOW SUBMARINE'.split("").map(e=>parseInt(e.charCodeAt(),10).toString(16));
let chunkedCipher=hexChunk(vanillaIce);
let cryptoPal=aesDecrypt(chunkedCipher,iceMelter,16);
console.log(cryptoPal.map(e=>String.fromCharCode(parseInt(e,16).toString(10))).join(""));

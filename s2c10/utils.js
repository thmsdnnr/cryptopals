//-->Encrypt/Decrypt Subprocesses<--
  let eT='01 03 05 0F 11 33 55 FF 1A 2E 72 96 A1 F8 13 35 5F E1 38 48 D8 73 95 A4 F7 02 06 0A 1E 22 66 AA E5 34 5C E4 37 59 EB 26 6A BE D9 70 90 AB E6 31 53 F5 04 0C 14 3C 44 CC 4F D1 68 B8 D3 6E B2 CD 4C D4 67 A9 E0 3B 4D D7 62 A6 F1 08 18 28 78 88 83 9E B9 D0 6B BD DC 7F 81 98 B3 CE 49 DB 76 9A B5 C4 57 F9 10 30 50 F0 0B 1D 27 69 BB D6 61 A3 FE 19 2B 7D 87 92 AD EC 2F 71 93 AE E9 20 60 A0 FB 16 3A 4E D2 6D B7 C2 5D E7 32 56 FA 15 3F 41 C3 5E E2 3D 47 C9 40 C0 5B ED 2C 74 9C BF DA 75 9F BA D5 64 AC EF 2A 7E 82 9D BC DF 7A 8E 89 80 9B B6 C1 58 E8 23 65 AF EA 25 6F B1 C8 43 C5 54 FC 1F 21 63 A5 F4 07 09 1B 2D 77 99 B0 CB 46 CA 45 CF 4A DE 79 8B 86 91 A8 E3 3E 42 C6 51 F3 0E 12 36 5A EE 29 7B 8D 8C 8F 8A 85 94 A7 F2 0D 17 39 4B DD 7C 84 97 A2 FD 1C 24 6C B4 C7 52 F6 01';
  eT=eT.split(" ");
  let lT='00 00 19 01 32 02 1A C6 4B C7 1B 68 33 EE DF 03 64 04 E0 0E 34 8D 81 EF 4C 71 08 C8 F8 69 1C C1 7D C2 1D B5 F9 B9 27 6A 4D E4 A6 72 9A C9 09 78 65 2F 8A 05 21 0F E1 24 12 F0 82 45 35 93 DA 8E 96 8F DB BD 36 D0 CE 94 13 5C D2 F1 40 46 83 38 66 DD FD 30 BF 06 8B 62 B3 25 E2 98 22 88 91 10 7E 6E 48 C3 A3 B6 1E 42 3A 6B 28 54 FA 85 3D BA 2B 79 0A 15 9B 9F 5E CA 4E D4 AC E5 F3 73 A7 57 AF 58 A8 50 F4 EA D6 74 4F AE E9 D5 E7 E6 AD E8 2C D7 75 7A EB 16 0B F5 59 CB 5F B0 9C A9 51 A0 7F 0C F6 6F 17 C4 49 EC D8 43 1F 2D A4 76 7B B7 CC BB 3E 5A FB 60 B1 86 3B 52 A1 6C AA 55 29 9D 97 B2 87 90 61 BE DC FC BC 95 CF CD 37 3F 5B D1 53 39 84 3C 41 A2 6D 47 14 2A 9E 5D 56 F2 D3 AB 44 11 92 D9 23 20 2E 89 B4 7C B8 26 77 99 E3 A5 67 4A ED DE C5 31 FE 18 0D 63 8C 80 C0 F7 70 07';
  lT=lT.split(" ");

  function multiplyG(A,B) { //Galois multiplication of two hex values, correcting for overflow
    let a10=parseInt(A,16).toString(10);
    let b10=parseInt(B,16).toString(10);
    if (a10==0||b10==0) { return '00'; }
    let sum=Number(parseInt(lT[a10],16).toString(10))+Number(parseInt(lT[b10],16).toString(10));
    let res=sum<256 ? sum : sum-255;
    return eT[res];
  }

  function mixColumns(state,encrypt=true) { //takes state in 4x4 matrix, multiplies, returns a 4x4 matrix
    if (state.length!==4||state[0].length!==4) { return null; }
    let MM = encrypt ? [['02','03','01','01'],['01','02','03','01'],['01','01','02','03'],['03','01','01','02']] :
    [['0E','0B','0D','09'],['09','0E','0B','0D'],['0D','09','0E','0B'],['0B','0D','09','0E']];
    let sCol=[];
    let newBytes=[];
    let newArr=[];
    let XORd=[];
    let temp=[];
    for (var i=0;i<16;i++) { //for each byte in array iterate columnwise
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

//-->Padding<--
  function padToN(msg,num,padC) { //pads array msg num bytes with padC hexadecimal character
    if ((!msg||num<msg.length)||(!Array.isArray(msg)||padC.length!==msg[0].length)) { return null; }
    else { while (msg.length<num) { msg.push(padC); } }
    return msg;
  }

  function PKCS7(arr,blockSz) { //returns PKCS7 padded array
    if ((!arr||!blockSz)||(!Array.isArray(arr)||!arr.length)) { return null; }
    let padN=blockSz*Math.floor(arr.length/blockSz)+blockSz;
    let fillCharacter=hexPad(parseInt((padN-arr.length),10).toString(16));
    if (arr.length%blockSz!==0) { arr=padToN(arr,padN,fillCharacter); } //add fillCharacter bytes to make len%16==0
    else { arr=arr.concat(new Array(blockSz).fill('10')); } //add a new 16-byte block
    return arr;
  }

  function chopPKCS7(padArr) { //accepts padded hex array, returns non-padded array
    if (!Array.isArray(padArr)||!padArr.length) { return null; }
    let last=Number(parseInt(padArr[padArr.length-1],16).toString(10));
    if (last>0&&last<=16) {
      let possibleSlice=padArr.slice(padArr.length-last);
      let lastCh=padArr[padArr.length-1];
      if (last>=padArr.length) { throw new Error('Padding >= array length! Are you sure you wanna do that?'); }
      else if (!possibleSlice.every(c=>c==lastCh)) { throw new Error('String is not PKCS7-padded.'); }
      return padArr.slice(0,padArr.length-last);
    }
    return padArr;
  }

//-->Expanded Key Generation<--
  const rconLUT = ["01000000","02000000","04000000","08000000","10000000","20000000","40000000","80000000","1B000000","36000000","6C000000","D8000000","AB000000","4D000000","9A000000"];
  const Rcon = (idx) => ((idx<0||idx>14)||!Number.isInteger(idx)) ? null : hexByTwo(rconLUT[idx]);
  const rotWord = (word) => word.length!==4 ? null : shiftRow(word,1);

  function generateExpandedKey(key,keyBytes=16) {
    const EK = (offset) => E.slice(offset,offset+4);
    let expKey=[];
    let E=[];
    if (key.length<keyBytes) { return null; }
    const totRounds = {'16':44,'24':52,'32':60};
    let numRounds = totRounds[keyBytes]||44; //default to 16-byte
    for (var i=0;i<numRounds;i++) { expandKey(key, i, keyBytes); }
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
            A=subWord(A,true);
          }
          for (var i=0;i<A.length;i++) { res.push(hexXOR(A[i],B[i])); }
          E=E.concat(res);
        }
      }
    return E.map(e=>hexPad(e));
  }

//-->State Array Manipulation<--
  function flattenArray(array) {
    let res=[];
    for (var i=0;i<array.length;i++) {
      if (Array.isArray(array[i])) { res = res.concat(flattenArray(array[i])); }
      else { res.push(array[i]); }
    }
    return res;
  }

  function sRow(state,enc) {
    if (!state) { return null; }
    let kMult = enc ? 1 : -1;
    let newMatrix=[];
    state=bytesToM(state);
    for (var k=0;k<4;k++) { newMatrix.push(shiftRow(state[k],kMult*k)); }
    return newMatrix;
  }

  function mToBytes(M) {
    if (!M.length||!Array.isArray(M)) { return null; }
    if (flattenArray(M).length!==16) { return null; }
    let newRes=[];
    let temp=[];
    for (var i=0;i<M.length;i++) {
      for (var j=0;j<M[i].length;j++) { temp.push(M[j][i]); }
      newRes=newRes.concat(temp);
      temp=[];
    }
    return newRes;
  }

  function bytesToM(bytes) {
    if (bytes.length!==16) { return null; }
    //convertes bytes from a 1x16 [1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16]
    //into a 4x4 matrix: [[1 5 9 13],[2 6 10 14],[3 7 11 15],[4 8 12 16]]
    let M=[];
    let tempRow=[];
    for (var i=0;i<4;i++) {
      for (var j=0;j<16;j+=4) { tempRow.push(bytes[i+j]); }
      M.push(tempRow);
      tempRow=[];
    }
    return M;
  }

  function CBI(M,idx) { //returns column of M at given idx
    if (!M||!Number.isInteger(idx)) { return null; }
    if (JSON.stringify(flattenArray(M))===JSON.stringify(M)) { return null; }
    if (M[0].length-1<idx) { return null; }
    let temp=[];
    for (var i=0;i<M.length;i++) { temp.push(M[i][idx]); }
    return temp;
  }

//-->Number Conversion and Helper Functions<--
  function decToBin(dec) {
    dec=parseInt(dec,10).toString(2);
    while (dec.length<8) { dec="0"+dec; }
    return dec;
  }
  function byteXOR(a,b) { //accepts two base2 bytes; returns one string length 8, bitwise XOR
    if ((a.length!==8||b.length!==8)||(a.match(/[^0-1]/)||b.match(/[^0-1]/))) { return null; }
    a=a.split("");
    b=b.split("");
    return a.map((e,idx)=>e^b[idx]).join("");
  }

const hexToBin = (hex) => decToBin(hexToDec(hex));
const hexToDec = (hex) => parseInt(hex,16).toString(10);
const binToDec = (bin) => parseInt(bin,2).toString(10);
const hexToText = (hex) => hexByTwo(hex).map(e=>String.fromCharCode(parseInt(e,16).toString(10))).join("");
const shiftRow = (row, n) => n ? row.slice(n).concat(row.slice(0,n)) : row;
const hexXOR = (a,b) => parseInt(byteXOR(hexToBin(a),hexToBin(b)),2).toString(16);
const binToHex = (bin) => parseInt(bin,2).toString(16);
const sBE = `63 7c 77 7b f2 6b 6f c5 30 01 67 2b fe d7 ab 76 ca 82 c9 7d fa 59 47 f0 ad d4 a2 af 9c a4 72 c0 b7 fd 93 26 36 3f f7 cc 34 a5 e5 f1 71 d8 31 15 04 c7 23 c3 18 96 05 9a 07 12 80 e2 eb 27 b2 75 09 83 2c 1a 1b 6e 5a a0 52 3b d6 b3 29 e3 2f 84 53 d1 00 ed 20 fc b1 5b 6a cb be 39 4a 4c 58 cf d0 ef aa fb 43 4d 33 85 45 f9 02 7f 50 3c 9f a8 51 a3 40 8f 92 9d 38 f5 bc b6 da 21 10 ff f3 d2 cd 0c 13 ec 5f 97 44 17 c4 a7 7e 3d 64 5d 19 73 60 81 4f dc 22 2a 90 88 46 ee b8 14 de 5e 0b db e0 32 3a 0a 49 06 24 5c c2 d3 ac 62 91 95 e4 79 e7 c8 37 6d 8d d5 4e a9 6c 56 f4 ea 65 7a ae 08 ba 78 25 2e 1c a6 b4 c6 e8 dd 74 1f 4b bd 8b 8a 70 3e b5 66 48 03 f6 0e 61 35 57 b9 86 c1 1d 9e e1 f8 98 11 69 d9 8e 94 9b 1e 87 e9 ce 55 28 df 8c a1 89 0d bf e6 42 68 41 99 2d 0f b0 54 bb 16`.split(" ")
const sBD = `52 09 6a d5 30 36 a5 38 bf 40 a3 9e 81 f3 d7 fb 7c e3 39 82 9b 2f ff 87 34 8e 43 44 c4 de e9 cb 54 7b 94 32 a6 c2 23 3d ee 4c 95 0b 42 fa c3 4e 08 2e a1 66 28 d9 24 b2 76 5b a2 49 6d 8b d1 25 72 f8 f6 64 86 68 98 16 d4 a4 5c cc 5d 65 b6 92 6c 70 48 50 fd ed b9 da 5e 15 46 57 a7 8d 9d 84 90 d8 ab 00 8c bc d3 0a f7 e4 58 05 b8 b3 45 06 d0 2c 1e 8f ca 3f 0f 02 c1 af bd 03 01 13 8a 6b 3a 91 11 41 4f 67 dc ea 97 f2 cf ce f0 b4 e6 73 96 ac 74 22 e7 ad 35 85 e2 f9 37 e8 1c 75 df 6e 47 f1 1a 71 1d 29 c5 89 6f b7 62 0e aa 18 be 1b fc 56 3e 4b c6 d2 79 20 9a db c0 fe 78 cd 5a f4 1f dd a8 33 88 07 c7 31 b1 12 10 59 27 80 ec 5f 60 51 7f a9 19 b5 4a 0d 2d e5 7a 9f 93 c9 9c ef a0 e0 3b 4d ae 2a f5 b0 c8 eb bb 3c 83 53 99 61 17 2b 04 7e ba 77 d6 26 e1 69 14 63 55 21 0c 7d`.split(" ");
const byteSub = (byte, enc=false) => enc ? sBE[parseInt(byte,16).toString(10)] : sBD[parseInt(byte,16).toString(10)];
const subWord = (word, enc=false) => word.length!==4 ? null : word.map(e=>byteSub(e,enc));
const txtToHex = (txt) => txt.split("").map(e=>hexPad(parseInt(e.charCodeAt(),10).toString(16)));
const hexToTxt = (hex) => String.fromCharCode(parseInt(hex,16).toString(10));
const hexByTwo = (hex) => hex.split("").map((e,idx)=>idx%2===0?hex.slice(idx,idx+2):null).filter(e=>e);
const addRoundKey = (state,rKey) => state.map((e,idx)=>hexXOR(e,rKey[idx]));
const bSub = (state,enc) => state.map(e=>byteSub(e,enc));
const hexPad = (hex) => hex.length===1 ? "0"+hex : hex;
const b64ToHex = (base64) => window.atob(base64).split("").map(e=>hexPad(e.charCodeAt().toString(16))).join("");

let b64="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".split("");
function binTo64(dec) { //converts array of binary strings to b64 with = padding
  let sixSlice=[];
  let b64Res=[];
  let jBin=[];
  let b6=[];
  let lastI=0;
  let lastSixSlice=[];
  let numLastOctets;

  //all but the last octet
  for (var i=0;i<dec.length-2;i+=3) { jBin.push(dec[i].concat(dec[i+1],dec[i+2])); lastI=i+3;}

  //convert each 24-bit string into 4x6bit strings
  for (var i=0;i<jBin.length;i++) {
    sixSlice=[jBin[i].slice(0,6),jBin[i].slice(6,12),jBin[i].slice(12,18),jBin[i].slice(18,24)];
    sixSlice=sixSlice.map(e=>"00"+e); //pad with two leading zero bits before binary conversion
    b64Res=b64Res.concat(sixSlice);
  }
  //if # bytes not divisible by 24 or there are fewer than 24, add padding
  numLastOctets=dec.length%3;
  if (numLastOctets) {
    let lastOct=[];
    for (var i=0;i<numLastOctets;i++) { lastI ? lastOct.push(dec[lastI+i]) : lastOct.push(dec[i]); }
    lastOct=lastOct.join("");
    for (var i=0;i<lastOct.length;i+=6) {
      let cSlice=lastOct.slice(i,i+6);
      if (cSlice.length===6) { lastSixSlice.push(b64[binToDec("00"+cSlice)]); }
      else if (cSlice.length>0) { //pad end until length is 6
        while (cSlice.length<6) { cSlice=cSlice+="0"; }
        lastSixSlice.push(b64[binToDec("00"+cSlice)]);
      }
    }
    while(lastSixSlice.length<4) { lastSixSlice=lastSixSlice.concat('='); }
    lastSixSlice=lastSixSlice.join("");
  }

  let b64Arr=[];
  for (var i=0;i<b64Res.length;i++) { b64Arr.push(binToDec(b64Res[i])); }
  return b64Arr.map(e=>b64[e]).join("")+lastSixSlice;
}

function calcB64(hStr) {
  if (hStr.match(/[^0-9a-f]/gi)%2!==0) { return 'Hex string can only contain characters 0-9 and A-F.'; }
  hStr=hStr.split("");
  if (hStr.length%2!==0) { return 'Hex string must contain an even number of characters'; }
  let arr=[];
  for (var i=0;i<hStr.length;i+=2) { arr.push([hStr[i],hStr[i+1]].join("")); } //base-16 chars
  arr=arr.map(e=>hexToDec(e)); //base-16 to base-10
  arr=arr.map(e=>decToBin(e)); //base-10 to base-2
  arr=binTo64(arr); //3x8 (24-bit) string into 4x6 (24-bit) strings and pad out with two bits
  return arr;
}

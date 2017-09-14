let b64="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".split("");
let hBytes,hBinary,binarySix,binaryPad,intermediates;

function selectors() {
  hBytes=document.querySelector('div#hexBytes');
  hBinary=document.querySelector('div#hexBinary');
  binarySix=document.querySelector('div#binarySix');
  sixS=document.querySelector('div#sixSlice');
  decBin=document.querySelector('div#decBin');
  textInfo=document.querySelector('div#textInfo');
  intermediates=document.querySelectorAll('div.intermediate');
}

function hexToDec(hex) {
  //receives a string len 2 | FF => 255 | 00 => 0
  hex=hex.split("");
  hex=hex.map(e=>e.toUpperCase());
  const nMap=['0','1','2','3','4','5','6','7','8','9','A','B','C','D','E','F'];
  let dec;
  dec=nMap.indexOf(hex[0])*16+nMap.indexOf(hex[1]);
  return dec;
}

function decToBin(dec) { //converts base-10 number to base-2 str with 8 bits
  let binArr=[0,0,0,0,0,0,0,0];
  for (var i=8;i>=0;i--) {
    if (dec>=Math.pow(2,i)) {
      binArr[7-i]=1;
      dec-=Math.pow(2,i);
    }
  }
  return binArr.join("");
}

function binToDec(bin) { //converts base-2 str with 8 bits to base-10 number
  let res=0;
  bin=bin.split("").map(Number);
  for (var i=0;i<bin.length;i++) {
    res+=bin[i]*Math.pow(2,(7-i));
  }
  return res;
}

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
  binarySix.innerHTML=JSON.stringify(jBin); //4. Binary Octets to 24-bit Groups
  sixS.innerHTML=JSON.stringify(b64Res); //5. 24-bit Groups to 6-bit Groups

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
  hBytes.innerHTML=JSON.stringify(arr); //1. Hexstring to Hex Bytes
  arr=arr.map(e=>hexToDec(e)); //base-16 to base-10
  decBin.innerHTML=JSON.stringify(arr); //2. Hex Bytes to Decimal
  arr=arr.map(e=>decToBin(e)); //base-10 to base-2
  hexBinary.innerHTML=JSON.stringify(arr); //3. Decimal to Binary
  arr=binTo64(arr); //3x8 (24-bit) string into 4x6 (24-bit) strings and pad out with two bits
  return arr;
}

function handleInputChange(e) { //recalculate base64 string with updated e.target.value
  result.innerHTML=calcB64(e.target.value);
  let len=e.target.value.length;
  let divis=len%24===0;
  let evenMult = divis ? 'is evenly divisible by 24' : 'is not evenly divisible by 24: note the padding (=) characters!';
  textInfo.innerHTML=`length: ${len}, ${evenMult}`;
}

window.onload=function() {
  selectors();
  let result=document.querySelector('div#result');
  let input=document.querySelector('input#hexString');
  result.innerHTML=calcB64(input.value); //initial calculation
  input.addEventListener('keyup', function(e){handleInputChange(e);});
}

let result,pText,encKey;

function selectors() {
  result=document.querySelector('div#result');
  pText=document.querySelector('input#plainText');
  encKey=document.querySelector('input#encKey');
}

const hexToDec = (hex) => parseInt(hex,16).toString(10);
const binToDec = (bin) => parseInt(bin,2).toString(10);
function decToBin(dec) {
  dec=parseInt(dec,10).toString(2);
  while (dec.length<8) { dec="0"+dec; }
  return dec;
}

function textToBinary(string) {
  return string.split("").map(e=>{
    let bin=parseInt(e.charCodeAt(),10).toString(2);
    while (bin.length<8) { bin="0"+bin; }
    return bin;
  });
}

function swine(a,b) { //returns Hamming distance between two strings a and b
  let dist=0;
  a=textToBinary(a).reduce((a,b)=>a.concat(b));
  b=textToBinary(b).reduce((a,b)=>a.concat(b));
  console.log(a,b,a.length,b.length,'swine');
  //pad the shorter string with zeros until string lengths equal
  //take the longest string and start comparing bits left to right
  //if not the same string or i>index of shorter, then distance++

  //TODO if a.length!=b.length
  for (var i=0;i<a.length;i++) { if (a[i]!==b[i]) { dist+=1; } }
  //distance equals the number of 1s in a XOR b
  return dist;
}

  console.log(swine('this is a tt','wokka wokka!!!'));

function handleInputChange(e) {
  result.innerHTML=repeatXOR(pText.value,encKey.value);
}

function repeatXOR(text,key) {
  let O=textToBinary(text);
  let K=textToBinary(key);
  let XOR=[];
  let intXOR=[];
  for (var i=0;i<O.length;i++) {
    for (var j=0;j<O[i].length;j++) { intXOR.push(O[i][j]^K[i%K.length][j]); }
    XOR.push(intXOR.join(""));
    intXOR=[];
  }
  return XOR.map(e=>{
    let hex=parseInt(e,2).toString(16);
    return hex.length<2 ? "0"+hex : hex;
  }).join("");
}

window.onload=function() {
  selectors();
  pText.addEventListener('keyup', function(e){handleInputChange(e);});
  encKey.addEventListener('keyup', function(e){handleInputChange(e);});
  result.innerHTML=repeatXOR(pText.value,encKey.value);
}

let result,cipher,decryptKey;

const letterScores = {
  ' ':15,
  'e':12.702,
  't':9.056,
  'a':8.167,
  'o':7.507,
  'i':6.966,
  'n':6.749,
  's':6.327,
  'h':6.094,
  'r':5.987,
  'd':4.253,
  'l':4.025,
  'c':2.782,
  'u':2.758,
  'm':2.406,
  'w':2.360,
  'f':2.228,
  'g':2.015,
  'y':1.974,
  'p':1.929,
  'b':1.492,
  'v':0.978,
  'k':0.772,
  'j':0.153,
  'x':0.150,
  'q':0.095,
  'z':0.074
};

const b64cipher=`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`;

function selectors() {
  result=document.querySelector('div#result');
  cipher=document.querySelector('input#base64Cipher');
  decryptKey=document.querySelector('input#decryptKey');
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

function handleInputChange(e) { result.innerHTML=recalcXOR(); }

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

//returns Hamming distance between two strings a and b
//Hamming assumes equal string size
//Levenshtein takes into account different sizes

function hamming(a,b) {
  let dist=0;
  a=a.split("").reduce((a,b)=>a.concat(b));
  b=b.split("").reduce((a,b)=>a.concat(b));
  for (var i=0;i<a.length;i++) { dist+=a[i]^b[i]; }
  return dist;
}

let binaryArr=atob(b64cipher).split("").map(e=>decToBin(e.charCodeAt())).reduce((a,b)=>a.concat(b));

let ham=[];
let one, two;
let runningT=[];
for (var i=2;i<=40;i++) { //try keysizes from 2 thru 40
  for (var j=1;j<binaryArr.length-j*24*i;j+=8*i) {
    one=binaryArr.slice(j*8*i,j*16*i);
    two=binaryArr.slice(j*16*i,j*24*i);
    runningT.push(hamming(one,two)/i);
  }
  runningT=runningT.reduce((a,b)=>a+b,0)/runningT.length;
  ham.push({score:runningT,keysize:i});
  runningT=[];
}
  ham=ham.sort((a,b)=>{
    if (a.score>b.score) { return 1; }
    else if (b.score>a.score) { return -1; }
    else { return 0; }
  }).slice(0,4);

  /*5. Now that you probably know the KEYSIZE: break the
  ciphertext into blocks of KEYSIZE length. KEYSIZE bytes, so
  each block is KEYSIZE*8 long
  */
  let blockSz=ham[0].keysize;
  let blockedBarre=[];
  for (var i=0;i<binaryArr.length;i+=blockSz*8) {
    blockedBarre.push(binaryArr.slice(i,i+blockSz*8));
  }
  //pad out the last block with one 1 & 00z https://en.wikipedia.org/wiki/Padding_(cryptography)#Bit_padding
  blockedBarre[blockedBarre.length-1]=blockedBarre[blockedBarre.length-1]+"1";
  while (blockedBarre[blockedBarre.length-1].length<blockSz*8) {
    blockedBarre[blockedBarre.length-1]=blockedBarre[blockedBarre.length-1]+"0";
  }
  /*6. Now transpose the blocks: make a block that is the first byte of every block,
  and a block that is the second byte of every block, and so on.*/
  let transposedBytes=[];
  let interN=[];
  for (var i=0;i<blockSz;i++) { //loop 29 times
    for (var j=0;j<blockedBarre.length;j++) { //through each block of size 29*8
      //each time take the i-th byte and assemble new array
      interN.push(blockedBarre[j].slice(i*8,i*8+8));
    }
    transposedBytes.push(interN);
    interN=[];
  }

  let keys=[];
  for (var i=0;i<256;i++) { keys.push(decToBin(i)); }

  let theKey=[];
  for (var i=0;i<transposedBytes.length;i++) { theKey.push(guessTheKey(transposedBytes[i])); }
  theKey=theKey.map(e=>String.fromCharCode(e)).join("");

  /*7. Solve each block as if it was single-character XOR. You already have code to do this.
  For each block, the single-byte XOR key that produces the best looking histogram is the
  repeating-key XOR key byte for that block. 8. Put them together and you have the key.*/

  const secret='Terminator X: Bring the noise';

  function recalcXOR() {
    let binaryArr=atob(cipher.value).split("").map(e=>decToBin(e.charCodeAt())).reduce((a,b)=>a.concat(b));
    let bASplit=[];
    for (var i=0;i<binaryArr.length;i+=8) { bASplit.push(binaryArr.slice(i,i+8)); }
    return repeatXOR(bASplit,decryptKey.value);
  }

  function repeatXOR(text,key) {
    let O=text;
    let K=textToBinary(key);
    let XOR=[];
    let intXOR=[];
    for (var i=0;i<O.length;i++) {
      for (var j=0;j<O[i].length;j++) { intXOR.push(O[i][j]^K[i%K.length][j]); }
        XOR.push(intXOR.join(""));
        intXOR=[];
    }
    return XOR.map(e=>String.fromCharCode(parseInt(e,2).toString(10))).join("");
  }

function guessTheKey(cipher) {
  //XOR the strings
  let lastHighScore=0;
  let highestScoringText=null;

  let texts=[];
  let tempText=[];
  let intermediateXOR=[];
  let scoresAndStrings=[];
  let score=0;
  let keyIdx=null;
  //run through each key, XOR every character of the cipher text
  for (var i=0;i<keys.length;i++) {
    for (var j=0;j<cipher.length;j++) {
      for (var k=0;k<cipher[j].length;k++) {
        intermediateXOR=intermediateXOR.concat(cipher[j][k]^keys[i][k]);
      }
      tempText.push(String.fromCharCode(parseInt(intermediateXOR.join(""),2).toString(10)));
      intermediateXOR=[];
    }
    tempText=tempText.join("");
    texts.push(tempText);
    score=freqScoreString(tempText);
    //if this text is higher scoring than previous, store it + its score
    if (score>lastHighScore) {
        lastHighScore=score;
        highestScoringText=tempText;
        keyIdx=i;
    }
    tempText=[];
    score=0;
  }
  //return highest scoring text and the index of that text
  //the index maps 1->1 to the key index, which maps 1->1 to the DECIMAL character
  //convert the decimal index to hex, and there's your cipher byte in base-16.
  return keyIdx;
}

function freqScoreString(string) {
  string=string.toLowerCase("");
  let score=0;
  for (var i=0;i<string.length;i++) { if (letterScores[string[i]]) { score+=letterScores[string[i]]; } }
  return score;
}


window.onload=function() {
  selectors();
  cipher.addEventListener('keyup', function(e){handleInputChange(e);});
  decryptKey.addEventListener('keyup', function(e){handleInputChange(e);});
  result.innerHTML=recalcXOR();
}

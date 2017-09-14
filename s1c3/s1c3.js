let result,input;

function selectors() {
  result=document.querySelector('div#result');
  input=document.querySelector('input#hexString');
  partner=document.querySelector('input#xorPartner');
}

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

const hexToDec = (hex) => parseInt(hex,16).toString(10);
const binToDec = (bin) => parseInt(bin,2).toString(10);
function decToBin(dec) {
  dec=parseInt(dec,10).toString(2);
  while (dec.length<8) { dec="0"+dec; }
  return dec;
}

function guessTheKey(cipher) {
  cipher=cipher.split("");
  let a=[];
  for (var i=0;i<cipher.length;i+=2){a.push(cipher[i].concat(cipher[i+1]));}
  a=a.map(e=>parseInt(e,16).toString(2)).map(e=>{
    while (e.length<8) { e="0"+e; }
    return e;
  });

  //XOR the strings
  let lastHighScore=0;
  let highestScoringText=null;
  let keys=[];
  for (var i=0;i<256;i++) { keys.push(decToBin(i)); }

  let texts=[];
  let tempText=[];
  let intermediateXOR=[];
  let scoresAndStrings=[];
  let score=0;
  //run through each key, XOR every character of the cipher text
  for (var i=0;i<keys.length;i++) {
    for (var j=0;j<a.length;j++) {
      for (var k=0;k<a[j].length;k++) {
        intermediateXOR=intermediateXOR.concat(a[j][k]^keys[i][k]);
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
    }
    tempText=[];
    score=0;
  }
  //return highest scoring text and the index of that text
  //the index maps 1->1 to the key index, which maps 1->1 to the DECIMAL character
  //convert the decimal index to hex, and there's your cipher byte in base-16.
  return `the text: ${highestScoringText}<br />the key: VOULDN'T YOU LIKE TO KNOW?!?!`;
}

function freqScoreString(string) {
  string=string.toLowerCase("");
  let score=0;
  for (var i=0;i<string.length;i++) { if (letterScores[string[i]]) { score+=letterScores[string[i]]; } }
  return score;
}

window.onload=function() {
  selectors();
  result.innerHTML=guessTheKey(input.value); //initial calculation
  input.addEventListener('keyup', function(e){handleInputChange(e);});
}

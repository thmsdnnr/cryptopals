let result,input,partner;

function selectors() {
  result=document.querySelector('div#result');
  input=document.querySelector('input#hexString');
  partner=document.querySelector('input#xorPartner');
}

const hexToDec = (hex) => parseInt(hex,16).toString(10);
const binToDec = (bin) => parseInt(bin,2).toString(10);
function decToBin(dec) {
  dec=parseInt(dec,10).toString(2);
  while (dec.length<8) { dec="0"+dec; }
  return dec;
}

function xorPartnah(first,second) {
  first=first.split("");
  second=second.split("");
  let a=[];
  let b=[];
  for (var i=0;i<first.length;i+=2){a.push(first[i].concat(first[i+1]));}
  for (var i=0;i<second.length;i+=2){b.push(second[i].concat(second[i+1]));}
  a=a.map(e=>parseInt(e,16).toString(2)).map(e=>{
    while (e.length<8) { e="0"+e; }
    return e;
  }).reduce((a,b)=>a.concat(b));
  b=b.map(e=>parseInt(e,16).toString(2)).map(e=>{
    while (e.length<8) { e="0"+e; }
    return e;
  }).reduce((a,b)=>a.concat(b));

  let xR=[];
  let aR=[];
  //XOR the strings
  for (var i=0;i<a.length;i++) { xR.push(a[i]^b[i]); }
  xR=xR.join("");
  for (var i=0;i<xR.length;i+=8) { aR.push(xR.slice(i,i+8)); }
  //convert XOR result back to hexadecimal
  aR=aR.map(e=>parseInt(e,2).toString(16)).join("");
  return aR;
}

function handleInputChange(e) {
  result.innerHTML=xorPartnah(input.value,partner.value);
}

window.onload=function() {
  selectors();
  result.innerHTML=xorPartnah(input.value,partner.value); //initial calculation
  input.addEventListener('keyup', function(e){handleInputChange(e);});
  partner.addEventListener('keyup', function(e){handleInputChange(e);});
}

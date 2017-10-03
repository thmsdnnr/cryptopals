function lilEndian(number) {
      //returns quadword number in little endian, hexadecimal representation
      if (!Number.isInteger(number)||number>Number.MAX_SAFE_INTEGER) { throw new Error('Whoa nelly, can\'t convert that!'); }
      //max safe is 9007199254740991
      let arrResult=[];
      let temp;
      for (var i=63;i>=0;i--) { //64 bits
        if (number>=Math.pow(2,i)) {
          temp=Math.floor(number/Math.pow(2,i));
          arrResult.unshift(temp);
          number-=temp*Math.pow(2,i);
        } else { arrResult.unshift(0); }
      }
      arrResult=arrResult.map((e,idx)=>idx%8==0?arrResult.slice(idx,idx+8):null).filter(e=>e);
      //we have to reverse because parseInt is big endian but we store the bits little endian
      arrResult=arrResult.map(e=>hexPad(parseInt(e.reverse().join(""),2).toString(16)));
      return arrResult;
    }

var Counter = {
  nonce: null,
  count: null,
  next: function() { //returns next 16 bytes
    if (!this.nonce) { throw new Error('You must set a nonce with setNonce()!'); }
    this.count!==null ? this.count++ : this.count=0;
    return this.nonce.concat(lilEndian(this.count));
  },
  setNonce: function(n) {
    if (this.nonce) { throw new Error('Nonces are immutable. Create another counter.');}
    this.nonce=lilEndian(n);
  }
};

let result,cipher,encKey,plainText,aE,aD,cBits,padInfo,tHelp,inputType,nonce,nonceHelper;
function process(act) {
  let key=encKey.value;
  let pT=plainText.value;
  let N=Number(nonce.value);
  let bits=Number(cBits.selectedOptions[0].value);
  let typeOfText=inputType.selectedOptions[0].value; //text, hex, base64
  let I; //converted input to encrypt or decrypt function
  if (typeOfText==='text') { //pad using PKCS7
    if (act==='encrypt') { I=pT.split("").map(e=>parseInt(e.charCodeAt(),10).toString(16)); }
    else {
      textHelper.innerHTML='';
      textHelper.innerHTML='<h3>Sorry, you can\'t decrypt plaintext. Perhaps you meant base-64?.</h3>';
      return false;
    }
  }
  else if (typeOfText==='hex') {
    textHelper.innerHTML='';
    if (pT.match(/[0-9a-f]/gi)&&pT.length%2===0) {
      if (act==='encrypt') { I=hexByTwo(pT); }
      else { I=hexByTwo(pT); }
    }
    else {
      textHelper.innerHTML='<h3>Sorry, that is invalid hexadecimal.<br />Please make sure each character is padded, e.g., 0x0F should be entered as "0F", not "F".</h3>';
      return false;
    }
  }
  else { //base-64
    if (pT.match(/^([0-9a-z+/]{4})*(([0-9a-z+/]{2}==)|([0-9a-z+/]{3}=))?$/i)&&pT.length>=16) {
      I=hexByTwo(b64ToHex(pT));
    }
    else {
      textHelper.innerHTML='<h3>Sorry, that is invalid base64. Try again!</h3>';
      return false;
    }
  }
  key=key.split("").map(e=>parseInt(e.charCodeAt(),10).toString(16));
  let keyCeil=bits*Math.floor(key.length/bits)+bits;
  if (key.length%bits!==0&&key.length<bits) { key=padToN(key,keyCeil,'30'); }
  else { key=key.slice(0,bits); }
  //nonce validation
  if (!String(N).length) {
    nonceHelper.innerHTML='<h3>No nonce specified. Defaulting to 0.</h3>'
    N=0;
  }
  else if (String(N).match(/[^0-9]/gi)||N>Number.MAX_SAFE_INTEGER) {
    nonceHelper.innerHTML=`<h3>Invalid nonce.<br />Must be numeric values 0 through 9 only, value less than ${Number.MAX_SAFE_INTEGER}.</h3>`
    return false;
  }
  nonceHelper.innerHTML='';
  //encrypt or decrypt
  let Z, dataText;
  let ctr=Object.create(Counter);
  ctr.setNonce(N);
  let res=[];
  let keyStream=aesEncryptECB(ctr.next(),key,bits);
  for (var i=0;i<I.length;i+=16) {
    let block=I.slice(i,i+16);
    let next=ctr.next();
    res=res.concat(addRoundKey(block,keyStream));
    keyStream=aesEncryptECB(next,key,bits);
  }
  Z=res.map(hexToTxt).join("");

  if (act==='encrypt') {
    dataText=`<b>${act} results:</b><br />${Z}<br />
    <b>base64:</b><br />${calcB64(txtToHex(Z).join(""))}`;
  }
  else {
    dataText=`<b>${act} results in hex:</b><br />${txtToHex(Z).join("")}<br />
    <b>base64:</b><br />${calcB64(txtToHex(Z).join(""))}<br />
    <b>ASCII:</b><br />${Z}`;
  }
  //display the data
  padInfo.innerHTML=`<b>padded input (length ${I.length}):</b><br />${I.join("")}<br />
  <b>padded and/or truncated key (length ${key.length}):</b><br />${hexToText(key.join(""))}<br />
  <b>hex key:</b> ${key.join("")}`;
  result.innerHTML=dataText;
}

function handleInputChange(e) {
  let act=e.target.id;
  if (act==='encrypt'||act==='decrypt') { process(act); }
  if (act==='suite') { //toggle test suite display
    sweetDiv.style.display==='none' ? sweetDiv.style.display='block' : sweetDiv.style.display='none';
  }
}

window.onload=function() {
  selectors();
  listeners();
  process('decrypt');
};

function selectors() {
  result=document.querySelector('div#result');
  encKey=document.querySelector('input#encKey');
  plainText=document.querySelector('input#plainText');
  aE=document.querySelector('button#encrypt');
  aD=document.querySelector('button#decrypt');
  cBits=document.querySelector('select#bits');
  padInfo=document.querySelector('div#padInfo');
  tHelp=document.querySelector('div#textHelper');
  inputType=document.querySelector('select#inputType');
  nonce=document.querySelector('input#nonce');
  nonceHelper=document.querySelector('div#nonceHelper');
}

function listeners() {
  aE.addEventListener('click', function(e){handleInputChange(e);});
  aD.addEventListener('click', function(e){handleInputChange(e);});
}

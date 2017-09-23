  let result,cipher,encKey,plainText,aE,aD,cBits,padInfo,sweetDiv,tHelp,inputType;
  function process(act) {
    let key=encKey.value;
    let pT=plainText.value;
    let bits=Number(cBits.selectedOptions[0].value);
    let typeOfText=inputType.selectedOptions[0].value; //text, hex, base64
    let I; //converted input to encrypt or decrypt function
    if (typeOfText==='text') { //pad using PKCS7
      if (act==='encrypt') { I=PKCS7(pT.split("").map(e=>parseInt(e.charCodeAt(),10).toString(16)),16); }
      else {
        textHelper.innerHTML='';
        textHelper.innerHTML='<h3>Sorry, you can\'t decrypt plaintext. Perhaps you meant base-64?.</h3>';
        return false;
      }
    }
    else if (typeOfText==='hex') {
      textHelper.innerHTML='';
      if (pT.match(/[0-9a-f]/gi)&&pT.length%2===0) {
        if (act==='encrypt') { I=PKCS7(hexByTwo(pT),16); }
        else { I=hexByTwo(pT); }
      }
      else {
        textHelper.innerHTML='<h3>Sorry, that is invalid hexadecimal.<br />Please make sure each character is padded, e.g., 0x0F should be entered as "0F", not "F".</h3>';
        return false;
      }
    }
    else { //base-64
      if (pT.match(/^([0-9a-z+/]{4})*(([0-9a-z+/]{2}==)|([0-9a-z+/]{3}=))?$/i)&&pT.length>=16) {
        if (act==='encrypt') { I=PKCS7(hexByTwo(b64ToHex(pT)),16); }
        else { I=hexByTwo(b64ToHex(pT)); }
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
    //encrypt or decrypt
    let Z, dataText;
    if (act==='encrypt') {
      Z=aesEncryptECB(I,key,bits);
      dataText=`<b>${act} results in hex:</b><br />${Z.join("").toUpperCase()}<br />
      <b>base64:</b><br />${calcB64(Z.join(""))}`;
    }
    else {
      Z=aesDecryptECB(I,key,bits);
      let readable=Z.map(e=>String.fromCharCode(parseInt(e,16).toString(10))).join("");
      dataText=`<b>${act} results in hex:</b><br />${Z.join("").toUpperCase()}<br />
      <b>base64:</b><br />${calcB64(Z.join(""))}<br />
      <b>ASCII:</b><br />${readable}`;
    }
    //display the data
    padInfo.innerHTML=`<b>padded input (length ${I.length}):</b><br />${I.join("")}<br />
    <b>padded and/or truncated key (length ${key.length}):</b><br />${hexToText(key.join(""))}`;
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
    process('encrypt');
  };

  function selectors() {
    result=document.querySelector('div#result');
    encKey=document.querySelector('input#encKey');
    plainText=document.querySelector('input#plainText');
    aE=document.querySelector('button#encrypt');
    aD=document.querySelector('button#decrypt');
    cBits=document.querySelector('select#bits');
    padInfo=document.querySelector('div#padInfo');
    sweet=document.querySelector('button#suite');
    sweetDiv=document.querySelector('div#suiteContainer');
    tHelp=document.querySelector('div#textHelper');
    inputType=document.querySelector('select#inputType');
  }

  function listeners() {
    aE.addEventListener('click', function(e){handleInputChange(e);});
    aD.addEventListener('click', function(e){handleInputChange(e);});
    sweet.addEventListener('click', function(e){handleInputChange(e);});
  }

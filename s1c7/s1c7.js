//-->Encryption and Decryption Main Functions<--
  function aesEncryptECB(plainText, key, numBits) {
    if (!plainText||plainText.length%16!==0) { throw new Error('Block size is not an even multiple of 16.'); }
    else if (!key||key.length!==numBits) { throw new Error(`Key size is not an even multiple of ${numBits}.`); }
    const numRounds = { '16':9,'24':11,'32':13 };
    if (!numRounds[numBits]) { return null; }
    let totalRounds = numRounds[numBits];
    let expKey=generateExpandedKey(key,numBits);
    let currentState=[];
    for (var i=0;i<plainText.length;i+=16) { //block feeder
      let curKey=expKey.slice(0,16);
      let cur=plainText.slice(i,i+16);
      cur=addRoundKey(cur,curKey);
      currentState.push(processBlock(cur));
    }
      function processBlock(block) {
        let curKey=expKey.slice(0,16);
        for (var i=0;i<totalRounds+1;i++) {
          curKey=expKey.slice(i*16+16,i*16+2*16);
          if (i<totalRounds) {  block=addRoundKey(mixColumns(sRow(bSub(block,true),true),true),curKey); }
          else {  block=addRoundKey(mToBytes(sRow(bSub(block,true),true)),curKey);  }
        }
        return block;
      }
    return flattenArray(currentState).map(e=>hexPad(e));
  }

  function aesDecryptECB(cipherText, key, numBits) {
    if (!cipherText||cipherText.length%16!==0) { throw new Error('Block size is not an even multiple of 16.'); }
    else if (!key||key.length!==numBits) { throw new Error(`Key size is not an even multiple of ${numBits}.`); }
    const numRounds = { '16':9,'24':11,'32':13 };
    if (!numRounds[numBits]) { return null; }
    let totalRounds = numRounds[numBits];
    let expKey=generateExpandedKey(key,numBits);
    let currentState=[];
    for (var i=0;i<cipherText.length;i+=16) {
      let curKey=expKey.slice(expKey.length-16);
      let cur=cipherText.slice(i,i+16);
      cur=bSub(mToBytes(sRow(addRoundKey(cur,curKey),false)),false);
      currentState.push(processBlock(cur));
    }
      function processBlock(block) {
        for (var i=0;i<totalRounds+1;i++) {
          curKey=expKey.slice(expKey.length-(i*16+16*2),expKey.length-(i*16+16));
          if (i<totalRounds) {
            block=bSub(mToBytes(sRow(mixColumns(bytesToM(addRoundKey(block,curKey)),false),false)),false);
          } else { block=addRoundKey(block,curKey); }
        }
        return block;
      }
    return flattenArray(currentState).map(e=>hexPad(e));;
  }

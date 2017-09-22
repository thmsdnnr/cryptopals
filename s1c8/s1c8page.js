  let result,plainText,blockSz,go;

  function rC() {
    let R=Math.floor(Math.random()*256);
    let G=Math.floor(Math.random()*256);
    let B=Math.floor(Math.random()*256);
    return `rgba(${R},${G},${B},0.4)`;
  }

  function highlightSpecified(txt,indices) {
    Object.keys(indices).forEach(idx=>{
      var re = new RegExp('('+idx+')(?![,[0-9]]{0,3})',"g");
      txt=txt.replace(re, `<span style="background-color:${rC()}">$1</span>`);
    });
    return txt;
  }

  function blockChunk(txt,sZ) {
    if (sZ<2) { return null; }
    txt=txt.split("");
    let blocks=[];
    let rep=[];
    for (var i=0;i<txt.length;i+=sZ) { blocks.push(txt.slice(i,i+sZ).join("")); }
    for (var i=0;i<blocks.length;i++) {
      let lIdx=blocks.lastIndexOf(blocks[i])
      if (i!==lIdx) { rep[blocks[i]] ? rep[blocks[i]].push(i) : rep[blocks[i]]=[i]; }
    }
    Object.keys(rep).forEach(key=>{ rep[key].push(blocks.lastIndexOf(key)); });
    return rep;
  }

  function process() {
    let blockLen=Number(blockSz.value);
    let pT=plainText.value;
    if (blockLen>1&&blockLen<pT.length) {
      let res=highlightSpecified(pT,blockChunk(pT,blockLen));
      result.innerHTML=res;
    }
  }

  window.onload=function() {
    selectors();
    listeners();
    process();
  };

  function selectors() {
    result=document.querySelector('div#result');
    plainText=document.querySelector('input#plainText');
    blockSz=document.querySelector('input#blockSz');
    go=document.querySelector('button#go');
  }

  function listeners() {
    go.addEventListener('click', ()=>process());
  }

window.onload = function () {
  let res=document.querySelector('div#result');
  var worker = new Worker('decryptTask.js');
  worker.addEventListener('message', function(e) {
    if (e.data.type=='intermediate') { res.innerHTML=`${e.data.prev.join("")}<br />${e.data.msg}`; }
    else if (e.data.type=='final') { res.innerHTML=`
      <p><span style="color:#006F6B">${e.data.msg}</span></p>
      <b>b64 message:</b> ${e.data.random.rT}<br />
      <b>random key:</b> ${e.data.random.rKey.join("")}<br />
      <b>random IV:</b> ${e.data.random.rIV.join("")}<br />
      <b>plaintext:</b> ${e.data.random.pT}`; }
  });
  worker.postMessage('gogogo');
};

window.onload = function () {
  let res=document.querySelector('div#result');
  var worker = new Worker('decryptTask.js');
  worker.addEventListener('message', function(e) {
    e.data.res=e.data.res.replace(/\n/g,'<br />');
    if (e.data.type=='intermediate') { res.innerHTML=e.data.res; }
    else { res.innerHTML=`<span style="color:#006F6B">${e.data.res}</span>`; }
  });
  worker.postMessage('gogogo');
};

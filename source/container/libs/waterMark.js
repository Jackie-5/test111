
export default (function createWM(optionsParam) {
  const options =  Object.assign({
    container: window.document.body,
    width: 300,
    height: 200,
    textAlign: 'center',
    textBaseline: 'middle',
    font: '16px Microsoft Yahei',
    fillStyle: 'rgba(184, 184, 184, 0.3)',
    rotate: -30,
    content: '请勿外传',
    zIndex: 1999,
  }, optionsParam);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  // canvas.setAttribute('width', options.width + 'px');
  // canvas.setAttribute('height', options.height + 'px');
  canvas.width = options.width * 2;
  canvas.height = options.height * 2;
  canvas.style.width = options.width + 'px';
  canvas.style.height = options.height + 'px';
  if (ctx) {
    ctx.scale(2, 2);
    ctx.textAlign = options.textAlign;
    ctx.textBaseline = options.textBaseline;
    ctx.font = options.font;
    ctx.fillStyle = options.fillStyle;
    ctx.translate(parseFloat(options.width + '') / 2, parseFloat(options.height + '') / 2);
    ctx.rotate(options.rotate * Math.PI / 180);
    ctx.translate(-parseFloat(options.width + '') / 2, -parseFloat(options.height + '') / 2);
    ctx.fillText(options.content, parseFloat(options.width + '') / 2, parseFloat(options.height + '') / 2);
    const base64Url = canvas.toDataURL();
    const wm = document.querySelector('.__wm');
    const watermarkDiv = wm || document.createElement('div');

    const styleStr = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: ${options.zIndex};
      pointer-events: none;
      background-repeat: repeat;
      background-size: ${options.width}px ${options.height}px;
      background-image: url('${base64Url}');
    `;

    watermarkDiv.setAttribute('style', styleStr);
    watermarkDiv.classList.add('__wm');
    if (!wm) {
      options.container.appendChild(watermarkDiv);
    }

    if (MutationObserver) {
      let mo = new MutationObserver(() => {
        const wmInner = document.querySelector('.__wm');
        if (
          (wmInner && wmInner.getAttribute('style') !== styleStr)
          || !wmInner
        ) {
          mo.disconnect();
          mo = null;
          createWM(options);
        }
      });

      mo.observe(options.container, {
        attributes: true,
        subtree: true,
        childList: true,
      });
    }
  }
})();



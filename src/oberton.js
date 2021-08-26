function closePromoDialog() {
  this.promoDialog.removeEventListener('click', this.onPromoDialogClick);
  this.promoDialog.remove();
}

function onPromoDialogClick(e) {
  if (e.target.closest('[data-close]')) {
    this.closePromoDialog();
    return;
  }

  if (e.target.closest('[data-content]')) {
    return;
  }

  this.closePromoDialog();
}

function throwError(error) {
  const callbacks = this.callbacks.error;
  callbacks.forEach(cb => cb(error));
}

function displayPromoDialog() {
  if (this.extensionExists) {
    return;
  }

  if (this.config.skipPromoDialog) {
    this.throwError(new Error('extension is not installed'));
    return;
  }

  this.promoDialog = document.createElement('div');
  this.promoDialog.style = 'position: fixed; top: 0; left: 0; right: 0; bottom: 0; background-color: rgba(63, 81, 181, 0.7); z-index: 1000; box-sizing: border-box;';

  const baseFont = `-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif`;

  this.promoDialog.innerHTML = `<div style='display: table; width: 100%; height: 100%;'>
    <div style='display: table-cell; width: 100%; height: 100%; text-align: center; vertical-align: middle;'>
      <div style='text-align: left; background: white; display: inline-block; padding: 25px; width: 480px; border-radius: 4px; max-width: 80%; font-family: ${baseFont};'>
        <div>
          <div style='float: right; cursor: pointer;' data-close='true'>
            &times;
          </div>
          <div>
            You have to install Oberton Chrome Extension
          </div>
        </div>
        <div style='text-align: center; padding-top: 40px;' data-content='true'>
          <a target='_blank' href='https://chrome.google.com/webstore/detail/oberton-chrome-freeton-ex/emdkjliaadghhnaanlbpdgmddbjlmhpi'>
            <img alt='Available in Chrome Web Store' src='https://storage.googleapis.com/chrome-gcs-uploader.appspot.com/image/WlD8wC6g8khYWPJUsQceQkhXSlv1/mPGKYBIR2uCP0ApchDXE.png' alt='' />
          </a>
        </div>
      </div>
    </div>
  </div>`;

  this.promoDialog.addEventListener('click', this.onPromoDialogClick);

  document.body.appendChild(this.promoDialog);
}

function sendTokens(params = {}) {

  if (!this.active) {
    throw new Error('failed to call sendTokens method on destroyed object');
  }

  const event = new CustomEvent('@oberton/callObertonFunction', {
    detail: {
      fn: 'sendTokens',
      apiId: this.sessionId,
      params,
    },
  });

  window.dispatchEvent(event);

  setTimeout(this.displayPromoDialog, 500);
}

function destroy() {
  this.active = false;
  this.network = null;
  window.removeEventListener('@oberton/extensionResponse', this.onExtensionResponse);
}

function onExtensionResponse(e) {
  const detail = e.detail;

  if (e.detail.appId !== this.sessionId) {
    return;
  }

  const { subject, value } = detail;

  this.callbacks.response.forEach(cb => cb({subject, detail}));

  if (detail.subject === 'extensionExists' && detail.value) {
    this.extensionExists = true;
  } else if (detail.subject === 'transactionSent') {
    this.callbacks.transactionSent.forEach(cb => cb(value));
  } else if (detail.subject === 'transactionFailed') {
    this.callbacks.transactionFailed.forEach(cb => cb(value));
    this.callbacks.error.forEach(cb => cb(value.error));
  }

}

function on(evName, cb) {
  if (!this.callbacks[evName]) {
    throw new Error(`Unknown event ${evName}, supported events are [${Object.keys(this.callbacks).join(', ')}]`);
  }
  this.callbacks[evName].push(cb);
  return this;
}

function init(network = 'net.ton.dev', config = {}) {

  this.network = network;
  this.active = true;
  this.extensionExists = false;
  this.config = config;
  this.sessionId = Math.random().toString(36).substring(2);

  this.callbacks = {
    error: [],
    response: [],
    transactionSent: [],
    transactionFailed: [],
  };

  this.destroy = destroy.bind(this);
  this.sendTokens = sendTokens.bind(this);
  this.onExtensionResponse = onExtensionResponse.bind(this);
  this.displayPromoDialog = displayPromoDialog.bind(this);
  this.onPromoDialogClick = onPromoDialogClick.bind(this);
  this.closePromoDialog = closePromoDialog.bind(this);
  this.throwError = throwError.bind(this);
  this.on = on.bind(this);

  window.addEventListener('@oberton/extensionResponse', this.onExtensionResponse);

  return this.sessionId;
}

export default init;

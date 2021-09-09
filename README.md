# chrome_freeton_extension_js_sdk

more info [sdk.oberton.io](https://sdk.oberton.io)

You can use CDN script

`<script src="https://cdn.jsdelivr.net/npm/@oberton/sdk@1.0.7/docs/index.js"></script>`

or run

`npm install @oberton/sdk`


```
import Oberton from '@oberton/sdk';

const oberton = new Oberton();

// EVENTS

oberton

  /* extension is not installed or unreacheable
   * or transaction failed to sent */
  .on('error', (data) => console.log('error', data))

  /* transaction has been sent */
  .on('transactionSent', (data) => console.log('transactionSent', data)) // transactionSent, provides details from the @tonclient SDK

  /* transaction failed */
  .on('transactionFailed', (data) => console.log('transactionFailed', data))

  /* any response from an extension, included errors and transactions events */
  .on('response', (data) => console.log('response', data));


// SEND TOKENS

oberton.sendTokens({
  to: '0:4b0cc91b506e5cff29eb1cb64f0b543e0d15ac6e3a3743ec462a711abbc7aa36',
  amount: 0.5,
  payloadType: 'comment',
  comment: 'Hello World2',
});
```

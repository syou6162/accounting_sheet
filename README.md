# これは何?
家庭用の清算botです。Google App Script上で動き、slackから入力ができます。

# 必要な変数の設定
対応するGoogle App Scriptのファイルを開いて、File => Project propeties => Script propetiesに行き、以下のPropetyを設定しましょう。

- SPREADSHEET_URL
- SLACK_VERIFY_TOKEN
- BOT_NAME
- SLACK_TOKEN

# どうやったらbotは更新できる?
手元で以下のコマンドを実行させると、typescriptからjavascriptへのコンパイル、Google App Scriptへのアップロードができます。

```
npm run publish
```

その後、対応するGoogle App Scriptのファイルを再度開いて、Publish => Deploy as web appから新しいバージョンのweb appとしてデプロイしましょう。

# See also
- [家庭用の清算君(Slack bot)をGoogle App Scriptで書いた + TypeScript化した - yasuhisa's blog](http://www.yasuhisay.info/entry/2017/03/20/213000)
- [TypeScript で Google Apps Script を書く環境を整備する · Hori Blog](https://hori-ryota.com/blog/googleappsscript-by-typescript/)
- [Google Apps Scriptの開発をモダンに行う方法 - Speee DEVELOPER BLOG](http://tech.speee.jp/entry/2016/04/28/190236)

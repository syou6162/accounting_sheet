import Spreadsheet = GoogleAppsScript.Spreadsheet.Spreadsheet;
declare var SlackApp: any;

class Purchase {
  user_name: string;
  yen: number;
  content: string;
  date: Date;
  constructor(user_name: string, yen: number, content: string) {
    this.user_name = user_name;
    this.yen = yen;
    this.content = content;
    this.date = new Date();
  }
}

class IncommingParameter {
  user_name: string;
  text: string;
  token: string;
  constructor(user_name: string, text: string, token: string) {
    this.user_name = user_name;
    this.text = text;
    this.token = token;
  }
}

function parseLine(line: string): [number, string] {
  let lineRegex = /^(\d+):\s?(.*?)$/mg;
  let match = lineRegex.exec(line);
  let yen = parseInt(match![1]);
  let content = match![2];
  return [yen, content];
}

class AccountingSheet {
  slackVerifyToken: string;
  spreadsheetUrl: string;
  spreadsheet: Spreadsheet;
  private slackToken: string;
  private botName: string;

  init(): void {
    this.slackVerifyToken = PropertiesService.getScriptProperties().getProperty("SLACK_VERIFY_TOKEN");
    this.spreadsheetUrl = PropertiesService.getScriptProperties().getProperty("SPREADSHEET_URL");
    this.spreadsheet = SpreadsheetApp.openByUrl(this.spreadsheetUrl);
    this.slackToken = PropertiesService.getScriptProperties().getProperty("SLACK_TOKEN");
    this.botName = PropertiesService.getScriptProperties().getProperty("BOT_NAME");
  }

  slackParam2IncommingParameter(slackParam: any): IncommingParameter {
    return new IncommingParameter(slackParam.parameter.user_name, slackParam.parameter.text, slackParam.parameter.token);
  }

  doPost(slackParam: any) {
    this.init();
    let p = this.slackParam2IncommingParameter(slackParam);
    if (this.slackVerifyToken != p.token) {
      throw new Error("invalid token.");
    }
    let message: string = p.text;
    let [yen, content] = parseLine(message);
    let purchase = new Purchase(p.user_name, yen, content);
    this.writeCell(purchase);
    let app = SlackApp.create(this.slackToken);
    let sendMessage: string = purchase.content + "(" + purchase.yen + "円)を受け付けました。修正するには " + this.spreadsheetUrl + " を開いてください";
    app.chatPostMessage("payment_demand", sendMessage, {username: this.botName});
  }

  writeCell(purchase: Purchase): void {
    let sheet = this.spreadsheet.getSheetByName("Sheet1");
    let lastRow = sheet.getLastRow();
    for (let i = lastRow; i >= 1; i--) {
      if (sheet.getRange(i, 1).getValue() != '') {
        sheet.getRange(i + 1, 1).setValue(purchase.user_name);
        sheet.getRange(i + 1, 2).setValue(purchase.date);
        sheet.getRange(i + 1, 3).setValue(purchase.content);
        sheet.getRange(i + 1, 4).setValue(purchase.yen);
        break;
      }
    }
  }
}

function doPost(slackParam: any) {
  let accountingSheet = new AccountingSheet;
  accountingSheet.init();
  accountingSheet.doPost(slackParam);
}

function init() {
  let accountingSheet = new AccountingSheet;
  accountingSheet.init();
  let token = PropertiesService.getScriptProperties().getProperty("SLACK_VERIFY_TOKEN")
  let slackParam = {
    parameter: {
      user_name: "test_user",
      text: "111: test",
      token: token
    }
  };
  accountingSheet.doPost(slackParam);
}

const invoice = require("../../data/invoices.json");
const plays = require("../../data/plays.json");

const createStatementData = require("./createStatementData.js");

function renderPlainText(data) {
  function usd(targetNumber) {
    return new Intl.NumberFormat("en-US",
                        { style: "currency", currency: "USD",
                          minimumFractionDigits: 2 }).format(targetNumber/100);
  }

  let result = `Statement for ${data.customer}\n`;
  for (let perf of data.performances) {
    // 注文の内訳を出力
    result += ` ${perf.play.name}: ${usd(perf.amount)} (${perf.audience} seats)\n`;
  }
  result += `Amount owed is ${usd(data.totalAmount)}\n`;
  result += `You earned ${data.totalVolumeCredits} credits\n`;
  return result;
}

function statement(invoice, plays) {
  return renderPlainText(createStatementData(invoice, plays));
}

const result = statement(invoice, plays);
console.log(result);

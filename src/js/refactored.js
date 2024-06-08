const invoice = require("../data/invoices.json");
const plays = require("../data/plays.json");

function statement(invoice, plays) {
  let result = `Statement for ${invoice.customer}\n`;

  function playFor(performance) {
    return plays[performance.playID];
  }

  function amountFor(performance) {
    let result = 0;
    switch (playFor(performance).type) {
      case "tragedy":
        result = 40000;
        if (performance.audience > 30) {
          result += 1000 * (performance.audience - 30);
        }
        break;
      case "comedy":
        result = 30000;
        if (performance.audience > 20) {
          result += 10000 + 500 * (performance.audience - 20);
        }
        result += 300 * performance.audience;
        break;
      default:
        throw new Error (`unknown type: ${playFor(performance).type}`);
    }

    return result;
  }

  function totalAmount() {
    let totalAmount = 0;
    for (let perf of invoice.performances) {
      totalAmount += amountFor(perf);
    }

    return totalAmount;
  }

  function volumeCreditsFor(performance) {
    let result = 0;
    result += Math.max(performance.audience - 30, 0) ;
    if ("comedy" === playFor(performance).type) result += Math.floor(performance.audience / 5);

    return result;
  }

  function totalVolumeCredits() {
    let volumeCredits = 0;
    for (let perf of invoice.performances) {
      volumeCredits += volumeCreditsFor(perf);
    }

    return volumeCredits;
  }

  function usd(targetNumber) {
    return new Intl.NumberFormat("en-US",
                        { style: "currency", currency: "USD",
                          minimumFractionDigits: 2 }).format(targetNumber/100);
  }

  for (let perf of invoice.performances) {
    // 注文の内訳を出力
    result += ` ${playFor(perf).name}: ${usd(amountFor(perf))} (${perf.audience} seats)\n`;
  }
  result += `Amount owed is ${usd(totalAmount())}\n`;
  result += `You earned ${totalVolumeCredits()} credits\n`;
  return result;
}

const result = statement(invoice, plays);
console.log(result);

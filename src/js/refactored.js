const invoice = require("../data/invoices.json");
const plays = require("../data/plays.json");

function renderPlainText(data) {
  function totalAmount() {
    let result = 0;
    for (let perf of data.performances) {
      result += perf.amount;
    }

    return result;
  }

  function volumeCreditsFor(performance) {
    let result = 0;
    result += Math.max(performance.audience - 30, 0) ;
    if ("comedy" === performance.play.type) result += Math.floor(performance.audience / 5);

    return result;
  }

  function totalVolumeCredits() {
    let result = 0;
    for (let perf of data.performances) {
      result += volumeCreditsFor(perf);
    }

    return result;
  }

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
  result += `Amount owed is ${usd(totalAmount())}\n`;
  result += `You earned ${totalVolumeCredits()} credits\n`;
  return result;
}

function statement(invoice, plays) {
  function playFor(performance) {
    return plays[performance.playID];
  }
  function amountFor(performance) {
    let result = 0;
    switch (performance.play.type) {
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
        throw new Error (`unknown type: ${performance.play.type}`);
    }

    return result;
  }
  function volumeCreditsFor(performance) {
    let result = 0;
    result += Math.max(performance.audience - 30, 0) ;
    if ("comedy" === performance.play.type) result += Math.floor(performance.audience / 5);

    return result;
  }

  const statementData = {
    customer: invoice.customer,
    performances: invoice.performances.map(perf => {
      const result = {...perf};
      result.play = playFor(result);
      result.amount = amountFor(result);
      result.volumeCredits = volumeCreditsFor(result);
      return result;
    }),
  };
  return renderPlainText(statementData);
}

const result = statement(invoice, plays);
console.log(result);

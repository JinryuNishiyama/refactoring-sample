module.exports = function createStatementData(invoice, plays) {
  function playFor(performance) {
    return plays[performance.playID];
  }
  function totalAmount(data) {
    return data.performances.reduce((total, p) => total + p.amount, 0);
  }
  function volumeCreditsFor(performance) {
    let result = 0;
    result += Math.max(performance.audience - 30, 0) ;
    if ("comedy" === performance.play.type) result += Math.floor(performance.audience / 5);

    return result;
  }
  function totalVolumeCredits(data) {
    return data.performances.reduce((total, p) => total + p.volumeCredits, 0);
  }

  const statementData = {
    customer: invoice.customer,
    performances: invoice.performances.map(perf => {
      const calculator = new PerformanceCalculator(perf, playFor(perf));
      const result = {...perf};
      result.play = calculator.play;
      result.amount = calculator.amount;
      result.volumeCredits = volumeCreditsFor(result);
      return result;
    }),
  };
  statementData.totalAmount = totalAmount(statementData);
  statementData.totalVolumeCredits = totalVolumeCredits(statementData);
  return statementData;
}

class PerformanceCalculator {
  constructor(performance, play) {
    this.performance = performance;
    this.play = play;
  }

  get amount() {
    let result = 0;
    switch (this.play.type) {
      case "tragedy":
        result = 40000;
        if (this.performance.audience > 30) {
          result += 1000 * (this.performance.audience - 30);
        }
        break;
      case "comedy":
        result = 30000;
        if (this.performance.audience > 20) {
          result += 10000 + 500 * (this.performance.audience - 20);
        }
        result += 300 * this.performance.audience;
        break;
      default:
        throw new Error (`unknown type: ${this.play.type}`);
    }

    return result;
  }

  get volumeCredits() {
    let result = 0;
    result += Math.max(this.performance.audience - 30, 0) ;
    if ("comedy" === this.play.type) result += Math.floor(this.performance.audience / 5);

    return result;
  }
}

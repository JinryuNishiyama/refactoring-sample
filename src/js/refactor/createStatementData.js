module.exports = function createStatementData(invoice, plays) {
  function playFor(performance) {
    return plays[performance.playID];
  }
  function totalAmount(data) {
    return data.performances.reduce((total, p) => total + p.amount, 0);
  }
  function totalVolumeCredits(data) {
    return data.performances.reduce((total, p) => total + p.volumeCredits, 0);
  }

  const statementData = {
    customer: invoice.customer,
    performances: invoice.performances.map(perf => {
      const calculator = createPerformanceCalculator(perf, playFor(perf));
      const result = {...perf};
      result.play = calculator.play;
      result.amount = calculator.amount;
      result.volumeCredits = calculator.volumeCredits;
      return result;
    }),
  };
  statementData.totalAmount = totalAmount(statementData);
  statementData.totalVolumeCredits = totalVolumeCredits(statementData);
  return statementData;
}

function createPerformanceCalculator(performance, play) {
  switch(play.type) {
    case "tragedy":
      return new TragedyCalculator(performance, play);
    case "comedy":
      return new ComedyCalculator(performance, play);
    default:
      throw new Error(`未知の演劇の種類: ${play.type}`);
  }
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
        throw new Error ("想定外の呼び出し");
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

class TragedyCalculator extends PerformanceCalculator {
  get amount() {
    let result = 40000;
    if (this.performance.audience > 30) {
      result += 1000 * (this.performance.audience - 30);
    }

    return result;
  }
}

class ComedyCalculator extends PerformanceCalculator {
}

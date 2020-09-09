module.exports = function (startingPoint, iterationPerCycle, cycleCount) {
  const tmp = [startingPoint];
  let iterationCount = 0;

  for (let i = cycleCount - 1; i > 0; i--) {
    if (iterationCount < iterationPerCycle - 1) {
      tmp.push(tmp[tmp.length - 1]);
      iterationCount++;
    } else {
      tmp.push(tmp[tmp.length - 1] + 1);
      iterationCount = 0;
    }
  }

  return tmp;
};

var __typeError = (msg) => {
  throw TypeError(msg);
};
var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
var __privateGet = (obj, member, getter) => (__accessCheck(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
var __privateAdd = (obj, member, value) => member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
var __privateSet = (obj, member, value, setter) => (__accessCheck(obj, member, "write to private field"), setter ? setter.call(obj, value) : member.set(obj, value), value);
var __privateMethod = (obj, member, method) => (__accessCheck(obj, member, "access private method"), method);
var _numbers, _LottoManager_static, generateRandomNumber_fn, getRandomNumbers_fn, _lottos, _LottoPrize_instances, calculateMatchingCount_fn, calculateBonusChance_fn, determineMatchResult_fn, calculateTotalPrize_fn;
(function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) {
    return;
  }
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) {
    processPreload(link);
  }
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") {
        continue;
      }
      for (const node of mutation.addedNodes) {
        if (node.tagName === "LINK" && node.rel === "modulepreload")
          processPreload(node);
      }
    }
  }).observe(document, { childList: true, subtree: true });
  function getFetchOpts(link) {
    const fetchOpts = {};
    if (link.integrity) fetchOpts.integrity = link.integrity;
    if (link.referrerPolicy) fetchOpts.referrerPolicy = link.referrerPolicy;
    if (link.crossOrigin === "use-credentials")
      fetchOpts.credentials = "include";
    else if (link.crossOrigin === "anonymous") fetchOpts.credentials = "omit";
    else fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link) {
    if (link.ep)
      return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
})();
const LOTTO = {
  RANGE: {
    min: 1,
    max: 45
  },
  PRIZES: {
    first: 2e9,
    second: 3e7,
    third: 15e5,
    fourth: 5e4,
    fifth: 5e3
  },
  PURCHASE: {
    unit: 1e3,
    maxThreshold: 2e4
  },
  maxLength: 6
};
const MIN_MATCH_COUNT = 3;
const ERROR_MESSAGE = {
  purchaseUnit: `구입 금액은 ${LOTTO.PURCHASE.unit}원 단위로 입력해주세요.`,
  isNumeric: `숫자를 입력해주세요.`,
  minimumValue: `구입 금액은 ${LOTTO.PURCHASE.unit.toLocaleString()}원 이상이여야 합니다.`,
  maximumValue: `구입 금액은 ${LOTTO.PURCHASE.maxThreshold.toLocaleString()}원 이하여야 합니다.`,
  winningNumberisNumeric: `당첨 번호는 숫자여야 합니다.`,
  lottoNumberRange: `당첨 번호가 ${LOTTO.RANGE.min}부터 ${LOTTO.RANGE.max} 사이의 숫자여야 합니다.`,
  winningNumberDuplicate: "당첨 번호는 중복되지 않아야 합니다",
  bonusNumberUnique: "보너스 번호는 당첨 번호와 중복되면 안됩니다.",
  restartInput: "입력은 y 또는 n만 가능합니다.",
  winningNumbersLength: "당첨 번호는 6개여야 합니다.",
  emptyValue: "빈 값이 들어왔습니다. 값을 입력해주세요"
};
class Lotto {
  constructor(numbers) {
    __privateAdd(this, _numbers);
    numbers.sort((a, b) => a - b);
    __privateSet(this, _numbers, numbers);
  }
  compareMatchingNumbers(lotto) {
    return lotto.filter((lottoNumber) => __privateGet(this, _numbers).includes(lottoNumber)).length;
  }
  compareBonusNumbers(bonusNumber) {
    return __privateGet(this, _numbers).includes(bonusNumber);
  }
  get numbers() {
    return __privateGet(this, _numbers);
  }
}
_numbers = new WeakMap();
class LottoManager {
  static generateLottos(price) {
    return Array.from(
      { length: price / LOTTO.PURCHASE.unit },
      () => new Lotto(__privateMethod(this, _LottoManager_static, getRandomNumbers_fn).call(this))
    );
  }
}
_LottoManager_static = new WeakSet();
generateRandomNumber_fn = function() {
  return Math.floor(Math.random() * LOTTO.RANGE.max) + LOTTO.RANGE.min;
};
getRandomNumbers_fn = function() {
  const randomNumbers = /* @__PURE__ */ new Set();
  while (randomNumbers.size < LOTTO.maxLength) {
    randomNumbers.add(__privateMethod(this, _LottoManager_static, generateRandomNumber_fn).call(this));
  }
  return [...randomNumbers];
};
__privateAdd(LottoManager, _LottoManager_static);
class LottoPrize {
  constructor(lottos) {
    __privateAdd(this, _LottoPrize_instances);
    __privateAdd(this, _lottos);
    __privateSet(this, _lottos, lottos);
  }
  calculateWinnings(winningNumbers, bonusNumber) {
    const matchingCountResult = __privateMethod(this, _LottoPrize_instances, calculateMatchingCount_fn).call(this, winningNumbers);
    const bonusChanceResult = __privateMethod(this, _LottoPrize_instances, calculateBonusChance_fn).call(this, bonusNumber);
    return matchingCountResult.reduce(
      (acc, curr, index) => {
        acc[__privateMethod(this, _LottoPrize_instances, determineMatchResult_fn).call(this, curr, bonusChanceResult[index])] += 1;
        return acc;
      },
      {
        6: 0,
        "5+bonus": 0,
        5: 0,
        4: 0,
        3: 0
      }
    );
  }
  calculateROI(price, prizeResult) {
    if (__privateMethod(this, _LottoPrize_instances, calculateTotalPrize_fn).call(this, prizeResult) === 0) return 0;
    return ((__privateMethod(this, _LottoPrize_instances, calculateTotalPrize_fn).call(this, prizeResult) - price) / price * 100).toFixed(2);
  }
}
_lottos = new WeakMap();
_LottoPrize_instances = new WeakSet();
calculateMatchingCount_fn = function(winningNumbers) {
  return __privateGet(this, _lottos).reduce((acc, curr) => {
    const matchingCount = curr.compareMatchingNumbers(winningNumbers);
    return matchingCount < MIN_MATCH_COUNT ? acc : [...acc, matchingCount];
  }, []);
};
calculateBonusChance_fn = function(bonusNumber) {
  return __privateGet(this, _lottos).reduce((acc, curr) => {
    const isBonus = curr.compareBonusNumbers(bonusNumber);
    return [...acc, isBonus];
  }, []);
};
determineMatchResult_fn = function(matchCount, bonusMatchResult) {
  if (matchCount === 5 && bonusMatchResult) {
    return "5+bonus";
  }
  return matchCount;
};
calculateTotalPrize_fn = function(prizeResult) {
  return Object.keys(prizeResult).reduce((acc, curr) => {
    switch (curr) {
      case "6":
        return acc + LOTTO.PRIZES.first * prizeResult[curr];
      case "5+bonus":
        return acc + LOTTO.PRIZES.second * prizeResult[curr];
      case "5":
        return acc + LOTTO.PRIZES.third * prizeResult[curr];
      case "4":
        return acc + LOTTO.PRIZES.fourth * prizeResult[curr];
      case "3":
        return acc + LOTTO.PRIZES.fifth * prizeResult[curr];
    }
  }, 0);
};
const allowModalOpen = () => {
  const prizeResultModal = document.querySelector("modal");
  prizeResultModal.style.display = "flex";
  const prizeResultButton = document.querySelector(".result-contents");
  const closeButton = document.querySelector("modal .close-button");
  prizeResultButton.addEventListener("click", handleModal);
  closeButton.addEventListener("click", handleModal);
};
const handleModal = () => {
  const prizeResultModal = document.querySelector("modal");
  const modalOpenStatus = window.getComputedStyle(prizeResultModal).display;
  if (modalOpenStatus === "none") {
    prizeResultModal.style.display = "flex";
  } else if (modalOpenStatus === "flex") {
    prizeResultModal.style.display = "none";
  }
};
const resetLotto = () => {
  const prizeResultModal = document.querySelector("modal");
  prizeResultModal.style.display = "none";
  const inputFields = document.querySelectorAll("input");
  inputFields.forEach((input) => {
    input.value = "";
  });
  const lottoContents = document.querySelector(".lotto-contents");
  lottoContents.innerHTML = "";
  const restartButton = document.querySelector(".result-contents");
  restartButton.removeEventListener("click", handleModal);
  const resultTable = document.querySelector(".result-table");
  const tableBody = document.createElement("tbody");
  tableBody.className = "body";
  resultTable.innerHTML = "";
  resultTable.appendChild(tableBody);
  const resultText = document.querySelectorAll(".prize-contents p");
  if (resultText[1]) {
    resultText[1].remove();
  }
  const winningLottoContents = document.querySelector(".winningLotto-contents");
  winningLottoContents.style.display = "none";
  const resultContents = document.querySelector(".result-contents");
  resultContents.style.display = "none";
};
const initLotto = () => {
  const restartButton = document.querySelector(".restart-button");
  restartButton.addEventListener("click", () => {
    resetLotto();
    WebApp();
  });
};
class Validate {
  purchaseUnit(price) {
    if (price % LOTTO.PURCHASE.unit !== 0) {
      throw new Error(ERROR_MESSAGE.purchaseUnit);
    }
  }
  isNumeric(input) {
    if (Number.isNaN(Number(input))) {
      throw new Error(ERROR_MESSAGE.isNumeric);
    }
  }
  minimumValue(input) {
    if (input < LOTTO.PURCHASE.unit) {
      throw new Error(ERROR_MESSAGE.minimumValue);
    }
  }
  maximumValue(input) {
    if (input > LOTTO.PURCHASE.maxThreshold) {
      throw new Error(ERROR_MESSAGE.maximumValue);
    }
  }
  winningNumberisNumeric(input) {
    input.forEach((number) => {
      if (Number.isNaN(Number(number))) {
        throw new Error(ERROR_MESSAGE.winningNumberisNumeric);
      }
    });
  }
  lottoNumberRange(input) {
    if (input < LOTTO.RANGE.min || input > LOTTO.RANGE.max) {
      throw new Error(ERROR_MESSAGE.lottoNumberRange);
    }
  }
  winningNumberDuplicate(input) {
    if (input.length !== new Set(input).size) {
      throw new Error(ERROR_MESSAGE.winningNumberDuplicate);
    }
  }
  bonusNumberUnique(winningNumber, bonusNumber) {
    if (winningNumber.includes(bonusNumber))
      throw new Error(ERROR_MESSAGE.bonusNumberUnique);
  }
  restartInput(input) {
    if (input !== "y" && input !== "n")
      throw new Error(ERROR_MESSAGE.restartInput);
  }
  winningNumbersLength(winningNumber) {
    if (winningNumber.length !== LOTTO.maxLength) {
      throw new Error(ERROR_MESSAGE.winningNumbersLength);
    }
  }
  emptyValue(input) {
    if (input === "") {
      throw new Error(ERROR_MESSAGE.emptyValue);
    }
  }
}
const validate = new Validate();
const validateBonusNumber = (winningNumber, bonusNumber) => {
  validate.isNumeric(bonusNumber);
  validate.lottoNumberRange(bonusNumber);
  validate.bonusNumberUnique(winningNumber, bonusNumber);
};
const validatePrice = (price) => {
  validate.emptyValue(price);
  validate.isNumeric(price);
  validate.minimumValue(price);
  validate.purchaseUnit(price);
  validate.maximumValue(price);
};
const validateWinningNumbers = (winningNumbers) => {
  winningNumbers.forEach((number) => {
    validate.emptyValue(number);
    validate.isNumeric(number);
    validate.lottoNumberRange(number);
  });
  validate.winningNumberDuplicate(winningNumbers);
  validate.winningNumbersLength(winningNumbers);
};
const printErrorMessage = (errorField, error) => {
  const prevErrorMessage = document.querySelector(
    `${errorField} .error-message`
  );
  if (prevErrorMessage) {
    prevErrorMessage.innerText = error.message;
    return;
  }
  const errorFieldBlock = document.querySelector(errorField);
  const errorMessage = document.createElement("p");
  errorMessage.className = "error-message";
  errorMessage.innerText = error.message;
  errorFieldBlock.appendChild(errorMessage);
};
const removeErrorField = (errorField) => {
  const prevErrorMessage = document.querySelector(
    `${errorField} .error-message`
  );
  if (prevErrorMessage) {
    prevErrorMessage.remove();
  }
};
const getPrice = () => {
  return new Promise((resolve) => {
    const userInputPrice = document.querySelector(".input-contents input");
    const purchaseButton = document.querySelector(".input-contents button");
    const winningLottoContainer = document.querySelector(
      ".winningLotto-contents"
    );
    const resultSubmitButton = document.querySelector(".result-contents");
    purchaseButton.addEventListener("click", async () => {
      try {
        validatePrice(userInputPrice.value);
        removeErrorField(".input-contents");
        winningLottoContainer.style.display = "flex";
        resultSubmitButton.style.display = "flex";
        resolve(userInputPrice.value);
      } catch (error) {
        printErrorMessage(".input-contents", error);
      }
    });
  });
};
const getWinningLotto = async () => {
  const winningNumberInputs = document.querySelectorAll(
    ".winningLotto-contents_winningLotto div input"
  );
  const bonusNumberInput = document.querySelector(
    ".winningLotto-contents_bonusNumber input"
  );
  const submitResultButton = document.querySelector(".result-contents");
  return new Promise((resolve) => {
    submitResultButton.addEventListener("click", async () => {
      const winningNumbers = [];
      let bonusNumber = "";
      winningNumberInputs.forEach((winningNumber) => {
        winningNumbers.push(winningNumber.value);
      });
      bonusNumber = bonusNumberInput.value;
      try {
        validateWinningNumbers(winningNumbers);
        validateBonusNumber(winningNumbers, bonusNumber);
        removeErrorField(".winningLotto-contents");
        resolve({ winningNumbers, bonusNumber });
      } catch (error) {
        printErrorMessage(".winningLotto-contents", error);
      }
    });
  });
};
const lottoImg = "/javascript-lotto/assets/lotto-CqPatwZy.png";
const printLottoCount = (price) => {
  const lottoContents = document.querySelector(".lotto-contents");
  const lottoCountText = document.createElement("p");
  lottoCountText.className = "body";
  lottoCountText.innerText = `총 ${price / LOTTO.PURCHASE.unit}개를 구매하였습니다.`;
  lottoContents.appendChild(lottoCountText);
};
const createLottoObject = (lotto) => {
  const lottoContainer = document.createElement("div");
  lottoContainer.className = "lotto-container_lotto";
  const lottoImage = document.createElement("img");
  lottoImage.src = lottoImg;
  const lottoNumbers = document.createElement("p");
  lottoNumbers.innerText = lotto.numbers.map((number) => number).join(", ");
  lottoContainer.appendChild(lottoImage);
  lottoContainer.appendChild(lottoNumbers);
  return lottoContainer;
};
const printLottos = (lottos) => {
  const lottoContents = document.querySelector(".lotto-contents");
  const lottosContainer = document.createElement("div");
  const lottoObjects = lottos.map((lotto) => createLottoObject(lotto));
  lottoObjects.forEach((lottoObject) => {
    lottosContainer.appendChild(lottoObject);
  });
  lottoContents.appendChild(lottosContainer);
};
const prizeSummary = [
  { count: "3개", prize: LOTTO.PRIZES.fifth, label: 3 },
  { count: "4개", prize: LOTTO.PRIZES.fourth, label: 4 },
  { count: "5개", prize: LOTTO.PRIZES.third, label: 5 },
  {
    count: "5개+보너스 볼",
    prize: LOTTO.PRIZES.second,
    label: "5+bonus"
  },
  { count: "6개", prize: LOTTO.PRIZES.first, label: 6 }
];
const createPrizeRow = ({ count, prize, label }, prizeResult) => {
  const tableRow = document.createElement("tr");
  const rowData = [count, prize.toLocaleString(), `${prizeResult[label]}개`];
  rowData.forEach((data) => {
    const cell = document.createElement("td");
    cell.innerText = data;
    tableRow.appendChild(cell);
  });
  return tableRow;
};
const printPrizeHeader = () => {
  const resultTable = document.querySelector(".result-table");
  const headers = ["일치 갯수", "당첨금", "당첨 갯수"];
  const tableHeader = document.createElement("thead");
  const tableRow = document.createElement("tr");
  headers.forEach((headerText) => {
    const headerCell = document.createElement("th");
    headerCell.innerText = headerText;
    tableRow.appendChild(headerCell);
  });
  tableHeader.appendChild(tableRow);
  resultTable.appendChild(tableHeader);
};
const printPrizeResult = (prizeResult) => {
  const tableBody = document.querySelector(".result-table .body");
  prizeSummary.forEach(
    (summary) => tableBody.appendChild(createPrizeRow(summary, prizeResult))
  );
};
const printRateResult = (rate) => {
  const prizeContents = document.querySelector(".prize-contents");
  const restartButton = document.querySelector(".prize-contents button");
  const rateResult = document.createElement("p");
  rateResult.innerText = `당신의 총 수익률은 ${rate}%입니다.`;
  prizeContents.insertBefore(rateResult, restartButton);
};
const printLottoResult = (prizeResult, rate) => {
  printPrizeHeader();
  printPrizeResult(prizeResult);
  printRateResult(rate);
};
initLotto();
async function WebApp() {
  const price = await getPrice();
  printLottoCount(price);
  const lottos = LottoManager.generateLottos(price);
  printLottos(lottos);
  const { winningNumbers, bonusNumber } = await getWinningLotto();
  const lottoPrize = new LottoPrize(lottos);
  const prizeResult = lottoPrize.calculateWinnings(winningNumbers, bonusNumber);
  const ROI = lottoPrize.calculateROI(price, prizeResult);
  allowModalOpen();
  printLottoResult(prizeResult, ROI);
}
WebApp();

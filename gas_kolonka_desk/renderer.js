
let CurStattionInfo

const bankCardNextRadio = document.getElementById("BankCardNext");
const spendAllBonusRadio = document.getElementById("SpendAllBonus");

bankCardNextRadio.addEventListener("change", function () {
  if (bankCardNextRadio.checked) {
    spendAllBonusRadio.checked = false;
  }
});

spendAllBonusRadio.addEventListener("change", function () {
  if (spendAllBonusRadio.checked) {
    bankCardNextRadio.checked = false;
  }
});

async function urlreq(url, options) {
  try {
    const response = await fetch(url, options);
    if (response.ok) {
      const data = await response.json();
      return JSON.stringify(data);
    }
    throw new Error('Network response was not OK.');
  } catch (error) {
    return error.message;
  }
}

var optionsGet = {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json'
  }
};

function showOptions(response) {
  document.getElementById('fuelOptions').classList.remove('hidden');
  document.getElementById('refuelingOptions').classList.remove('hidden');
  document.getElementById('paymentOptions').classList.remove('hidden');
  document.getElementById('BonusCardChoice').classList.remove('hidden');
  document.getElementById('StartWork').classList.add('hidden')

  cardDetailsModal.style.display = 'none';
  var fuelTypeSelect = document.getElementById("fuelType");
  fuelTypeSelect.innerHTML = "";

  for (let index = 0; index < 4; index++) {
    if (response["fuel_types"][index].amount_of_fuel <= 50) {
      var option = document.createElement("option");
      option.value = response["fuel_types"][index].name
      option.text = `${response["fuel_types"][index].name} - нет в наличии`
      fuelTypeSelect.appendChild(option);
    }
    else {
      var option = document.createElement("option");
      option.value = response["fuel_types"][index].name
      option.text = `${response["fuel_types"][index].name} - есть в наличии
      цена: ${response["fuel_types"][index].price} руб/л`

      fuelTypeSelect.appendChild(option);
    }
  }
}

function displayResponse(response) {
  const responseContainer = document.getElementById('responseContainer');
  responseContainer.innerText = '';
  const responseText = JSON.stringify(response);
  responseContainer.innerText = responseText;
}

async function sendData() {
  const azsId = document.getElementById('azsId').value;
  const columnId = document.getElementById('columnId').value;

  url = `http://127.0.0.1:8080/getStationInfo/?id=${azsId}`;
  const response = JSON.parse(await urlreq(url, optionsGet));
  CurStattionInfo = response;
  showOptions(response);
}

function findFuelPrice(fuelTypes, fuelName) {
  for (var i = 0; i < fuelTypes.length; i++) {
    if (fuelTypes[i].name === fuelName) {
      return fuelTypes[i].price;
    }
  }
  return "Цена не найдена";
}

function findFuelAmount(fuelTypes, fuelName) {
  for (var i = 0; i < fuelTypes.length; i++) {
    if (fuelTypes[i].name === fuelName) {
      return fuelTypes[i].amount_of_fuel;
    }
  }
  return "Ошибка";
}


async function processPayment() {

  const cardNumberInput = document.getElementById('cardNumber');
  const cardHolderInput = document.getElementById('cardHolder');
  const cardCVCInput = document.getElementById('cardcvc');

  const bonusCardInput = document.getElementById('PhoneNumber')


  const cardNumber = cardNumberInput.value.replace(/\s/g, '');
  const cardHolder = cardHolderInput.value.trim();

  const FuelName = document.getElementById('fuelType').value;

  const fixedVolume = document.getElementById('fixedVolume');
  const fixedPrice = document.getElementById('fixedPrice');

  const BonusCardCheck = document.getElementById('loyaltyCard');
  const BankCardCheck = document.getElementById('bankCard');

  const fixedPriceAmount = document.getElementById('fixedPriceAmount');
  const fixedVolumeAmount = document.getElementById('fixedVolumeAmount');

  let Amount
  let Chose_fuel_or_price
  let Chose_bank_or_bonus
  let StationID = CurStattionInfo.station_id
  let BankCard = cardNumberInput.value
  let FuelPrice = findFuelPrice(CurStattionInfo["fuel_types"], FuelName)
  let pincode = cardCVCInput.value

  if (fixedVolume.checked) {
    Chose_fuel_or_price = "Fuel"
    Amount = fixedVolumeAmount.value
  } else if (fixedPrice.checked) {
    Chose_fuel_or_price = "Price"
    Amount = fixedPriceAmount.value
  }

  if (BankCardCheck.checked) {
    Chose_bank_or_bonus = 'Bank';
  } else if (BonusCardCheck.checked) {
    Chose_bank_or_bonus = 'Bonus';
  }

  if (Chose_fuel_or_price === 'Fuel' && Chose_bank_or_bonus === 'Bank') {
    let FuelAmount = Math.round((fixedPriceAmount.value / FuelPrice) * 100) / 100;
    let TotalFuelCost = Math.round((FuelAmount * FuelPrice) * 100) / 100;

    displayResponse('Данные карты введены не верно');
    const urlGETcard = `http://127.0.0.1:8080/get-bank-cards/?bankcard=${BankCard}`;
    const urlGETstationinfo = `http://127.0.0.1:8080/getStationInfo?id=${StationID}`;

    const GetCardResponse = JSON.parse(await urlreq(urlGETcard, optionsGet));
    const GetStationInfoResponse = JSON.parse(await urlreq(urlGETstationinfo, optionsGet));

    if (TotalFuelCost > Number(GetCardResponse.Balance)) {
      displayResponse('Недостаточно денег')
      return 0;
    }
    if (Number(FuelAmount) > findFuelAmount(GetStationInfoResponse.fuel_types, FuelName)) {
      displayResponse('Недостаточно топлива')
      return 0;
    }

    if (TotalFuelCost <= Number(GetCardResponse.Balance)
      && Number(FuelAmount) <= findFuelAmount(GetStationInfoResponse.fuel_types, FuelName)
      && pincode == GetCardResponse.code) {
      displayResponse(`Вам будет залито ${FuelAmount} литра(ов) ${FuelName} на сумму: ${TotalFuelCost} руб.`)
      return 0;

    } else {

      displayResponse('Данные карты введены не верно');
      return 0;
    }
  }
  else if (Chose_fuel_or_price === 'Price' && Chose_bank_or_bonus === 'Bank') {

    let BonusCard = bonusCardInput.value
    let FuelAmount = Math.round((fixedPriceAmount.value / FuelPrice) * 100) / 100;
    let TotalFuelCost = Math.round((FuelAmount * FuelPrice) * 100) / 100;
    displayResponse('Данные карты введены не верно');;
    const urlGETcard = `http://127.0.0.1:8080/get-bank-cards/?bankcard=${BankCard}`;
    const urlGETstationinfo = `http://127.0.0.1:8080/getStationInfo?id=${StationID}`;

    const GetCardResponse = JSON.parse(await urlreq(urlGETcard, optionsGet));
    const GetStationInfoResponse = JSON.parse(await urlreq(urlGETstationinfo, optionsGet));

    if (pincode != GetCardResponse.code) {
      displayResponse('Данные карты введены не верно');
      return 0;
    }
    if (TotalFuelCost > Number(GetCardResponse.Balance)) {
      displayResponse('Недостаточно денег')
      return 0;
    }
    if (Number(FuelAmount) > findFuelAmount(GetStationInfoResponse.fuel_types, FuelName)) {
      displayResponse('Недостаточно топлива')
      return 0;
    }
    displayResponse(`Вам будет залито ${FuelAmount} литра(ов) ${FuelName} на сумму: ${TotalFuelCost} руб.`);
  } else if (Chose_fuel_or_price === 'Fuel' && Chose_bank_or_bonus === 'Bonus') {

    let BonusCard = bonusCardInput.value
    const FuelAmount = Amount;
    const TotalFuelCost = Number(FuelAmount) * Number(FuelPrice);

    const urlGETcard = `http://127.0.0.1:8080/get-bonus-cards/?bonuscard=${BonusCard}`;
    const urlGETstationinfo = `http://127.0.0.1:8080/getStationInfo?id=${StationID}`;

    displayResponse('Бонусная карта не найдена')
    const GetCardResponse = JSON.parse(await urlreq(urlGETcard, optionsGet));
    const GetStationInfoResponse = JSON.parse(await urlreq(urlGETstationinfo, optionsGet));

    if (GetCardResponse.Balance < TotalFuelCost) {
      if (bankCardNextRadio.checked) {
        let NeedToPay = Math.round((TotalFuelCost - GetCardResponse.Balance) * 100) / 100;

        displayResponse(`вам не хватает бонусов, доплатите ${NeedToPay} руб. при помощи вашей карты`);
        fixedVolumeAmount.value = Math.round((NeedToPay / FuelPrice) * 100) / 100
        handlePaymentMethodChange();
      }
      else if (spendAllBonusRadio.checked) {
        let CanFillWithBonus = Math.round((GetCardResponse.Balance / FuelPrice) * 100) / 100
        let BonusWillSpend = Math.round((CanFillWithBonus * FuelPrice) * 100) / 100
        displayResponse(`Будет залито ${CanFillWithBonus} литров ${FuelName} и списано ${BonusWillSpend} бонусов`)
      }
    }
    else {
      displayResponse(`Будет залито ${FuelAmount} литра(ов) ${FuelName} и списано ${TotalFuelCost} бонусов`)
    }
  }
  else if (Chose_fuel_or_price === 'Price' && Chose_bank_or_bonus === 'Bonus') {

    let BonusCard = bonusCardInput.value
    let FuelAmount = Math.round((fixedPriceAmount.value / FuelPrice) * 100) / 100;
    const TotalFuelCost = Math.round((FuelAmount * FuelPrice) * 100) / 100;

    const urlGETcard = `http://127.0.0.1:8080/get-bonus-cards/?bonuscard=${BonusCard}`;
    const urlGETstationinfo = `http://127.0.0.1:8080/getStationInfo?id=${StationID}`;

    displayResponse('Бонусная карта не найдена')
    const GetCardResponse = JSON.parse(await urlreq(urlGETcard, optionsGet));
    const GetStationInfoResponse = JSON.parse(await urlreq(urlGETstationinfo, optionsGet));

    if (GetCardResponse.Balance < TotalFuelCost) {
      if (bankCardNextRadio.checked) {
        let NeedToPay = Math.round((TotalFuelCost - GetCardResponse.Balance) * 100) / 100;
        document.getElementById("bankCard").checked = true;
        displayResponse(`вам не хватает бонусов, доплатите ${NeedToPay} руб. при помощи вашей карты`);
        fixedPriceAmount.value = NeedToPay;
        handlePaymentMethodChange();
      }
      else if (spendAllBonusRadio.checked) {
        let CanFillWithBonus = Math.round((GetCardResponse.Balance / FuelPrice) * 100) / 100
        let BonusWillSpend = Math.round((CanFillWithBonus * FuelPrice) * 100) / 100
        displayResponse(`Будет залито ${CanFillWithBonus} литра(ов) ${FuelName} и списано ${BonusWillSpend} бонусов`)
      }
    }
    else {
      displayResponse(`Будет залито ${FuelAmount} литров ${FuelName} и списано ${TotalFuelCost} бонусов`)
    }
  }
}

function validateCardNumber(cardNumber) {
  const cardNumberPattern = /^\d{16}$/;
  return cardNumberPattern.test(cardNumber);
}

function validateCardHolder(cardHolder) {
  const cardHolderPattern = /^[a-zA-Z]+\s[a-zA-Z]+$/;
  return cardHolderPattern.test(cardHolder);
}

function openModal() {
  const modal = document.getElementById('cardDetailsModal');
  modal.style.display = 'block';
}

function closeModal() {
  const modal = document.getElementById('cardDetailsModal');
  modal.style.display = 'none';
}

function handlePaymentMethodChange() {
  const cardDetailsModal = document.getElementById('cardDetailsModal');
  const bankCardOption = document.getElementById('bankCard');


  if (bankCardOption.checked) {
    cardDetailsModal.style.display = 'block';
    bonuscardDetailsModal.style.display = 'none';
  } else {
    cardDetailsModal.style.display = 'none';
    bonuscardDetailsModal.style.display = 'block';
  }
}

const paymentMethodOptions = document.querySelectorAll('input[name="paymentMethod"]');
paymentMethodOptions.forEach(option => {
  option.addEventListener('change', handlePaymentMethodChange);
});






const modal = document.getElementById("myModal");
modal.style.display = "none";
const btn = document.getElementById("openModalBtn");
const closeBtn = document.querySelector(".close");
const form = document.getElementById("cardForm");

btn.addEventListener("click", function () {
  modal.style.display = "block";
});

closeBtn.addEventListener("click", function () {
  modal.style.display = "none";
  const responseContainer = document.getElementById('responseContainer');
  responseContainer.innerText = '';
});

window.addEventListener("click", function (event) {
  if (event.target === modal) {
    modal.style.display = "none";
    const responseContainer = document.getElementById('responseContainer');
    responseContainer.innerText = '';
  }
});

form.addEventListener("submit", function (event) {
  event.preventDefault();
  // Обработка отправки формы, например, вызов функции для создания новой карты с данными из формы
  createNewCard();
  // Закрытие модального окна
  modal.style.display = "none";
});

async function createNewCard() {

  const cardNumber = document.getElementById("BonCardNumber");
  const cardHolder = document.getElementById("BonCardHolder");

  url = "http://127.0.0.1:8080/set-bonus-cards/"
  const optionsPOST = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      BonusCard: cardNumber.value, // Замените на нужные данные карты
      CardHolder: cardHolder.value, // Замените на нужные данные владельца карты
      Balance: 0 // Замените на нужные данные баланса
    })
  };

  displayResponse('Ошибка при создании карты')
  const POSTresponse = JSON.parse(await urlreq(url, optionsPOST))
  displayResponse("Карта создана успешно")
  modal.style.display = "none";
}
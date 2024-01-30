function loadData() {
    const stationId = document.getElementById('stationId').value;
    window.electron.ipcRenderer.send('loadData', stationId);
}

window.electron.ipcRenderer.receive('loadDataError', (data) => {
    alert('Не найден в базе данных.');
});

window.electron.ipcRenderer.receive('loadedData', (data) => {
    document.getElementById('stationIdValue').innerText = data.station_id;
    document.getElementById('geographicalAddress').value = data.address;
    const fuel92 = data.fuel_types.find(fuel => fuel.name === '92');
    if (fuel92) {
        document.getElementById('price92').value = fuel92.price;
        document.getElementById('amount92').value = fuel92.amount_of_fuel;
    }
    const fuel95 = data.fuel_types.find(fuel => fuel.name === '95');
    if (fuel95) {
        document.getElementById('price95').value = fuel95.price;
        document.getElementById('amount95').value = fuel95.amount_of_fuel;
    }
    const fuel98 = data.fuel_types.find(fuel => fuel.name === '98');
    if (fuel98) {
        document.getElementById('price98').value = fuel98.price;
        document.getElementById('amount98').value = fuel98.amount_of_fuel;
    }
    const df = data.fuel_types.find(fuel => fuel.name === 'Disel Fuel');
    if (df) {
        document.getElementById('priceDF').value = df.price;
        document.getElementById('amountDF').value = df.amount_of_fuel;
    }
    document.getElementById('azsData').style.display = 'block';
});

function saveChanges() {
    const station_id = document.getElementById('stationId').value;
    const address = document.getElementById('geographicalAddress').value;

    const price92 = parseFloat(document.getElementById('price92').value);
    const amount92 = document.getElementById('amount92').value;

    const price95 = parseFloat(document.getElementById('price95').value);
    const amount95 = document.getElementById('amount95').value;

    const price98 = parseFloat(document.getElementById('price98').value);
    const amount98 = document.getElementById('amount98').value;

    const priceDF = parseFloat(document.getElementById('priceDF').value);
    const amountDF = document.getElementById('amountDF').value;

    const postData = {
        'station_id': station_id,
        'address': address,
        'fuel_types': [{
                'name': '92',
                'price': price92,
                'amount_of_fuel': amount92
                    },
            {
                'name': '95',
                'price': price95,
                'amount_of_fuel': amount95
                    },
            {
                'name': '98',
                'price': price98,
                'amount_of_fuel': amount98
                    },
            {
                'name': 'Disel Fuel',
                'price': priceDF,
                'amount_of_fuel': amountDF
                    }
                ]
    };
    console.log(postData);
    window.electron.ipcRenderer.send('saveChanges', postData);
}

window.electron.ipcRenderer.receive('savedChanges', () => {
    alert('Изменения успешно сохранены');
});

window.electron.ipcRenderer.receive('saveChangesError', () => {
    alert('Ошибка при сохранении изменений');
});

const inputValue = document.getElementById('inputValue');
const fromUnit = document.getElementById('fromUnit');
const toUnit = document.getElementById('toUnit');
const convertBtn = document.getElementById('convertBtn');
const result = document.getElementById('result');

//  všechny jednotky převedu nejdříve na metry
let conversionFactors = {
    mm: 0.001,
    cm: 0.01,
    dm: 0.1,
    m: 1,
    km: 1000
};

// převod jednotek
function convertLength(value, from, to) {
    // všechno na metry
    const valueInMeters = value * conversionFactors[from];
    //  z metrů na cílovou jednotku
    const convertedValue = valueInMeters / conversionFactors[to];
    return convertedValue.toFixed(2);
}

// funkce na tlačítko "Převést"
convertBtn.addEventListener('click', function () {
    const value = parseFloat(inputValue.value);
    const from = fromUnit.value;
    const to = toUnit.value;

    // ověření jestli je zadané číslo
    if (isNaN(value)) {
        result.innerHTML = '<span class="text-danger">Prosím, zadejte platnou hodnotu!</span>';
        return;
    }

    // výpočet a zobrazení výsledku
    const convertedValue = convertLength(value, from, to);
    result.innerHTML = `Výsledek: ${value} ${from} = ${convertedValue} ${to}`;
});

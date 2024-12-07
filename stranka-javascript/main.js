const inputValue = document.getElementById('inputValue');
const fromUnit = document.getElementById('fromUnit');
const toUnit = document.getElementById('toUnit');
const convertBtn = document.getElementById('convertBtn');
const result = document.getElementById('result');

// objekt
const conversion = {
    mm: 0.001,
    cm: 0.01,
    dm: 0.1,
    m: 1,
    km: 1000,
    mi: 1609.34,    // 1 míle = 1609.34 metrů
    yd: 0.9144,     // 1 yard = 0.9144 metrů
    in: 0.0254,     // 1 palec = 0.0254 metrů

    //  převod mezi jednotkami
    convertLength: function (value, from, to) {
        // převod všech jednotek na metry
        const valueInMeters = value * this[from];
        // převod z metrů na cílovou jednotku
        const convertedValue = valueInMeters / this[to];
        return convertedValue.toFixed(2);  // zaokrouhlení na 2 desetinná místa
    }
};

// funkce na tlačítko "Převést"
convertBtn.addEventListener('click', function () {
    const value = parseFloat(inputValue.value);
    const from = fromUnit.value;
    const to = toUnit.value;

    // ověření, jestli je zadané číslo 
    if (isNaN(value)) {
        result.innerHTML = '<span class="text-danger">Prosím, zadejte platnou hodnotu!</span>';
        return;
    }

    // výpočet a zobrazení výsledku
    const convertedValue = conversion.convertLength(value, from, to);
    result.innerHTML = `Výsledek: ${value} ${from} = ${convertedValue} ${to}`;
});

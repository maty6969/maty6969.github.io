const countriesList = document.getElementById("countries-list");
const continent = document.getElementById("continent");
const modalBody = document.getElementById("modal-body-content");
const modal = new bootstrap.Modal(document.getElementById("one-country"));

function loadCountries(region) {
    countriesList.innerHTML = "";
    fetch(`https://restcountries.com/v3.1/region/${region}`)
        .then(res => res.json())
        .then(data => {
            data.forEach((country) => {
                let blockCountry = `
                <div class="col-xl-2 col-lg-3 col-md-4 col-sm-6">
                    <div class="card">
                        <img class="card-img-top" src="${country.flags.png}" alt="Vlajka ${country.name.common}" />
                        <div class="card-body">
                            <h4 class="card-title"><a href="#">${country.translations?.ces?.common || country.name.common}</a></h4>
                            <p class="card-text">Hlavní město: <b>${country.capital ? country.capital[0] : "Neuvedeno"}</b></p>
                            <p><button class="btn btn-info" data-name="${country.name.common}">Informace</button></p>
                        </div>
                    </div>                                        
                </div>            
            `;
                countriesList.innerHTML += blockCountry;
            });

            document.querySelectorAll('button[data-name]').forEach(button => {
                button.addEventListener('click', () => {
                    const countryName = button.getAttribute('data-name');
                    modal.show();
                    fetch(`https://restcountries.com/v3.1/name/${countryName}?fullText=true`)
                        .then(res => res.json())
                        .then(data => {
                            const country = data[0];

                            const name = country.translations?.ces?.common || country.name.common;
                            const capital = country.capital ? country.capital[0] : "Neuvedeno";
                            const population = country.population?.toLocaleString('cs-CZ') || "Neuvedeno";
                            const area = country.area?.toLocaleString('cs-CZ') || "Neuvedeno";
                            const continent = country.continents ? country.continents[0] : "Neuvedeno";
                            const flag = country.flags?.svg || "";
                            const borders = country.borders ? country.borders.join(", ") : "Žádné";
                            const mapLink = country.maps?.googleMaps || "#";
                            const languages = country.languages ? Object.values(country.languages).join(", ") : "Neuvedeno";

                            let currency = "Neuvedeno";
                            if (country.currencies) {
                                const key = Object.keys(country.currencies)[0];
                                currency = country.currencies[key].name;
                            }

                            modalBody.innerHTML = `
                                <h4>${name}</h4>
                                <img src="${flag}" alt="Vlajka ${name}" class="img-fluid mb-3" style="max-height:100px;">
                                <p><strong>Hlavní město:</strong> ${capital}</p>
                                <p><strong>Počet obyvatel:</strong> ${population}</p>
                                <p><strong>Rozloha:</strong> ${area} km²</p>
                                <p><strong>Kontinent:</strong> ${continent}</p>
                                <p><strong>Jazyky:</strong> ${languages}</p>
                                <p><strong>Měna:</strong> ${currency}</p>
                                <p><strong>Hraniční státy:</strong> ${borders}</p>
                                <p><strong>Mapa:</strong> <a href="${mapLink}" target="_blank">Zobrazit v Google Mapách</a></p>
                            `;
                        })
                        .catch(error => {
                            console.log("Chyba při načítání informací o státu:", error);
                        });
                });
            });
        })
        .catch(error => {
            console.log("Chyba při načítání států podle regionu:", error);
        });
}

loadCountries("europe");

continent.addEventListener("change", function (event) {
    loadCountries(event.target.value);
});

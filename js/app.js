const input = document.getElementById("address");
const datalist = document.getElementById("data_addresses");
let eventSource;

const generateURL = (address) => {
    return `https://api.dataforsyningen.dk/adgangsadresser/autocomplete?q=${address}`;
};

const fetchAutocomplete = (address) => {
    axios
        .get(generateURL(address))
        .then((response) => {
            response.data.slice(0, 5).forEach(addOptionToDatalist);
        })
        .catch((error) => {
            console.log(error);
        });
};

const addOptionToDatalist = (item) => {
    const option = document.createElement("option");
    option.value = item.tekst;
    datalist.appendChild(option);
};

const clearDatalist = () => {
    datalist.innerHTML = null;
};

const getParishFromAddress = async (address) => {
    const addressItem = await axios.get(generateURL(address));
    const parishItem = await axios.get(addressItem.data[0].adgangsadresse.href);
    alert(`You belong to the ${parishItem.data.sogn.navn} parish.`);
};

// Checks whether the keydown was an input or value from the option list
input.addEventListener("keydown", (event) => {
    eventSource = event.key ? "input" : "list";
});

input.addEventListener("input", function (event) {
    clearDatalist();
    const address = event.target.value;

    if (eventSource === "list") {
        getParishFromAddress(address);
        return;
    }

    if (address.length < 3) return;

    fetchAutocomplete(address);
});

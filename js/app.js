const input = document.getElementById("address");
const datalist = document.getElementById("data_addresses");
let eventSource;

const generateURL = (address) => {
    return `https://api.dataforsyningen.dk/adgangsadresser/autocomplete?q=${address}`;
};

const addAnimation = () => {
    const resultDiv = document.getElementById("result-container");
    resultDiv.classList.add("animate");
};

const removeAnimation = () => {
    const resultDiv = document.getElementById("result-container");
    resultDiv.classList.remove("animate");
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

const revealParishSVG = () => {
    const parish = document.getElementById("parish");
    parish.style.transform = "scaleY(1)";
};

const getParishFromAddress = async (address) => {
    const addressItem = await axios.get(generateURL(address));
    const parishItem = await axios.get(addressItem.data[0].adgangsadresse.href);
    const resultSpan = document.getElementById("populate");
    resultSpan.innerText = `${parishItem.data.sogn.navn} Sogn`;
    addAnimation();
    input.value = null;
};

window.addEventListener("load", revealParishSVG);

// Checks whether the keydown was an input or value from the option list
input.addEventListener("keydown", (event) => {
    eventSource = event.key ? "input" : "list";
});

input.addEventListener("input", function (event) {
    clearDatalist();
    removeAnimation();
    const address = event.target.value;

    if (eventSource === "list") {
        getParishFromAddress(address);
        return;
    }

    if (address.length < 3) return;

    fetchAutocomplete(address);
});

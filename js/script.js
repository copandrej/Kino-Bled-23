/*Malo grša kot lani, ampak sem moral dodati funkcionalnost da se ostale zaprejo*/
let temp = null;
function zapri(el) {
    if (temp != null) {
        let buff = temp;
        temp = null;
        zapri(buff);
    }

    if (el.clientHeight >= 45) {
        el.childNodes[1].childNodes[1].style.color = '#ffebc6';
        el.style.height = "41px";
        temp = null;
    } else {
        el.childNodes[1].childNodes[1].style.color = 'rgba(42, 53, 96, 0.9)';
        el.style.height = (el.childNodes[3].clientHeight + 41).toString() + "px";
        temp = el;
    }
}

/*poravna elemente da so zliti z vsebino*/
function poravnaj(el) {
    if (el.clientHeight >= 45) el.style.height = (el.childNodes[3].clientHeight + 41).toString() + "px";
}


window.addEventListener("load", () => {
    /** DOM 
     * debug pred spremembo skrije Četrtek ker težave z Č-jem, 
     * po spremembi displaya nazaj
     * safari -> realno to sploh ne pomaga sadge
    */
    const spremeni = document.getElementsByClassName("dan");
    const prevedi = document.getElementsByClassName("prevedi");
    const debug = document.getElementById("debug");
    const dnevi = document.getElementsByClassName("skri");

    // Dnevi v tednu + jezik browserja
    const DneviSlo = ["PONEDELJEK", "TOREK", "SREDA", "&#268ETRTEK", "PETEK", "SOBOTA", "NEDELJA", "PONEDELJEK 25"];
    const DneviEng = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY", "MONDAY 25."];
    const userLang = navigator.language || navigator.userLanguage;

    let trenutniJezik = "";
    let trenutnaLokacija = "park";
    $(".park").css("color", "rgba(42, 53, 96, 0.9)");

    if (userLang == "sl" && trenutniJezik != "sl")
        spremembaJezika("sl");
    else if (userLang != "sl" && trenutniJezik != "en")
        spremembaJezika("en");

    // gumb za nastavljanje jezika
    $(".slo").click(() => { spremembaJezika("sl"); });
    $(".eng").click(() => { spremembaJezika("en"); });

    $(".down").click(() => { 
        $(".arrow").css("border-color", "transparent");
     });


    //gumbi za lokacijo
    $(".fes").click(() => {
        resetColor();
        $(".fes").css("color", "rgba(42, 53, 96, 0.9)");
        trenutnaLokacija = "fes";
        vsebina(trenutniJezik, trenutnaLokacija);
    });
    $(".itc").click(() => {
        resetColor();
        $(".itc").css("color", "rgba(42, 53, 96, 0.9)");
        trenutnaLokacija = "itc";
        vsebina(trenutniJezik, trenutnaLokacija);
    });
    $(".park").click(() => {
        resetColor();
        trenutnaLokacija = "park";
        $(".park").css("color", "rgba(42, 53, 96, 0.9)");
        vsebina(trenutniJezik, trenutnaLokacija);
    });

    /*popucaj barva pritisnjenih gumbov*/
    function resetColor() {
        $(".fes").css("color", "#ffebc6");
        $(".itc").css("color", "#ffebc6");
        $(".park").css("color", "#ffebc6");
    }

    /**najprej spemeni dneve v tednu, da je to čim hitreje nato vsebina() spremeni še program -> function vsebina(). 
     * To bi se dalo tudi lepše napisati, ampak je bilo naknadnjo skalirano in raje nisem spremenil.
     */
    function spremembaJezika(Jezik) {
        if (Jezik == "sl") {
            trenutniJezik = "sl";
            //zgoraj opisan hrošč "debug"
            debug.style.display = "none";
            for (let i = 0; i < spremeni.length; i++)
                spremeni[i].innerHTML = DneviSlo[i];
            debug.style.display = "inline";
            prevedi[0].innerHTML = "IZBERITE PRIZORIŠČE:";
            prevedi[1].innerHTML = "KINO RADOLCA";
            prevedi[2].innerHTML = "DRUGO";
            prevedi[3].innerHTML = "VSTOP PROST";
            prevedi[4].innerHTML = '<a class="no-display visually-hidden" href="https://olaii.com/event/1922/kino-bled-2022?lang=sl" target="_blank">KUPI VSTOPNICE</a>';
            prevedi[5].innerHTML = "PI&#352ITE NAM";
            prevedi[6].innerHTML = '<a href="sponzorji">SPONZORJI FESTIVALA</a>';
            vsebina(trenutniJezik, trenutnaLokacija);

        } else {
            trenutniJezik = "en";
            debug.style.display = "none";
            for (let i = 0; i < spremeni.length; i++)
                spremeni[i].innerHTML = DneviEng[i];
            debug.style.display = "inline";
            prevedi[0].innerHTML = "SELECT THE VENUE:";
            prevedi[1].innerHTML = "KINO RADOLCA";
            prevedi[2].innerHTML = "OTHER";
            prevedi[3].innerHTML = "FREE ENTRY";
            prevedi[4].innerHTML = '<a class="no-display visually-hidden" href="https://olaii.com/event/1922/kino-bled-2022?lang=en" target="_blank">BUY TICKETS</a>';
            prevedi[5].innerHTML = "EMAIL US";
            prevedi[6].innerHTML = '<a href="sponsors">FESTIVAL SPONSORS</a>';
            vsebina(trenutniJezik, trenutnaLokacija);
        }
    }

    /**
     * request za js object vsebino priloženo v mapi vsebina,
     * js prebere in zgradi html strukturo za dinamično veliko vsebino
     * prostor za izbolšavo z api ali bazo
     */
    
    function vsebina(jezik, lokacija = "park") {
        let imeDatoteke = `./vsebina/${jezik}.json`
        /*$.getJSON(imeDatoteke, (data) => {*/
        if (jezik == "sl")
            data = slJson;
        else
            data = enJson;

        if (lokacija == "fes") {
            $(".display").addClass("visually-hidden");
            $(".no-display").removeClass("visually-hidden");
        }
        else {
            $(".display").removeClass("visually-hidden");
            $(".no-display").addClass("visually-hidden");
        }

        for (let i = 0; i < dnevi.length; i++) {
            let string = "";
            if (data[lokacija][DneviEng[i]] == undefined)
            {
                dnevi[i].parentNode.style.display = "none";
                continue;
            }
            if (dnevi[i].parentNode.style.display == "none")
                dnevi[i].parentNode.style.display = "block";
            for (let k = 0; k < data[lokacija][DneviEng[i]].length; k++) {
                string += `<h3>${data[lokacija][DneviEng[i]][k].naslov}</h3><p>`;
                for (let j = 0; j < data[lokacija][DneviEng[i]][k].vrstice.length; j++) {
                    string += `${data[lokacija][DneviEng[i]][k].vrstice[j]}<br>`
                }
                string += "</p>"
            }
            dnevi[i].innerHTML = string;
            poravnaj(dnevi[i].parentNode);
        }
        /*});*/
    }
});

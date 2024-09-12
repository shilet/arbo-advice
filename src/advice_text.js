let dfZinnen = {};

function readCSVFile(filename) {
    return fetch(filename)
        .then(response => response.text())
        .then(text => {
            let lines = text.trim().split('\n');
            lines.forEach(line => {
                let [key, value] = line.split(';');
                // Replace '\\n' with '\n' in the value
                //if (value) {
                //    console.log(value)
                //    value = value.replace(/\\n/g, '\n');
                //    console.log(value)
                //}
                dfZinnen[key.trim()] = value ? value.trim() : '';
            });
        })
        .catch(error => console.error('Error reading CSV file:', error));
}

// Load the CSV file once when the page loads
document.addEventListener("DOMContentLoaded", function() {
    readCSVFile('spreekuur.txt').then(() => {
        console.log('CSV data loaded into dfZinnen:', dfZinnen);
    });
});


// Function to create diagnosis text based on the values and the parsed diagnosis data
function maakTextDiagnose(values, dfDiag) {
    let d = values['diagnose'];
    let dfSingleDiag = dfDiag.find(item => item.Code === d);

    let tmp1 = dfSingleDiag.Code.replace('\\n', '\n');
    let tmp2 = dfSingleDiag.Description.replace('\\n', '\n');
    let tt = tmp1 + "\n" + tmp2;
    return tt;
}

// Function to generate feedback based on form values and predefined text snippets
function maakTerugkoppeling(values) {

    //readCSVFile('spreekuur.txt').then(dfZinnen => {
    //    console.log(dfZinnen);  // dfZinnen is now available with the CSV data.
    // });

    console.log("Maak terugkoppeling ", dfZinnen)
    let gender, capitalGender, naam, capitalNaam;

    if (values["gender"] === 'vrouw') {
        gender = "zij";
        capitalGender = "Zij";
        naam = 'mw. ' + values['naam'];
        capitalNaam = 'Mw. ' + values['naam'];
    } else {
        gender = "hij";
        capitalGender = "Hij";
        naam = 'dhr. ' + values['naam'];
        capitalNaam = 'Dhr. ' + values['naam'];
    }

    let prognose = values['prognose'] || 'onbekend';
    let startschema = values['startschema'] || 'onbekend';
    let huidigeUren = parseInt(values['huidige_uren']);
    let strHuidigeUren = huidigeUren === 0 ? " nog niet" : `${huidigeUren} uren`;

    // Constructing text components
    let textAo = dfZinnen['ao'];
    console.log("AO: ", textAo, "\nstartschema: ", startschema)
    let textStatus = dfZinnen['update'] + (huidigeUren === 0 ? dfZinnen['status0'] : dfZinnen['status1']);

    // Mental
    let textHerstel = "";
    if (values['diagnose_group'] === 'mental') {
            textHerstel = dfZinnen['mentaal'] + ' ' + dfZinnen[`fase${values['fase'].slice(-1)}`];
    }

    // Other
    let textAdvies = "";
    if (values['diagnose_group'] === 'other') {
        textAdvies = dfZinnen['reintegratie'] + dfZinnen[values['werk']];
        if(startschema !== 'onbekend')
        {
           textAdvies += dfZinnen['schema0']
        }
        else
            console.log("startschema onbekend")
        if(values['opbouw']=='opbouw')
        {
           textAdvies += prognose !== 'onbekend' ? dfZinnen['hervattingPrognose'] : dfZinnen['hervattingGeenPrognose'];
           textAdvies += dfZinnen['evaluatie1'];
        }
        else
        {
            textAdvies += dfZinnen['evaluatie2'];
        }

       /*
       if (values['opbouw'] == 'opbouw') {
            textAdvies += prognose !== 'onbekend' ? dfZinnen['hervattingPrognose'] : dfZinnen['hervattingGeenPrognose'];

        }
        else if (values['opbouw'] === 'geen_opbouw' && huidigeUren === 0 )
        {
            textAdvies += dfZinnen['evaluatie1']
        }
        else if (values['opbouw']=='geen_opbouw')
            {

            }
        }
*/
    }

    let textBeperkingen = dfZinnen['beperkingen'];
    if (values['pb']) textBeperkingen += dfZinnen['beperkingen_P'];
    if (values['sb']) textBeperkingen += dfZinnen['beperkingen_S'];
    if (values['fb']) textBeperkingen += dfZinnen['beperkingen_F'];
    if (values['eb']) textBeperkingen += dfZinnen['beperkingen_E'];

    let textPa = values['probleemanalyse'] ? dfZinnen['pa'] : '';
    let textIzp = values['izp'] ? dfZinnen['izp'] : '';

    let textPrognose = '\nPROGNOSE\n'
    if (prognose === 'onbekend') {
         textPrognose += 'De prognose voor volledige werkhervatting is op dit moment nog onduidelijk.';
    } else {
        textPrognose += 'Volledige werkhervatting wordt verwacht binnen ongeveer ' + prognose + '.\n';
    }


//    let textPrognose = `\nPROGNOSE\nVolledige werkhervatting wordt verwacht binnen ongeveer ${prognose}.\n`;

    // Combine all parts into the final feedback text
    let terugkoppeling = textAo + textStatus + textHerstel + textAdvies + textIzp + textPa + textBeperkingen + textPrognose;

    // Replace placeholders
    terugkoppeling = terugkoppeling.replace(/\{werknemernaam\}/g, naam)
                                   .replace(/\{Werknemernaam\}/g, capitalNaam)
                                   .replace(/\{gender\}/g, gender)
                                   .replace(/\{Gender\}/g, capitalGender)
                                   .replace(/\{huidige_uren\}/g, strHuidigeUren)
                                   .replace(/\{startschema\}/g, startschema)
                                   .replace(/\{prognose\}/g, prognose);

    terugkoppeling = terugkoppeling.replace(/\\n/g, '\n');

    return terugkoppeling;
}


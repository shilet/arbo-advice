let diagnose = '';

// Elements corresponding to your columns
const colOtherDiag = document.getElementById('col_other_diag');
const colMentalDiag = document.getElementById('col_mental_diag');

// Initially, you might want to hide one of the sections
//colMentalDiag.style.display = 'none';  // Hide by default
colOtherDiag.style.display = 'none';   // Hide by default

function maakTerugkoppelingKlein(values) {
    let s = "hij gaat naar de winkel";
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
    s = capitalNaam + " gaat naar de winkel.";
    return s;
}


// Watch changes for each element
document.getElementById('naam').addEventListener('input', onSubmit);
document.querySelectorAll('input[name="gender_group"]').forEach(elem => {
    elem.addEventListener('change', onSubmit);
});
//document.getElementById('slider_contracturen').addEventListener('input', onSubmit);
document.getElementById('slider_huidige_uren').addEventListener('input', onSubmit);
document.getElementById('pb').addEventListener('change', onSubmit);
document.getElementById('sb').addEventListener('change', onSubmit);
document.getElementById('fb').addEventListener('change', onSubmit);
document.getElementById('eb').addEventListener('change', onSubmit);
document.querySelectorAll('input[name="diagnose_group"]').forEach(elem => {
    elem.addEventListener('change', onSubmit);
});
document.querySelectorAll('input[name="fase_group"]').forEach(elem => {
    elem.addEventListener('change', onSubmit);
});
document.querySelectorAll('input[name="werk_group"]').forEach(elem => {
    elem.addEventListener('change', onSubmit);
});
document.querySelectorAll('input[name="opbouw_group"]').forEach(elem => {
    elem.addEventListener('change', onSubmit);
});
document.getElementById('startschema').addEventListener('input', onSubmit);
document.getElementById('probleemanalyse').addEventListener('input', onSubmit);
document.getElementById('izp').addEventListener('input', onSubmit);
document.getElementById('prognose').addEventListener('input', onSubmit);


function onSubmit() {
    let values = {
        'naam': document.getElementById('naam').value,
        'gender': document.querySelector('input[name="gender_group"]:checked').value,
         //'contract_uren': document.getElementById('slider_contracturen').value,
        'huidige_uren': document.getElementById('slider_huidige_uren').value,
        'pb': document.getElementById('pb').checked,
        'sb': document.getElementById('sb').checked,
        'fb': document.getElementById('fb').checked,
        'eb': document.getElementById('eb').checked,
        'diagnose_group': document.querySelector('input[name="diagnose_group"]:checked').value,
        'opbouw': document.querySelector('input[name="opbouw_group"]:checked').value,
        'fase': document.querySelector('input[name="fase_group"]:checked').value,
        'werk': document.querySelector('input[name="werk_group"]:checked').value,
        'startschema': document.getElementById('startschema').value,
        'prognose': document.getElementById('prognose').value,
        'probleemanalyse': document.getElementById('probleemanalyse').checked,
        'izp': document.getElementById('izp').checked
    };
    let diagnoseGroup = values['diagnose_group']
    if (diagnoseGroup === 'mental') {
        colMentalDiag.style.display = 'block';  // Show mental diagnosis elements
        colOtherDiag.style.display = 'none';    // Hide other diagnosis elements
    } else {
        colMentalDiag.style.display = 'none';   // Hide mental diagnosis elements
        colOtherDiag.style.display = 'block';   // Show other diagnosis elements
    }
    //console.log("Values: ", values)
    let textTk = maakTerugkoppeling(values);
    document.getElementById('terugkoppeling').value = textTk;
}

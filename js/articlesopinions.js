import { render } from "mustache";
//------------------------------------------------------------------------

//---------------------------------------------------------------------------


//transformovanie nazorov do html
function opinion2html(opinion){

    //in the case of Mustache, we must prepare data beforehand:
    opinion.createdDate=(new Date(opinion.created)).toDateString();

    //get the template:
    const template = document.getElementById("mTmplOneOpinion").innerHTML;
    //use the Mustache:
    const htmlWOp =render(template,opinion);

    //delete the createdDate item as we created it only for the template rendering:
    delete(opinion.createdDate);

    //return the rendered HTML:
    return htmlWOp;


}

function opinionArray2html(sourceData){

    return sourceData.reduce((htmlWithOpinions,opn) => htmlWithOpinions+ opinion2html(opn),"");

}

//spracovanie dat a localStorage na stranku pri starte
let opinions = [];
const opinionsElm = document.getElementById("kontajnerNazorov");
if(localStorage.myCarsComments) {
    opinions = JSON.parse(localStorage.myCarsComments);
}
if (opinionArray2html(opinions)) {
    opinionsElm.innerHTML = opinionArray2html(opinions);
}
console.log(opinions);


//citanie dat z formulara
let myFrmElm=document.getElementById("formular");
if (myFrmElm) {
myFrmElm.addEventListener("submit",processOpnFrmData);
}

function processOpnFrmData(event) {
    event.preventDefault();
    var nopName,nopEmail,nopRadio, nopObr,nopUpoz;
    var inputs = document.getElementById("formular").elements;
    for (var i=0;i<inputs.length;i++) {
        if (inputs[i].nodeName === "INPUT" && inputs[i].name === "meno") {
            nopName = inputs[i].value.trim();
        }
        if (inputs[i].nodeName === "INPUT" && inputs[i].name === "email") {
            nopEmail = inputs[i].value.trim();
        }
        if (inputs[i].nodeName === "INPUT" && inputs[i].name === "url") {
            nopObr = inputs[i].value.trim();
        }
        if(inputs[i].checked && inputs[i].name === "typ") {
            nopRadio = inputs[i].value;
        }

        if (inputs[i].nodeName === "INPUT" && inputs[i].name === "upozornenia") {
            nopUpoz = inputs[i].checked;
        }
    }
    const nopOpn = document.getElementById("hltext").value.trim();

    //skontrolovanie ci povinne polia nie su prazdne
    const email = document.getElementById("mail");

    email.addEventListener("input", function (event) {
        if (email.validity.typeMismatch) {
            email.setCustomValidity("I am expecting an e-mail address!");
        } else {
            email.setCustomValidity("");
        }
    });
    //prida data z form do array
    const newOpinion = {
        name: nopName,
        email: nopEmail,
        obrazok: nopObr,
        typ: nopRadio,
        comment: nopOpn,
        created: new Date(),
        upozornenia: nopUpoz
    };
    console.log("New opinion:\n "+ JSON.stringify(newOpinion));
    opinions.push(newOpinion);
    localStorage.myCarsComments = JSON.stringify(opinions);
    opinionsElm.innerHTML+=opinion2html(newOpinion);
    window.alert("ked chces vidiet svoj nazor tak otvor konzolu pls\n" +
        " (a ked je nepekny, ta sa zamysli nad sebou hej?)");
    console.log("New opinion added");
    console.log(opinions);

    myFrmElm.reset();
}
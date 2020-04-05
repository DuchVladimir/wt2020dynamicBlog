import { render } from "mustache";

//--------------------------------------------------------------------------------------------------------------
//functions for transforming opinion(s) to Html code

function opinion2html(opinion) {
  //in the case of Mustache, we must prepare data beforehand:
  opinion.createdDate = new Date(opinion.Created).toDateString();

  //get the template:
  const template = document.getElementById("mTmplOneOpinion").innerHTML;
  //use the Mustache:

  const htmlWOp = render(template, opinion);

  //delete the createdDate item as we created it only for the template rendering:
  delete opinion.createdDate;

  //return the rendered HTML:
  return htmlWOp;
}

function opinionArray2html(sourceData) {
  return sourceData.reduce(
    (htmlWithOpinions, opn) => htmlWithOpinions + opinion2html(opn),
    ""
  ); //"" is the initial value of htmlWithOpinions in reduce. If we do not use it, the first member of sourceData will not be processed correctly
}

/*
//an alternate version of the above function. Uses for ... of instead of reduce
function opinionArray2html(sourceData){

    let htmlWithOpinions="";

    for(const opn of sourceData){
        htmlWithOpinions += opinion2html(opn);
    }

    return htmlWithOpinions;
}
*/

//--------------------------------------------------------------------------------------------------------------
//data and localStorage handling and redering opinions to the page at startup

let opinions = [];
const opinionsElm = document.getElementById("opinionsContainer");

if (localStorage.myTreesComments) {
  opinions = JSON.parse(localStorage.myTreesComments);
}

console.log(opinions);
opinionsElm.innerHTML = opinionArray2html(opinions);

//--------------------------------------------------------------------------------------------------------------
//Form processing functionality

const commFrmElm = document.getElementById("opnFrm");
commFrmElm.addEventListener("submit", processOpnFrmData);

function processOpnFrmData(event) {
  //1.prevent normal event (form sending) processing
  event.preventDefault();

  //2. Read and adjust data from the form (here we remove white spaces before and after the strings)
  const inputs = document.getElementById("opnFrm").elements;
  const nopName = inputs[0].value.trim();
  const nopEmail = inputs[3].value.trim();
  const nopKey = inputs[2].value.trim();
  const nopFile = inputs[1].value.trim();
  const nopprefer1 = inputs[7].checked;
  const nopprefer2 = inputs[8].checked;
  const nopprefer3 = inputs[9].checked;
  let nopRank;
  if (inputs[4].checked) nopRank = "Dobre";
  else if (inputs[5].checked) nopRank = "Zle";
  else nopRank = "Neutralne";
  const nopOpn = inputs[10].value.trim();
  //3. Add the data to the array opinions and local storage
  const newOpinion = {
    Name: nopName,
    Obr: nopFile,
    Key: nopKey,
    Email: nopEmail,
    Rank: nopRank,
    Rodinne: nopprefer1,
    Byty: nopprefer2,
    Pozemky: nopprefer3,
    Comment: nopOpn,
    Created: new Date()
  };

  console.log("New opinion:\n " + JSON.stringify(newOpinion));

  opinions.push(newOpinion);

  localStorage.myTreesComments = JSON.stringify(opinions);
  localStorage.removeItem(6);

  //4. Update HTML
  opinionsElm.innerHTML += opinion2html(newOpinion);

  //5. Reset the form
  commFrmElm.reset(); //resets the form
}

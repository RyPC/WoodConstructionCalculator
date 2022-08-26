var cutWood = [];
var uncutWood = [];
var interval;

//add uncut wood with given dimensions to list
function add() {
    var d1 = parseFloat(document.getElementById("d1").value);
    var d2 = parseFloat(document.getElementById("d2").value);
    var d3 = parseFloat(document.getElementById("d3").value);
    var q = parseFloat(document.getElementById("quantity").value);
    ds = [d1, d2, d3].sort((a, b) => a - b);
    ds.unshift(q);

    //check for all entered inputs
    if (containsNaN(ds)) {
        createNotification("Please make sure all fields are filled out");
        return;
    }

    //search through uncut wood list for other wood with the same dimensions
    var found = uncutWood.find(wood => {
        if (wood[1] == ds[1] && wood[2] == ds[2] && wood[3] == ds[3]) {
            wood[0] += q;
            return true;
        }
        return false;
    }, uncutWood);
    if (typeof found === "undefined") {
        uncutWood.push(ds);
    }


    createNotification(`${ds[0]} - ${ds[1]}x${ds[2]}x${ds[3]} added`);

    updateLists();
    clearInputs();
}

//remove uncut wood with given dimensions to list
function remove() {
    var d1 = parseFloat(document.getElementById("d1").value);
    var d2 = parseFloat(document.getElementById("d2").value);
    var d3 = parseFloat(document.getElementById("d3").value);
    var q = parseFloat(document.getElementById("quantity").value);
    var ds = [d1, d2, d3].sort((a, b) => a - b);
    ds.unshift(q);

    //check for all entered inputs
    if (containsNaN(ds)) {
        createNotification("Please make sure all fields are filled out");
        return;
    }
    //search through uncut wood list for other wood with the same dimensions
    var tooFew = false;
    var found = uncutWood.find(wood => {
        if (wood[1] == ds[1] && wood[2] == ds[2] && wood[3] == ds[3]) {
            if (wood[0] < ds[0]) {
                tooFew = true;
            }
            else {
                wood[0] -= q;
            }
            return true;
        }
        return false;
    }, uncutWood);


    if (typeof found === "undefined") {
        createNotification("No items with specified dimensions found");
    }
    else if (tooFew) {
        createNotification("Too few items to remove");
    }
    else {
        createNotification(`${ds[0]} - ${ds[1]}x${ds[2]}x${ds[3]} removed`);
    }

    updateLists();
    clearInputs();
}

//"cuts" wood from the inventory of uncut wood
function cut() {
    var d1 = parseFloat(document.getElementById("d1").value);
    var d2 = parseFloat(document.getElementById("d2").value);
    var d3 = parseFloat(document.getElementById("d3").value);
    var q = parseFloat(document.getElementById("quantity").value);
    var ds = [d1, d2, d3].sort((a, b) => a - b);
    ds.unshift(1);

    //check for all entered inputs
    if (containsNaN(ds)) {
        createNotification("Please make sure all fields are filled out");
        return;
    }
    var numCut = 0;
    while (q > 0) {
        //filter by wood containing both smallest values
        var possibleWood = uncutWood.filter(wood => wood.includes(ds[1]) && wood.includes(ds[2]));
        possibleWood.sort((a, b) => a[3] - b[3]);
        for (var i = 0; i < possibleWood.length; i++) {
            if (ds[3] <= possibleWood[i][3]) {
                var found = cutWood.find(wood => {
                    if (wood[1] == ds[1] && wood[2] == ds[2] && wood[3] == ds[3]) {
                        wood[0]++;
                        return true;
                    }
                    return false;
                }, cutWood);
                if (typeof found === "undefined") {
                    cutWood.push(ds);
                }


                possibleWood[i][0]--;
                if (ds[3] !== possibleWood[i][3]) {
                    var tds = [1, possibleWood[i][1], possibleWood[i][2], possibleWood[i][3] - ds[3]]
                    found = uncutWood.find(wood => {
                        if (wood[1] == tds[1] && wood[2] == tds[2] && wood[3] == tds[3]) {
                            wood[0]++;
                            return true;
                        }
                        return false;
                    }, uncutWood);
                    if (typeof found === "undefined") {
                        uncutWood.push(tds);
                    }
                }

                updateLists();
                numCut++;
                break;
            }
        }
        q--;
    }

    if (numCut === 0) {
        createNotification("No suitable items available for cut");
    }
    else if (numCut === parseFloat(document.getElementById("quantity").value)) {
        createNotification(`${numCut} - ${ds[1]}x${ds[2]}x${ds[3]} cut`);
    }
    else {
        createNotification(`Only ${numCut} - ${ds[1]}x${ds[2]}x${ds[3]} cut`);

    }
    console.log(numCut);

    clearInputs();

     
}

//updates displayed lists to match the uncutWood and cutWood arrays
function updateLists() {

    //remove any 0-quantity woods
    for (var i = uncutWood.length - 1; i >= 0; i--) {
        if (uncutWood[i][0] === 0) {
            uncutWood.splice(i, 1);
        }
    }

    //update uncut wood list
    var html = "";
    uncutWood.forEach(wood => {
        html += `<li>${wood[0]} - ${wood[1]}x${wood[2]}x${wood[3]}</li>`;
    });


    document.getElementById("uncut").innerHTML = html;


    //update cut wood list
    html = "";
    cutWood.forEach(wood => {
        html += `<li>${wood[0]} - ${wood[1]}x${wood[2]}x${wood[3]}</li>`;
    });


    document.getElementById("cut").innerHTML = html;

}

//makes sure that dimension values are not greater than 5 characters in length
function checkNum(id) {
    element = document.getElementById(id)
    if (element.value.length > 5) {
        element.value = element.value.substring(0, 5);
    }
}

//check if the given list contains any NaN values
function containsNaN(list) {
    return typeof list.find(x => isNaN(x)) !== "undefined";
}

//clears the input boxes for next piece
function clearInputs() {
    document.getElementById("d1").value = "";
    document.getElementById("d2").value = "";
    document.getElementById("d3").value = "";
    document.getElementById("quantity").value = "";
}

//creates a notification that fades after a period of time
function createNotification(message) {
    clearInterval(interval);
    document.getElementById("notification").innerHTML = message;
    document.getElementById("notification").style.opacity = 1;
    interval = setInterval(() => {
        document.getElementById("notification").style.opacity -= 0.0125;
    }, 80)
}
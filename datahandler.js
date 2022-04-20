var dataset;
var rsum;

//fetch data from json page and return it
async function fetchJSON(page){
    var d;
    await $.getJSON(page, async function(data){
        d = data;
    }).fail(function(){
        console.log("An error has occurred.");
    });
    return d;
}


document.addEventListener('DOMContentLoaded', async() => {
    dataset = await fetchJSON("data.json");
    rsum = await fetchJSON("rsum.json");
    await drawPieChart();
    await drawBar();
});
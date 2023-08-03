d3.csv("college.csv").then(function (data) {
  var college = data;
  var button = d3.select("#button");
  var form = d3.select("#form");
  var searchList = d3.select("#search-list");
  var options = [...new Set(college.map(entry => entry.Institute + " - " + entry['Academic Program Name']))];
  
  options.forEach(function (option) {
    searchList.append("option").attr("value", option);
  });

  button.on("click", runEnter);
  form.on("submit", runEnter);

  function runEnter() {
    d3.select("tbody").html("");
    d3.event.preventDefault();
    var inputValue = d3.select("#user-input").property("value");
    var filteredCollege = college.filter(entry => entry.Institute.includes(inputValue) || entry['Academic Program Name'].includes(inputValue));
    
    if (filteredCollege.length === 0) {
      // Display a message if no matching data found
      d3.select("tbody")
        .append("tr")
        .append("td")
        .attr("colspan", 11)
        .style("text-align", "center")
        .text("No matching colleges found.");
      return;
    }

    var output = _.sortBy(filteredCollege, ['Round', 'Year'], ['asc', 'asc']).reverse();

    for (var i = 0; i < output.length; i++) {
      d3.select("tbody").append("tr").html(
        "<td>" + (i + 1) + "</td>" +
        "<td>" + output[i]['Institute'] + "</a>" + "</td>" +
        "<td>" + output[i]['Academic Program Name'] + "</td>" +
        "<td>" + output[i]['Quota'] + "</td>" +
        "<td>" + output[i]['SeatType'] + "</td>" +
        "<td>" + output[i]['Gender'] + "</td>" +
        "<td>" + output[i]['Opening Rank'] + "</td>" +
        "<td>" + output[i]['Closing Rank'] + "</td>" +
        "<td>" + output[i]['Year'] + "</td>" +
        "<td>" + output[i]['Round'] + "</td>"
      );
    }
  }
});

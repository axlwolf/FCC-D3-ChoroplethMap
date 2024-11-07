let countyURL =
  "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json";
let educationURL =
  "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json";

// Define symbols for unique property keys
const COUNTY_DATA = Symbol("countyData");
const EDUCATION_DATA = Symbol("educationData");

const appState = {
  [COUNTY_DATA]: null,
  [EDUCATION_DATA]: [],
};

// Scales for the chart
const chartScales = {
  yScale: null,
  xScale: null,
};

// Axes for the chart
const chartAxes = {
  xAxis: null,
  yAxis: null,
};

// Dimensions for the SVG canvas
const canvasDimensions = {
  width: 1200,
  height: 600,
  padding: 50,
};

const svgCanvas = d3.select("svg");
const tooltip = d3.select("#tooltip");

// Function to set up the SVG canvas dimensions
const setupCanvas = () => {
  svgCanvas.attr("width", canvasDimensions.width);
  svgCanvas.attr("height", canvasDimensions.height);
};

// Function for draw chart choropleth_map
let drawMap = () => {
  svgCanvas
    .selectAll("path")
    .data(appState[COUNTY_DATA])
    .enter()
    .append("path")
    .attr("d", d3.geoPath())
    .attr("class", "county")
    .attr("fill", (countyDataItem) => {
      let id = countyDataItem["id"];
      let county = appState[EDUCATION_DATA].find((item) => {
        return item["fips"] === id;
      });
      let percentage = county["bachelorsOrHigher"];
      if (percentage <= 15) {
        return "tomato";
      } else if (percentage <= 30) {
        return "orange";
      } else if (percentage <= 45) {
        return "lightgreen";
      } else {
        return "limegreen";
      }
    })
    .attr("data-fips", (countyDataItem) => {
      return countyDataItem["id"];
    })
    .attr("data-education", (countyDataItem) => {
      let id = countyDataItem["id"];
      let county = appState[EDUCATION_DATA].find((item) => {
        return item["fips"] === id;
      });
      let percentage = county["bachelorsOrHigher"];
      return percentage;
    })
    .on("mouseover", (countyDataItem) => {
      tooltip.transition().style("visibility", "visible");

      let id = countyDataItem["id"];
      let county = appState[EDUCATION_DATA].find((item) => {
        return item["fips"] === id;
      });

      tooltip.text(
        county["fips"] +
          " - " +
          county["area_name"] +
          ", " +
          county["state"] +
          " : " +
          county["bachelorsOrHigher"] +
          "%"
      );
      tooltip.attr("data-education", county["bachelorsOrHigher"]);
    })
    .on("mouseout", (countyDataItem) => {
      tooltip.transition().style("visibility", "hidden");
    });
};
// Event listener to run when the DOM content is loaded
document.addEventListener("DOMContentLoaded", async () => {
  //   console.log("Content loaded");
  //   const response = await fetch(dataUrl);
  //   const data = await response.json();

  //   appState[COUNTY_DATA] = data.baseTemperature;
  //   appState[EDUCATION_DATA] = data.monthlyVariance;

  //   console.log({ data: appState[EDUCATION_DATA] });

  //   setupCanvas();
  //   generateChartScales();
  //   drawCells();
  //   generateAxis();
  d3.json(countyURL).then((data, error) => {
    if (error) {
      console.log(log);
    } else {
      appState[COUNTY_DATA] = topojson.feature(
        data,
        data.objects.counties
      ).features;
      console.log(appState[COUNTY_DATA]);

      d3.json(educationURL).then((data, error) => {
        if (error) {
          console.log(error);
        } else {
          appState[EDUCATION_DATA] = data;
          console.log(appState[EDUCATION_DATA]);
          drawMap();
        }
      });
    }
  });
});

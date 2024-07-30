// Build the metadata panel
function buildMetadata(test_subject_id) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // get the metadata field
    let metadata = data.metadata
  
    // Filter the metadata for the object with the desired sample number
    let metadata_subject = metadata.find((metadata_element) => (metadata_element.id == test_subject_id))
    console.log(metadata_subject)
    // Use d3 to select the panel with id of `#sample-metadata`
    let metadata_panel = d3.select('#sample-metadata');

    // Use `.html("") to clear any existing metadata
    metadata_panel.html("")

    // Inside a loop, you will need to use d3 to append new
    // tags for each key-value in the filtered metadata.
    let keys = Object.keys(metadata_subject)
    let metadata_panel_ul = metadata_panel.append("ul")
    for (i = 0; i < keys.length; i++ ) {
        let key = keys[i]
        let value = metadata_subject[key]
        let card_content = `${key.toUpperCase()} : ${value}`
        console.log(card_content)
        metadata_panel_ul.append('li').text(card_content).attr("class", "list-group-item")
    
    }

  });
}

// function to build both charts
function buildCharts(test_subject_id) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
    // // Get the samples field
    let samples = data.samples

    function findSample(sample) {
        return sample.id == test_subject_id;
    }

    // Filter the samples for the object with the desired sample number
    let sample = data.samples.find(findSample);


    // Get the otu_ids, otu_labels, and sample_values
    let otu_ids = sample.otu_ids
    let otu_labels = sample.otu_labels
    let sample_values = sample.sample_values

    // Build a Bubble Chart
    var trace = {
        x: otu_ids,
        y: sample_values,
        mode: 'markers',
        text: otu_labels,
        marker: {
          size: sample_values,
          color: otu_ids,
        }
      };
  
      var data_bubble = [trace];
  
      var layout = {
        title: 'Bacteria Cultures Per Sample',
        xaxis: {title: 'OTU ID'},
        yaxis: {title: 'Number of Bacteria'},
        showlegend: false,
        height: 600,
        width: 1000
      };
  
  
    // Render the Bubble Chart
    Plotly.newPlot('bubble', data_bubble, layout);

    // For the Bar Chart, map the otu_ids to a list of strings for your yticks
    // Don't forget to slice and reverse the input data appropriately

    let otu_ids_sliced = sample.otu_ids.slice(0,10).reverse()
    let otu_labels_sliced = sample.otu_labels.slice(0,10).reverse()
    let sample_values_sliced = sample.sample_values.slice(0,10).reverse()

    let trace1 = {
        y : otu_ids_sliced.map(object => `OTU ${object}`),
        x : sample_values_sliced,
        type: 'bar',
        text : otu_labels_sliced,
        orientation : 'h',
        marker: {
            color: 'green',
            line:{
                color: 'rgb(8,48,107)',
                width: 1.5
            }
          }
    }
    // Build a Bar Chart
    let data_chart = [trace1]

    // Apply title to the layout
    let layout1 = {
        title: 'Top 10 Bacteria Cultures Found',
        xaxis: {title: 'Number of Bacteria'},
        margin: {
          l: 100,
          r: 100,
          t: 100,
          b: 100
        }
      };

    // Render the Bar Chart
    Plotly.newPlot('bar', data_chart,layout1);
  });
}


// Use d3 to select the dropdown with id of `#selDataset`
function setupDropdown(names) {
    // Use the list of sample names to populate the select options
    // Hint: Inside a loop, you will need to use d3 to append a new
    // option for each sample name.
    let dropdown = d3.select("#selDataset");
    for (let i = 0; i < names.length; i++) {
        let name = names[i];
        dropdown.append("option").text(name).property("value", name);
    }
    // this is how we saw it in class, I was just playing around with the options.
    // add action to dropdown
    // dropdown.on("change", function(event) {
    //     optionChanged(event.target.value);
    // });
}

// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
    console.log(data)
    // Use d3 to set up the dropdown

    setupDropdown(data.names)

    // Get the first sample from the list
    let sample = data.samples[0]

    // Build charts and metadata panel with the first sample
    buildCharts(sample.id);
    buildMetadata(sample.id);
  });
}

// Function for event listener
function optionChanged(test_subject_id) {
  // Build charts and metadata panel each time a new sample is selected
  console.log(test_subject_id)
//   console.log(metadata)
  buildCharts(test_subject_id)
  buildMetadata(test_subject_id)
}

// Initialize the dashboard
init();



/////
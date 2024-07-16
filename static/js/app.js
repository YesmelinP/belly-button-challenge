
// Build the metadata panel
function buildMetadata(test_subject_id) {
    // Fetch the data from the provided URL
    d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json")
        .then((data) => {
            // Get the metadata field
            let metadata = data.metadata;

            // Filter the metadata for the object with the desired sample number
            let metadata_subject = metadata.find((element) => element.id == test_subject_id);
            console.log("Metadata for Subject ID", test_subject_id, ":", metadata_subject);

            // Check if metadata is found
            if (!metadata_subject) {
                console.error("Metadata not found for Subject ID:", test_subject_id);
                return;
            }

            // Use d3 to select the panel with id of `#sample-metadata`
            let metadata_panel = d3.select('#sample-metadata');

            // Clear any existing metadata
            metadata_panel.html("");

            // Create an unordered list for metadata display
            let keys = Object.keys(metadata_subject);
            let metadata_panel_ul = metadata_panel.append("ul");

            // Loop through each key-value pair in the filtered metadata
            keys.forEach(key => {
                let value = metadata_subject[key];
                let card_content = `${key.toUpperCase()} : ${value}`;
                console.log(card_content); // Log each metadata item
                metadata_panel_ul.append('li').text(card_content).attr("class", "list-group-item");
            });
        })
        .catch(error => console.error("Error fetching metadata:", error));
}

// Function to build both charts
function buildCharts(test_subject_id) {
    // Fetch the data
    d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json")
        .then((data) => {
            // Get the samples field
            let samples = data.samples;

            // Find the sample matching the selected subject ID
            let sample = samples.find((s) => s.id == test_subject_id);
            console.log("Sample data for Subject ID", test_subject_id, ":", sample);

            // Check if sample is found
            if (!sample) {
                console.error("Sample not found for Subject ID:", test_subject_id);
                return;
            }

            // Get the otu_ids, otu_labels, and sample_values
            let otu_ids = sample.otu_ids;
            let otu_labels = sample.otu_labels;
            let sample_values = sample.sample_values;

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

            // Set the layout for the Bubble Chart
            var layout = {
                title: 'Bacteria Cultures Per Sample',
                xaxis: { title: 'OTU ID' },
                yaxis: { title: 'Number of Bacteria' },
                showlegend: false,
                height: 600,
                width: 1000
            };

            // Render the Bubble Chart
            Plotly.newPlot('bubble', data_bubble, layout);

            // Prepare data for the Bar Chart (Top 10 OTUs)
            let otu_ids_sliced = sample.otu_ids.slice(0, 10).reverse();
            let otu_labels_sliced = sample.otu_labels.slice(0, 10).reverse();
            let sample_values_sliced = sample.sample_values.slice(0, 10).reverse();

            console.log("Top 10 OTUs:", otu_ids_sliced, otu_labels_sliced, sample_values_sliced);

            // Create the Bar Chart trace
            let trace1 = {
                y: otu_ids_sliced.map(object => `OTU ${object}`),
                x: sample_values_sliced,
                type: 'bar',
                text: otu_labels_sliced,
                orientation: 'h',
                marker: {
                    color: 'green',
                    line: {
                        color: 'rgb(8,48,107)',
                        width: 1.5
                    }
                }
            };

            // Build a Bar Chart
            let data_chart = [trace1];

            // Set layout for the Bar Chart
            let layout1 = {
                title: 'Top 10 Bacteria Cultures Found',
                xaxis: { title: 'Number of Bacteria' },
                margin: {
                    l: 100,
                    r: 100,
                    t: 100,
                    b: 100
                }
            };

            // Render the Bar Chart
            Plotly.newPlot('bar', data_chart, layout1);
        })
        .catch(error => console.error("Error fetching samples:", error));
}

// Use d3 to select the dropdown with id of `#selDataset`
function setupDropdown(names) {
    // Populate the select options with sample names
    let dropdown = d3.select("#selDataset");
    names.forEach(name => {
        dropdown.append("option").text(name).property("value", name);
    });

    // Add action to dropdown for sample selection
    dropdown.on("change", function(event) {
        optionChanged(event.target.value);
    });
}

// Function to run on page load
function init() {
    // Fetch the data
    d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json")
        .then((data) => {
            console.log("Data loaded:", data);

            // Set up the dropdown with sample names
            setupDropdown(data.names);

            // Get the first sample from the list
            let sample = data.samples[0];

            // Build charts and metadata panel with the first sample
            buildCharts(sample.id);
            buildMetadata(sample.id);
        })
        .catch(error => console.error("Error fetching initial data:", error));
}

// Function for event listener when dropdown value changes
function optionChanged(test_subject_id) {
    console.log("Selected Subject ID:", test_subject_id);

    // Build charts and metadata panel each time a new sample is selected
    buildCharts(test_subject_id);
    buildMetadata(test_subject_id);
}

// Initialize the dashboard
init();

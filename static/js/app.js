// URL for JSON data
const jsonDataUrl = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// Initialize the dashboard
function initializeDashboard() {
    let selector = d3.select("#selDataset");

    // Fetching the JSON data
    d3.json(jsonDataUrl).then(data => {
        let sampleNames = data.names;

        sampleNames.forEach(name => {
            selector.append("option").text(name).property("value", name);
        });

        // Use the first sample from the list to build the initial plots
        const firstSample = sampleNames[0];
        createBarChart(firstSample);
        createBubbleChart(firstSample);
        displayMetadata(firstSample);
    });
}

// Function to display metadata
function displayMetadata(sample) {
    d3.json(jsonDataUrl).then(data => {
        let metadataInfo = data.metadata.filter(item => item.id == sample)[0];
        let panel = d3.select("#sample-metadata");
        panel.html("");
        Object.entries(metadataInfo).forEach(([key, value]) => {
            panel.append("h6").text(`${key.toUpperCase()}: ${value}`);
        });
    });
}

// Function to create a bar chart
function createBarChart(sample) {
    d3.json(jsonDataUrl).then(data => {
        let sampleData = data.samples.filter(item => item.id == sample)[0];
        let trace = {
            x: sampleData.sample_values.slice(0, 10).reverse(),
            y: sampleData.otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse(),
            text: sampleData.otu_labels.slice(0, 10).reverse(),
            type: 'bar',
            orientation: 'h'
        };
        let layout = {
            title: "Top 10 OTUs",
            margin: { t: 30, l: 150 }
        };
        Plotly.newPlot("bar", [trace], layout);
    });
}

// Function to create a bubble chart
function createBubbleChart(sample) {
    d3.json(jsonDataUrl).then(data => {
        let sampleData = data.samples.filter(item => item.id == sample)[0];
        let trace = {
            x: sampleData.otu_ids,
            y: sampleData.sample_values,
            text: sampleData.otu_labels,
            mode: 'markers',
            marker: {
                size: sampleData.sample_values,
                color: sampleData.otu_ids,
                colorscale: "Jet"
            }
        };
        let layout = {
            title: "OTU ID Bubble Chart",
            xaxis: { title: "OTU ID" },
            yaxis: { title: "Sample Values" }
        };
        Plotly.newPlot("bubble", [trace], layout);
    });
}

// Function to handle change event
function optionChanged(newSample) {
    createBarChart(newSample);
    createBubbleChart(newSample);
    displayMetadata(newSample);
}

// Initialize the dashboard
initializeDashboard();

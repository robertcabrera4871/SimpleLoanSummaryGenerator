/* 
This program uses javascript to read a JSON file. It then generates two additional JSON files with
Calculation on LoanAmount, SubjectAppraisedAmount, and InterestRate
==========================================
 Author: Robert Cabrera
 Date:   6 January 2022
==========================================
 */

// Importing JSON for calculations
const data = require('./loans.json')
// Import file creation utility
const fs = require('fs')

// Calling function to create JSON Files
writeJSON("monthlySummary.json", generateReport())
writeJSON("monthlyByState.json", generateSummaryByState())


// Function for generating a summary. Works for filtered data and whole dataset
function generateSummary(field, chosenData){
    var sum = 0
    var dataArray = []
    var summaryData = ""
    // Chosing between whole dataset and filtered data
    if(chosenData === undefined){
        summaryData = [...data]
    } else{
        summaryData = chosenData
    }
    // Converting data to array and calculating sum
    for(const i in summaryData){
       sum += summaryData[i][field]
       dataArray.push(summaryData[i][field])
    }
    // Calling other functions for calculations and creating javascript object from results
    const resultObject =  {
            "Sum": round(sum),
            "Avg": round(sum / dataArray.length),
            "Median": findMedian(dataArray),
            "Min" : findMinimum(dataArray),
            "Max": findMaximum(dataArray)
        }
    return resultObject
}

// Function for generating a summary by State
function generateSummaryByState(){
    const states = getSubjectStates()
    // Initialize result object with states
    var resultObject = {}
    states.forEach((value) => {
        resultObject[value] = {}
    })
    // Filter whole dataset based on state and appending report for that state
    // to the corresponding state in result object
    states.forEach((value) => {
        var unfilteredData = [...data]
        var filteredData = []
        for(const i in unfilteredData){
            if(unfilteredData[i].SubjectState === value){
                filteredData.push(unfilteredData[i])
            }
        }

        resultObject[value] = generateReport(filteredData)
    })

    return resultObject
}

// Function for generating the LoanAmountSummary, SubjectAppraisedAmountSummary, and InterestRateSummary,
// option for generating report based on filtered data. If no chosenData is passed, will generate report
// for the entire dataset
function generateReport(chosenData){
    return {
        "LoanAmountSummary": generateSummary("LoanAmount", chosenData),
        "SubjectAppraisedAmountSummary": generateSummary("SubjectAppraisedAmount", chosenData),
        "InterestRateSummary": generateSummary("InterestRate", chosenData)
    }    
}


// Function for getting unique states from dataset
function getSubjectStates(){
    var stateSet = new Set()
    for(const i in data){
        stateSet.add(data[i].SubjectState)
    }
    return stateSet
}

// Functions for calculations
function findMedian(data){
    const sortedData = [...data].sort();
    const medianIndex = Math.floor(sortedData.length / 2)
    if(sortedData.length % 2) return sortedData[medianIndex]
    return round(sortedData[medianIndex - 1] + sortedData[medianIndex] / 2.0)
}
function findMinimum(data){
    const sortedData = [...data].sort();
    return round(sortedData[0])
}
function findMaximum(data){
    const sortedData = [...data].sort();
    return round(sortedData[sortedData.length - 1])
}

function round(num){
    return +(num.toFixed(2))
}

// Function to write Javascript object to a JSON file
function writeJSON(fileName, data){
    fs.writeFile(fileName, JSON.stringify(data, null, "\t"), (err) =>{
        if(err){
            throw err;
        }
    })
    console.log("JSON file written to " + fileName)
}
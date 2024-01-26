let table; // Variable to store the CSV data
let dataArray = []; // Array to store the data
let alphabetArray = [];

let inputs = [];
let TopnumRows = 2;
let TopnumCols = 13;
let tableOffsetY = 0; // Adjust this value to move the table lower

let inputValues = [];

let matchingEntries = 0; // Counter for matching entries
let countDashes = 0;

function setup() {
  createCanvas(700, 950);

///////////////////////////////////////////////////////////////////////////////////////////////////
// ASSIGN A RANDOM NUMBER TO EACH ALPHABET LETTER AND KEEP IN alphabetARRAY
  let usedNumbers = []; // Keep track of used numbers

  for (let i = 0; i < 26; i++) {
    let letter = String.fromCharCode(65 + i); // Convert ASCII code to uppercase letter
    let isTrue = Math.random() < 0.5; // Random true/false value
    let number;

    do {
      number = Math.floor(Math.random() * 26) + 1; // Generate a random number from 1 to 26
    } while (usedNumbers.includes(number)); // Ensure the number is unique

    usedNumbers.push(number);

    let letterObject = {
      letter: letter,
      number: number,
    };
    alphabetArray.push(letterObject);
  }

  alphabetArray.push({ letter: "-", number: 0 }); // add this entry to handle the blank squares

  // // Print each object separately in a structured format
  // for (let i = 0; i < alphabetArray.length; i++) {
  //   console.log(alphabetArray[i]);
  // }

/////////////////////////////////////////////////////////////////////////////////////////////////
// Load the CSV file within the setup function
  table = loadTable("codeword.csv", "csv", "header", processData);
}

function processData(data) {
  let rows = data.getRows();
  

  // Loop through the array and access the values
  for (let i = 0; i < rows.length; i++) {
    let square = rows[i].getNum("square");
    let letter = rows[i].getString("letter");
    let show   = rows[i].getString("show");
    
    // counting the number of dashes '-'
    if (letter === "-"){
      countDashes++
    }

    // Check if 'letter' is not blank before adding to the array
    if (letter !== "") {
      // Find the corresponding 'number' in the alphabetArray
      let alphabetEntry = alphabetArray.find(
        (entry) => entry.letter === letter
      );

      if (alphabetEntry) {
        // If a matching entry is found, add it to the dataArray
        dataArray.push({ square, letter, number: alphabetEntry.number, show });
      }
    }
  }
  
  console.log("dashes: " + countDashes);
  // Now, dataArray contains the data from the CSV file
//   console.log(dataArray[2]);
//   console.log(dataArray[224].number);

//   console.log("dataArray length:", dataArray.length);

  ///////////////////////////////////////////////////////////////////////////////////////////////
  // TOP PART

  // Set canvas background and border color
  background(255); // White background
  stroke(0); // Black border

  // Calculate the width and height of each cell
  let TopcellWidth = width / TopnumCols;
  let TopcellHeight = TopcellWidth; // the same as the width
  let cellNumber = 1; // Variable to keep track of the number

  for (let row = 0; row < TopnumRows; row++) {
    for (let col = 0; col < TopnumCols; col++) {
      // Calculate the position of the cell
      let x = col * TopcellWidth;
      let y = row * TopcellHeight + tableOffsetY;

      fill(255); // White background for non-gray squares
      rect(x, y, TopcellWidth, TopcellHeight);

      // Display the number in the top-left corner with a contrasting color
      textSize(12);
      fill(0); // Set text color to black
      text(cellNumber, x + 5, y + 14);

      // Create an input element for each cell
      let input = createInput();
      input.input(validateInput);
      
      input.size(24);
      input.position(x + 15, y + 18); // Adjust the position for spacing
      input.style("border", "none"); // Remove the border
      input.style("font-size", "26px");

      // Increment the cellNumber for the next cell
      cellNumber++;

      // Store the input element in the array
      inputs.push(input);
    }
  }
  

    ///////////////////////////////////////////////////////////////////////////////////////////////
}

function draw() {
  ///////////////////////////////////////////////////////////////////////////////////////////////
  if (mouseIsPressed) {
    inputValues = getValuesFromInputs();
    //console.log(inputValues);
    //console.log(inputValues[0]);

    for (let i = 0; i < dataArray.length; i++) {
      let numberValue = dataArray[i].number; // Get the 'number' value from dataArray
      if (numberValue >= 1 && numberValue <= inputValues.length) {
        dataArray[i].guess = inputValues[numberValue - 1]; // Subtract 1 to access the correct index   
      } else {
        dataArray[i].guess = ""; // Handle cases where 'number' is out of range
      }
    }

  }

  ////////////////////////////////////////////////////////////////////////////////////////////////
  /// OUTPUT THE LETTERS BASED ON INPUT FROM TOP FRAME

  let numRows = 15;
  let numCols = 15;
  let cellWidth = width / numCols;
  let cellHeight = width / numRows;

  let count = 0; // Initialize the count to 0
  let letter = "A"; // Initialize the letter to 'A'

  for (let i = 0; i < numRows; i++) {
    for (let j = 0; j < numCols; j++) {
      let x = j * cellWidth;
      let y = i * cellHeight + 150;
      
      // Check if the letter is '-'
      if (dataArray[count].letter === "-") {
        fill(0); // Set the fill color to black
      } else {
        fill(255); // Set the fill color to white for other letters
      }
      
      rect(x, y, cellWidth, cellHeight);
      
      // Display the count at the top-left corner of the square
      fill(0); // Set text color to black
      textSize(12); // Set the text size
      textAlign(LEFT, TOP); // Align text to the top-left corner
      text(dataArray[count].number, x + 2, y + 3); // Adjust the position for the number
      
      
      // Display the SHOW letter to start game
      fill(0); // Set text color to black
      textSize(24); // Set a larger text size
      textAlign(CENTER, CENTER); // Align text to the center
      text(
        dataArray[count].show,
        x + cellWidth / 2,
        y + (cellHeight + 15) / 2
      );

      // Display the letter in the center of the square
      fill(0); // Set text color to black
      textSize(24); // Set a larger text size
      textAlign(CENTER, CENTER); // Align text to the center
      text(
        dataArray[count].guess,
        x + cellWidth / 2,
        y + (cellHeight + 15) / 2
      );

      // rect(x, y, cellWidth, cellHeight);
            
      count++; // Increment the count for the next square
    }
  }
  
//////////////////////////////////////////////////////////////////////////////////////////////////////////
// Draw the 26 letters of the alphabet at the bottom
  
   // Clear the bottom section of the canvas every time
  let bottomSectionHeight = 100; // Adjust this value as needed
  fill(255); // White background color
  rect(0, height - bottomSectionHeight, width, bottomSectionHeight);
  
  
  let letterX = 20; // Initial X position for the letters
  let letterY = height - 60; // Y position for the letters
  let letterSize = 24; // Text size for the letters

  for (let i = 0; i < alphabetArray.length; i++) {
    let letterObject = alphabetArray[i];
    let letter = letterObject.letter;

    // Check if the letter is in the inputValues array
    let isUsed = inputValues.includes(letter);

    // Set the fill style based on whether the letter is used or not
    fill(isUsed ? color(150, 0, 0) : 0); // Red for used letters, black for unused letters

    // Draw the letter
    textSize(letterSize);
    text(letter, letterX, letterY);
    
    // // Draw a strikeout line for used letters
    if (isUsed) {
      let strikeoutY = letterY - letterSize / 2; // Position the strikeout line in the middle of the letter
      let x1 = letterX - 12;
      let x2 = letterX + textWidth(letter) - 6;
      //line(x1, strikeoutY, x2, strikeoutY); // Draw the strikeout line
      stroke(255, 0, 0); // Set the stroke color to yellow
      strokeWeight(3); // Set the stroke weight (thickness) to 3 pixels
      line(x1, strikeoutY + 20, x2, strikeoutY); // Draw the strikeout line
      stroke(0); // Reset the stroke to no color
      strokeWeight(1);
    }

    // Move the X position for the next letter
    letterX += textWidth(letter) + 10; // Add some spacing
  }
  
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // KEEP TRACK OF THE LETTER AND GUESS MATCHES
    inputValues = getValuesFromInputs();
    matchingEntries = 0;

    for (let i = 0; i < dataArray.length; i++) {
        if (dataArray[i].letter === dataArray[i].guess) {
          matchingEntries++;
        }
    }
   
    //console.log("Matching Entries: " + matchingEntries);
    console.log(dataArray[0]);
  
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // KEEP TRACK OF HOW MANY LETTERS ARE POPULATED IN THE TOP PART
  
  let populatedCount = 0;

  for (let i = 0; i < inputs.length; i++) {
    if (inputs[i].value() !== "") {
      // console.log(inputs[i]);
      populatedCount++;
    }
  }
  
  //console.log("Number of populated letter fields: " + populatedCount);
  
  //////////////////////////////////////////////////////////////////////////////////////////////
  // GAME OVER
  
  if (populatedCount === 26) {
    fill(55); // White background color
    rect(0, 107, width, 42);
    
    // rows and columns are multipled to get a square count and countDashes excludes the ones that are blacked out
    let percentageGuess =  matchingEntries / ((numRows * numCols) - countDashes) * 100;
    let roundedValue = round(percentageGuess);
    textSize(36); // Set the text size to 36
    textAlign(CENTER, CENTER); // Align text to the center of the canvas
    fill(255, 0, 0); // Set the fill color to red
    text("GAME OVER : " + roundedValue + "% accurate" , width / 2, 131); // Display "GAME OVER" in the center of the canvas
  }
  
  
  
}


function getValuesFromInputs() {
  let values = [];
  for (let i = 0; i < inputs.length; i++) {
    values.push(inputs[i].value());
  }
  return values;
}

function validateInput() {
  let userInput = this.value();

  if (userInput.length === 1 && userInput.match(/[A-Z]/)) {
    // Valid input

  } else {
    // Invalid input
    this.value(''); // Set the input to null or empty
  }
}
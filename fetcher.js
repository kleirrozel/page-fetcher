const fs = require("fs");
const readline = require('readline');
const request = require('request');

const args = process.argv.slice(2); 
const url = args[0]; // This will be the URL input in node: first input
const fileName = args[1]; // This is the save file: second input
// const { size } = fs.statSync(fileName); GIVING ME AN ERROR CANT WRITE NEW FILE. use body.length instead!

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// 3. Edge case: what would happen if:
//   3.1 The local file already exists -- prompt user to change the file name or exit the app readline
//   3.2 The local path is invalid -- app should fail and console.log the error to user
//   3.3 The URL results in an error -- terminate the app and console.log what went wrong

request(url, (error, response, body) => {
  if (error) {
    console.log(`${error}`); // Should print 'Error: REASON'
    process.exit();  

    } if (response && response.statusCode !== 200) {
      console.log(`ERROR: ${response && response.statusCode}`);// Should print if a response is received -- IT WORKS OONGGMGMGMGM  ----- 3.3 URL Results in an error
      process.exit();  
      
      } if (fs.existsSync(fileName)){ // Edge case: 3.1 The local file already exists -- prompt user to change the file name or exit the app
        console.log(`Sorry. This file already exists.`);
        rl.question(`Do you want to overwrite existing file? Y/N: `, answer => { 
          if (answer === "Y" || answer === "y") {
            request(url, (error, response, body) => {
            fs.writeFile(fileName, body, error => {
              if (!error) {
                console.log(`Downloaded and saved ${body.length} bytes to ${fileName}.`); 
                process.exit(); 
              }
            })
          })
          } else {
            process.exit(); 
          } 
        });

      } else {
        fs.writeFile(fileName, body, (error) => { // Will write new file! 
          if (!error) {
            console.log(`Downloaded and saved ${body.length} bytes to ${fileName}.`); 
            process.exit(); 
           }
        });
      }   
});
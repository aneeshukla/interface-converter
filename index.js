var fs = require("fs");
var s = require("underscore.string");
var readline = require('readline-sync');

var fromFile = readline.question("Enter path for interface file: ");
var toFile = readline.question("Enter the file name for the destination file: ");


//read line
var lineReader = require('readline').createInterface({
   input: require('fs').createReadStream(fromFile)
});

lineReader.on('line',async function (line) {
   //console.log('Line from file:', line);
   if (line.includes("interface")) {
      //console.log();
       await newInterface(line);
   }
   else if (line.includes(": ")) {
      await newProperty(line);
   }
   else if (line == "}") {
      await closingTags();
   }
});

function newInterface(line) {
   let arr = line.split(' ');
   responseName = s.dasherize(arr[2]);
   responseName = responseName.toUpperCase();
   responseName = responseName.replace(new RegExp('-', 'g'), '_');
   fs.appendFileSync(toFile, `

   const ${responseName}: ${arr[2]}Object = {
      description: '${arr[2]}',
      content: {
         'application/json': {
            schema: {
               type: 'object',
               properties: {`
         , (err) => {
            if (err) throw err;
            //console.log('Interface read!');
         });
}
function newProperty(line) {
   if (line.slice(-1) == ";")
      line = line.slice(0, -1);
   let prop = line.split(': ');
   if (prop[1] == "string" || prop[1] == "boolean" || prop[1] == "number" || prop[1] == "null") {
      fs.appendFileSync(toFile, `
               ${prop[0]}: {type: '${prop[1]}'},`
         , (err) => {
            if (err) throw err;
            //console.log('Interface read!');
         });
   }
   else {
      newObject(prop[0]);
   }
}
function newObject(name) {
   fs.appendFileSync(toFile, `
               ${name}: {
                  type: 'object',
                  properties: {
                  },
                  additionalProperties: true,
               },`
      , (err) => {
         if (err) throw err;
         //console.log('Interface read!');
      });
}
function closingTags() {
   fs.appendFileSync(toFile, `
               }    
            }
         }
      }
   }
   `, (err) => {
         if (err) throw err;
         console.log('Interface read!');
      });
}



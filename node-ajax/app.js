const express = require('express');
const csv = require('csvtojson');
const cors = require('cors')


/**
 *  init
 */
// init global variables
let worldDataJson; // saves json from csv
let properties; // saves property state
let currentMaxId; // saves max id to get unique id for next country

// init api
const app = express();
app.use(express.json());
app.use(cors());
csvToJson("assets/world_data_v3.csv");
app.listen(3000, () => {
    console.log("REST listening on port 3000")
});


/**
 *  routes
 */
// returns current world data
app.get('/items', (req, res) => res.json(worldDataJson));

app.get('/items/:id', (req, res) => {
    // get id from url and check if id is number
    const id = parseInt(req.params.id);
    if(isNaN(id)) {
        res.json({});
        return;
    }

    // retrieve country with id
    let result = {};
    for(let element of worldDataJson) {
        let currentId = parseInt(element["id"]);
        if(id === currentId)
            result = element;
    }
    // send item as response - if not found, result is empty
    res.json([result]);
});

app.get('/items/:id1/:id2', (req, res) => {
    // get ids from url and validate
    let id1 = parseInt(req.params.id1);
    let id2 = parseInt(req.params.id2);
    if(isNaN(id1) || isNaN(id2)) {
        res.json({});
        return;
    }

    // switch numbers if the first id is bigger than the second id, enable reversing
    let reverse = false;
    if (id1 > id2) {
        let p = id1;
        id1 = id2;
        id2 = p;
        reverse = true;
    }

    // filter the results with ids within range
    const result = worldDataJson.filter((element) => {
        const currentID = parseInt(element["id"]);
        return id1 <= currentID && currentID <= id2;
    });

    // reverse for fun
    if(reverse)
        result.reverse();

    // respond with json
    res.json(result);
});

app.post('/items', (req, res) => {
    // check if body is a list (additional feature)
    if(isIterable(req.body)) {
        for(let input of req.body) {
            // tries to add each country to json
            const msg = addCountryToJson(input);

            // if 0, the country was added, else a error message is returned
            if(msg !== 0) {
                res.send(msg);
                return;
            }
        }
    } else {
        // tries to add country to json
        const msg = addCountryToJson(req.body);

        // if 0, the country was added, else a error message is returned
        if(msg !== 0) {
            res.send(msg);
            return;
        }
    }
    res.send("Updated json successfully!");
});

app.delete('/items', (req, res) => {
    // removes the last item of the list of countries
    let length = worldDataJson.length;
    worldDataJson.splice(length-1, 1);
    res.send('Deleted last item from json successfully!');
});

app.delete('/items/:id', (req, res) => {
    // get id from url and validates it
    const id = parseInt(req.params.id);
    if(isNaN(id)) {
        res.send(`${req.params.id} is not a number!`);
        return;
    }

    // filters the list, excluding the item with the given id
    let foundElement = false;
    worldDataJson = worldDataJson.filter((element) => {
        if(id !== parseInt(element["id"])){
            return true;
        } else {
            foundElement = true;
            return false;
        }
    });

    // if an element was found, it was deleted, otherwise the operation was unsuccessful
    if(foundElement)
        res.send(`Deleted item with id ${id} from json successfully!`);
    else
        res.send(`Did not find item with id ${id}!`);
});

// returns current state of properties
app.get('/properties', (req, res) => {
    properties = properties.map((item) => {
       return {
           index: item["index"],
           name: item["name"],
           shown: true // enable all properties
       };
    });
    res.json(properties);
});

app.get('/properties/:num', (req, res) => {
    // get index from url and validate
    const index = parseInt(req.params.num);
    if(isNaN(index)) {
        res.json({});
        return;
    }
    // get additional header variable from header
    const visibility = req.headers["visible"];

    // update shown attribute of property (not really utilised, but could be used to memorise current state)
    let property = properties.filter((property) => {
        if(property["index"] === index) {
            if(visibility != null)
                property["shown"] = Boolean(Number(visibility));
            return true;
        }
        return false;
    });

    // check for mistake, else return single property
    if(property.length === 0) {
        res.json({});
    } else if(property.length === 1) {
        res.json(property.pop());
    } else {
        res.json({});
    }
});




/**
 *  useful functions
 */
function csvToJson(filePath) {
    // use imported function to convert csv file
    csv()
        .fromFile(filePath)
        .then((jsonObj) => {
            // update json
            jsonObj.map((item) => {
                // remove last three attributes (looks better in html when not shown, like in exercise 1 & 2)
                const keys = Object.keys(item);
                const keywords = ["gps_lat", "gps_long", "military expenditure percent of gdp"];
                for(let key of keys) {
                    if(keywords.includes(key))
                        delete item[key];
                }

                // round numbers
                for(const key in item) {
                    if(!isNaN(item[key]))
                        item[key] = Number(Number(item[key]).toFixed(3));
                }
                return item;
            })

            worldDataJson = jsonObj; // save json in local variable
            retrieveProperties(worldDataJson[0]); // retrieves properties from an example
            currentMaxId = worldDataJson.length + 1; // save max id
        });
}

function retrieveProperties(exampleElement) {
    properties = [];
    let i = 0;
    const keys = Object.keys(exampleElement);
    for(let key of keys) {
        // create object for each property of a country
        properties[i] = {
            index: i+1,
            name: key.replaceAll("_", " "),
            shown: true
        };
        i++;
    }
}

// source: https://stackoverflow.com/questions/18884249/checking-whether-something-is-iterable
function isIterable(obj) {
    // checks for null and undefined
    if (obj == null) {
        return false;
    }
    return typeof obj[Symbol.iterator] === 'function';
}

function addCountryToJson(item) {
    let length = worldDataJson.length;

    // init country with unique id
    let result = {
        "id": currentMaxId
    };

    // validation of input element
    // 1. valid name
    if (item["name"] == null) {
        return 'Element does not possess name!'; // returns displayed error message
    } else {
        let duplicate = null;
        for(let element of worldDataJson) {
            if(item["name"] === element["name"])
                duplicate = element;
        }
        if (duplicate != null) {
            return `Element with name ${item["name"]} does already exist!`; // returns displayed error message
        }
    }

    // 2. valid amount of keys
    if (Object.keys(item).length < 3) {
        return 'Element does not possess enough keys!'; // returns displayed error message
    }

    // round input (html accepts integers, but api validates anyway)
    for(const key in item) {
        if(!isNaN(item[key]))
            item[key] = Number(Number(item[key]).toFixed(3));
        result[key] = item[key];
    }

    // add to global json
    worldDataJson[length] = result;
    currentMaxId++;
    return 0; // returns 0 to indicate no error
}
var mysql = require('mysql2');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Retr1butionForFl4re",
  database: 'wildwatch'
});

con.connect(function(err) {
  if (err) throw err;
});
//Tested
function post_submission(UserSpecies, UserLocation, UserPhoto, Date) {
    con.connect(function(err) {
    if (err) throw err;
    var sql = "INSERT INTO usersubmission (Location, Photo, PlantOrAnimal, ID, Date) VALUES (?, ?, (SELECT MOD(ID,2) FROM animalsandplants WHERE speciesname = ?), (SELECT ID FROM animalsandplants WHERE speciesname = ?), ?)";
    con.query(sql, [UserLocation, UserPhoto, UserSpecies, UserSpecies, Date], function (err, result) {
        if (err) throw err;
        return "Record Inserted";
        });
    });
}


//Tested
function query_animalsandplants_name(UserSpecies) {
  return new Promise((resolve, reject) => {
    con.connect(function(err) {
      if (err) return reject(err);
      var query = "%"+UserSpecies+"%";
      const sql = "SELECT * FROM animalsandplants WHERE SpeciesName LIKE ?";
      con.query(sql, query, function (err, result, fields) {
        if (err) return reject(err);
        resolve(result);
      });
    });
  });
}



//Tested
function query_animalsandplants_plantsanimals(PlantOrAnimal) {
  return new Promise((resolve, reject) => {
    con.connect(function(err) {
      if (err) return reject(err);
      const sql = "SELECT * FROM animalsandplants WHERE MOD(ID,2) = ?";
      con.query(sql, [PlantOrAnimal], function (err, result, fields) {
        if (err) return reject(err);
        resolve(result);
      });
    });
  });
}

function query_animalsandplants_birds(Name) {
  return new Promise((resolve, reject) => {
    con.connect(function(err) {
      if (err) return reject(err);
      var Query = "%"  + Name + "%";
      const sql = "SELECT SpeciesName FROM animalsandplants WHERE SpeciesName LIKE ? AND Bird = 1";
      con.query(sql, Query, function (err, result, fields) {
        if (err) return reject(err);
        resolve(result);
      });
    });
  });
}

function query_animalsandplants_nameanimal(Animal, Name) {
  return new Promise((resolve, reject) => {
    con.connect(function(err) {
      if (err) return reject(err);
      const Query = "%" + Name + "%";
      const sql = "SELECT * FROM animalsandplants WHERE MOD(ID,2) = ? AND speciesName LIKE ?";
      con.query(sql, [Animal, Query], function (err, result, fields) {
        if (err) return reject(err);
        resolve(result);
      });
    });
  });
}

//Tested
function query_usersubmission_name(UserSpecies) {
  return new Promise((resolve, reject) => {
    con.connect(function(err) {
      if (err) return reject(err);
      var query = "%"+UserSpecies+"%";
      const sql = "SELECT animalsandplants.SpeciesName, usersubmission.* FROM usersubmission INNER JOIN animalsandplants ON usersubmission.ID = animalsandplants.ID WHERE animalsandplants.SpeciesName LIKE ?";
      con.query(sql, query, function (err, result, fields) {
        if (err) return reject(err);
        resolve(result);
      });
    });
  });
}

//Tested
function query_usersubmission_plantsanimals(PlantOrAnimal) {
  return new Promise((resolve, reject) => {
    con.connect(function(err) {
      if (err) return reject(err);
      const sql = "SELECT animalsandplants.SpeciesName, usersubmission.* FROM usersubmission INNER JOIN animalsandplants ON usersubmission.ID = animalsandplants.ID WHERE usersubmission.PlantOrAnimal = ?";
      con.query(sql, PlantOrAnimal, function (err, result, fields) {
        if (err) return reject(err);
        resolve(result);
      });
    });
  });
}

//Tested
function query_usersubmission_amount(Month, Year, Name) {
  return new Promise((resolve, reject) => {
    con.connect(function(err) {
      if (err) return reject(err);
      var Query = Name ;
      var Date = "%" + Month + "/__/" + Year + "%";
      const sql = "SELECT animalsandplants.SpeciesName, COUNT(usersubmission.Date) AS Count FROM usersubmission INNER JOIN animalsandplants ON usersubmission.ID = animalsandplants.ID WHERE usersubmission.Date LIKE ? AND animalsandplants.SpeciesName = ? GROUP BY animalsandplants.SpeciesName";
      con.query(sql, [Date, Query], function (err, result, fields) {
        if (err) return reject(err);
        resolve(result);
      });
    });
  });
}


async function getData(Choice, Input) {
    try {
        switch(Choice) {
          case "AnimalsName":
            var result = await query_animalsandplants_name(Input);
            break;
          case "AnimalsType": 
            var result = await query_animalsandplants_plantsanimals(Input);  
            break;
          case "SubmissionName":
            var result = await query_usersubmission_name(Input);
            break;
          case "SubmissionType":
            var result = await query_usersubmission_plantsanimals(Input);
            break;
          case "BirdList":
            var objectList = await query_animalsandplants_birds(Input);
            var result = [];
            for (var i = 0; i < objectList.length; i++) 
            {
                result[i] = objectList[i].SpeciesName;
            }
        }
        return result;
    } catch (err) {
        console.error(err);
    }
}

async function MigrationData(Year, Name) {
    try {
        const result = [];
        for (let Month = 1; Month < 13; Month++) {
            result[Month-1] = await query_usersubmission_amount(Month, Year, Name);
            result[Month-1] = result[Month-1][0];
        }
        return result;
    } catch (err) {
        console.error(err);
    }
}

async function speciesGuide(Type, Name) {
  try {
        switch(Type) {
          case "All":
            return await query_animalsandplants_name(Name);
          case "Animal": 
            return await query_animalsandplants_nameanimal(0, Name);  
          case "Plant":
            return await query_animalsandplants_nameanimal(1, Name);  
        }
    } catch (err) {
        console.error(err);
    }
}

module.exports = {speciesGuide, MigrationData, getData, post_submission};


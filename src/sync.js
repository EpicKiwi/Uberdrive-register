const db = require("./db")

module.exports = {

    eraseAll(){
        let query = `MATCH (n)-[r]-() DELETE n,r`
        let query2 = `MATCH (n) DELETE n`
        return Promise.all([db.getSession().run(query),db.getSession().run(query2)])
    },

    planets(planetList){
        return new Promise((resolve,reject)=>{
            let promises = []
            for(let i = 0; i<planetList.length; i++){
                let planet = planetList[i]
                if(planet.name == "unknown")
                    continue;
                let query = `MERGE (n:Planet {name: "${planet.name}"})
                            ON CREATE SET
                                n.diameter = ${planet.diameter == 'unknown' ? '"unknown"' : parseInt(planet.diameter)},
                                n.climate = "${planet.climate}",
                                n.gravity = ${planet.gravity == 'unknown' ? '"unknown"' : parseInt(planet.gravity) ? parseInt(planet.gravity) : '"unknown"'},
                                n.terrain = "${planet.terrain}",
                                n.population = ${planet.population == 'unknown' ? '"unknown"' : parseInt(planet.population)}`

                promises.push(db.getSession().run(query))
            }
            Promise.all(promises)
                .then((result)=>{
                    return resolve(planetList)
                })
                .catch((error)=>{
                    return reject(error)
                })
        })
    },

    connectPlanets(planetList){
        return new Promise((resolve,reject)=>{
            let promises = []
            for(let i = 0; i<planetList.length; i++){
                let planet = planetList[i]
                let otherIndex = i
                while(otherIndex == i){
                    otherIndex = Math.floor(Math.random()*planetList.length)
                }
                let otherPlanet = planetList[otherIndex]
                if(planet.name == "unknown")
                    continue;
                let distance = Math.round(10+(Math.random()*190))
                let query = `MATCH (n:Planet {name: "${planet.name}"}),(m:Planet {name: "${otherPlanet.name}"}) MERGE (n)-[r:Bridge]-(m)
                            ON CREATE SET
                                r.distance = ${distance}`
                promises.push(db.getSession().run(query))
                query = `MATCH (n:Planet {name: "${otherPlanet.name}"}),(m:Planet {name: "${planet.name}"}) MERGE (n)-[r:Bridge]-(m)
                            ON CREATE SET
                                r.distance = ${distance}`
                promises.push(db.getSession().run(query))
            }
            Promise.all(promises)
                .then((result)=>{
                    return resolve(planetList)
                })
                .catch((error)=>{
                    return reject(error)
                })
        })
    },

    starships(starshipList){
        return new Promise((resolve,reject)=>{
            let promises = []
            for(let i = 0; i<starshipList.length; i++){
                let starship = starshipList[i]
                if(starship.name == "unknown" || starship["cost_in_credits"] == "unknown")
                    continue;
                let query = `MERGE (n:Ship {name: "${starship.name}"})
                            ON CREATE SET
                                n.length = ${starship.length == 'unknown' ? '"unknown"' : parseInt(starship.length)},
                                n.model = "${starship.model}",
                                n.class = "${starship["starship_class"]}",
                                n.manufacturer = "${starship.manufacturer}",
                                n.crewsize = ${starship.crew == 'unknown' ? '"unknown"' : parseInt(starship.crew)},
                                n.passengersize = ${starship.passengers == 'unknown' ? '"unknown"' : parseInt(starship.passengers)},
                                n.hyperdriverate = ${starship["hyperdrive_rating"] == 'unknown' ? '"unknown"' : parseInt(starship["hyperdrive_rating"])},
                                n.speed = ${starship.MGLT == 'unknown' ? '"unknown"' : parseInt(starship.MGLT)},
                                n.capacity = ${starship["cargo_capacity"] == 'unknown' ? '"unknown"' : parseInt(starship["cargo_capacity"])},
                                n.price = ${starship["cost_in_credits"]/100000}`

                promises.push(db.getSession().run(query))
            }
            Promise.all(promises)
                .then((result)=>{
                    return resolve(starshipList)
                })
                .catch((error)=>{
                    return reject(error)
                })
        })
    },

    connectStarships(starshipList,planetList){
        return new Promise((resolve,reject)=>{
            let promises = []
            for(let i = 0; i<starshipList.length; i++){
                let starship = starshipList[i]
                let planet = planetList[Math.floor(Math.random()*planetList.length)]
                if(planet.name == "unknown" || starship.name == "unknown" || starship["cost_in_credits"] == "unknown")
                    continue;
                let query = `MATCH (s:Ship {name: "${starship.name}"}),(p:Planet {name: "${planet.name}"}) MERGE (s)-[r:LandedOn]-(p)`
                promises.push(db.getSession().run(query))
            }
            Promise.all(promises)
                .then((result)=>{
                    return resolve(planetList)
                })
                .catch((error)=>{
                    return reject(error)
                })
        })
    },

    createUsers(users){
        return new Promise((resolve,reject)=>{
            let promises = []
            for(let i = 0; i<users.length; i++){
                let user = users[i]
                let query = `CREATE (u:User {name:"${user.name}",password:"${user.password}"})`
                promises.push(db.getSession().run(query))
            }
            Promise.all(promises)
                .then((result)=>{
                    return resolve(users)
                })
                .catch((error)=>{
                    return reject(error)
                })
        })
    },

    createShipmens(users,starshipList,planetList){
        return new Promise((resolve,reject)=>{
            let promises = []
            for(let i = 0; i<users.length; i++){

                let starship = starshipList[Math.floor(Math.random()*starshipList.length)]
                let fromPlanet = planetList[Math.floor(Math.random()*planetList.length)]
                let toPlanet = planetList[Math.floor(Math.random()*planetList.length)]
                let user = users[i]

                if(fromPlanet.name == "unknown" || toPlanet.name == "unknown" || starship.name == "unknown" || starship["cost_in_credits"] == "unknown")
                    continue;

                let query = `MATCH  (s:Ship {name: "${starship.name}"}),
                                    (p:Planet {name: "${fromPlanet.name}"}),
                                    (q:Planet {name: "${toPlanet.name}"}),
                                    (u:User {name: "${user.name}"})
                            CREATE (sh:Shipment)-[:From]->(p), (sh)-[:To]->(q), (sh)-[:With]->(s), (u)-[:AskFor]->(sh), (u)-[:LocatedOn]->(p)`
                promises.push(db.getSession().run(query))
            }
            Promise.all(promises)
                .then((result)=>{
                    return resolve(users)
                })
                .catch((error)=>{
                    return reject(error)
                })
        })
    }

}
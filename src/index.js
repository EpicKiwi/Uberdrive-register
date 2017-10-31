const swapi = require("./swapi")
const db = require("./db")
const sync = require("./sync")

let process = async function process(){

    db.init()
    console.info("Connected to database")

    await sync.eraseAll()
    console.info("Cleaned database")

    let planets = await swapi.getPlanets()
    console.info(planets.length+" planets")

    await sync.planets(planets)
    console.log("Planets registered")
    await sync.connectPlanets(planets)
    console.log("Planets connected")

    console.info(planets.length+" starships")
    let starships = await swapi.getStarships()

    await sync.starships(starships)
    console.log("Starships registered")
    await sync.connectStarships(starships,planets)
    console.log("Starships landed")


    let users = [
        {name:"Alice",password:"Azerty"},
        {name:"Bob",password:"dcfvgbhn"},
        {name:"Barbara",password:"Grey"},
        {name:"Miku",password:"Hasune"}
    ]
    console.log(users.length+" users")
    await sync.createUsers(users)
    console.log("Users registered")
    await sync.createShipmens(users,starships,planets)
    console.log("Users registered")

}

process()
    .then(()=>{
        console.info("Finished")
    }).catch((error)=>{
        console.error("An error occured")
        console.info(error)
})
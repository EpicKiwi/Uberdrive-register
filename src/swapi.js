const request = require("request")

module.exports = {

    getPlanets(){
        return new Promise((resolve, reject) => {

            let baseUrl = "https://swapi.co/api/planets/"

            this.requestAll(baseUrl,(err,result)=>{
                if(err)
                    return reject(err)
                return resolve(result)
            })

        })
    },

    getStarships(){
        return new Promise((resolve, reject) => {

            let baseUrl = "https://swapi.co/api/starships/"

            this.requestAll(baseUrl,(err,result)=>{
                if(err)
                    return reject(err)
                return resolve(result)
            })

        })
    },

    requestAll(url,callback,lastArray){
            let resultArray = lastArray ? lastArray : []
            if(!url && callback) {
                return callback(null,resultArray)
            }

            request(url,{json:true},(err,res,body)=>{
                if(err)
                    if(callback)
                        return callback(err)
                resultArray = resultArray.concat(body.results)
                return this.requestAll(body.next,callback,resultArray)
            })
    }

}
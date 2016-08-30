package main

import (
	"log"
	"net/http"
	"strconv"
	"github.com/NYTimes/gziphandler"
	
	//local import paths relative to app.yaml file
	"mywebsite/server/controller/api"
	"mywebsite/server/db"
	"mywebsite/server/route"
	"mywebsite/server/utils"
)

/* for app engine
func init() {
	configurations := utils.ReadConfig()

	db.Configure(configurations.Database)
	api.Configure(configurations.Api)

	db.Mongo.Connect()

	router := route.Routes()

	http.Handle("/", router)
}
*/

func main(){
	configurations := utils.ReadConfig()

	db.Configure(configurations.Database)
	api.Configure(configurations.Api)

	db.Mongo.Connect()
	
	//register middleware
	handle := gziphandler.GzipHandler(route.Routes())
	
	log.Println("Starting Server...")
	log.Println(http.ListenAndServe(":"+strconv.Itoa(configurations.Port), handle))
}

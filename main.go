package main

import (
	"github.com/gin-gonic/gin"
	_ "github.com/lib/pq"
	"log"

	db "somename/DatabaseScripts"
	"strconv"
)

func main() {
	db.ConnectDB()

	//вынести тоже в отдельный подфайл
	router := gin.Default()

	router.LoadHTMLGlob("template/*.html")
	router.Static("/assets", "assets")

	router.GET("/", loginHandler)
	router.GET("/index", mainHandler)
	router.POST("/sign-in", signIn)
	router.GET("/user", getUsers)
	router.GET("/analyses/:id", getAnalyses)

	//хранилище для куки

	log.Fatal(router.Run(":8080"))
}

//вынести структуры в подфайлы
type User struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

func loginHandler(context *gin.Context) {
	context.HTML(200, "login.html", nil)
}

func mainHandler(context *gin.Context) {
	// проверка на авторизацию

	context.HTML(200, "MainTemplate.html", nil)
}

func signIn(context *gin.Context) {
	user := &User{}
	err := context.BindJSON(user)
	if err != nil {
		log.Println(err)
		context.Status(415)
		return
	}
	var count int

	row := db.DbQuer.QueryRow(`select count(*) from "UserLogin" where "Username"=$1 and "Password"=$2`,
		user.Username, user.Password)
	err = row.Scan(&count)

	if err != nil {
		log.Println(err)
		context.JSON(403, "неверный логин/пароль")
		return
	}

	if count == 0 {
		context.JSON(403, "не имеется принятых данных")
		return
	}
	//s := sessions.Default(context)
	//s.Set("MySecretKey", user.Username)
	//s.Save()

	if err != nil {
		log.Println(err)
	}

	context.Redirect(301, "/index")
}

func getUsers(context *gin.Context) {

	context.JSON(200, db.SelectUsers())
}

func getAnalyses(context *gin.Context) {
	// проверка на авторизацию

	id, e := strconv.Atoi(context.Param("id"))
	if e != nil {
		log.Println(e)
		context.Status(400)
		return
	}

	context.JSON(200, db.SelectUserAnalise(id))
}

/// -------

//JWT Token

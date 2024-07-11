package main

import (
	"encoding/json"
	"io"
	"log"
	"net/http"
	"sync"
)

type SafeContext struct {
	sync.Mutex
	data []string
}

var context SafeContext

const token = "f2d81a260dea8a100dd517984e53c56a7523d96942a834b9cdc249bd4e8c7aa9"

func main() {

	srv := http.NewServeMux()

	HandleRoutes(srv)

	http.ListenAndServe(":7777", srv)
}

func ReturnContext(w http.ResponseWriter) {

	w.WriteHeader(http.StatusFound)

	jsonResponse, err := json.Marshal(context.data)

	if err != nil {
		log.Fatal(err)
	}

	w.Write(jsonResponse)
}

func HandleRoutes(srv *http.ServeMux) {

	srv.HandleFunc("GET /", func(w http.ResponseWriter, r *http.Request) {
		ReturnContext(w)
	})

	srv.HandleFunc("GET /count", func(w http.ResponseWriter, r *http.Request) {

		resp, err := json.Marshal(len(context.data))

		if err != nil {
			log.Fatal(err)
		}

		w.Write([]byte(resp))
	})

	srv.HandleFunc("DELETE /", func(w http.ResponseWriter, r *http.Request) {
		context.data = nil

		w.WriteHeader(http.StatusOK)
		w.Write([]byte("Deleted entries"))
	})

	srv.HandleFunc("POST /fast", func(w http.ResponseWriter, r *http.Request) {

		body, err := io.ReadAll(r.Body)
		if err != nil {
			panic(err)
		}

		data := string(body)
		context.Lock()
		defer context.Unlock()

		context.data = append(context.data, data)

		w.WriteHeader(http.StatusCreated)
		w.Write([]byte("OK"))
	})

	srv.HandleFunc("POST /linear", func(w http.ResponseWriter, r *http.Request) {

		body, err := io.ReadAll(r.Body)
		if err != nil {
			panic(err)
		}

		data := string(body)

		context.Lock()
		defer context.Unlock()

		// Create a new slice
		contextCopy := make([]string, len(context.data)+1)

		// Worst way to copy an array -> Angry compiler
		for i, cur := range context.data {
			contextCopy[i] = cur
		}

		contextCopy[len(contextCopy)-1] = data

		context.data = contextCopy

		w.WriteHeader(http.StatusCreated)
		w.Write([]byte("OK"))
	})

	srv.HandleFunc("GET /token", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		w.Write([]byte(token))
	})

	srv.HandleFunc("GET /bank/info", func(w http.ResponseWriter, r *http.Request) {

		headerToken := r.Header.Get("Authorization")

		if headerToken != token {
			w.WriteHeader(http.StatusUnauthorized)
			return
		}

		w.WriteHeader(http.StatusFound)
		w.Write([]byte("Jackpot baby"))
	})

}

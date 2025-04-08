package ws

import (
	"net/http"
	"sync"

	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool { return true },
}

type Client struct {
	UserID string
	Conn   *websocket.Conn
}

var clients = make(map[string]*Client)
var mu sync.Mutex

func HandleWS(c *gin.Context) {
	userID := c.Param("user_id")
	conn, err := upgrader.Upgrade(c.Writer, c.Request, nil)
	if err != nil {
		return
	}

	client := &Client{UserID: userID, Conn: conn}
	mu.Lock()
	clients[userID] = client
	mu.Unlock()

	defer func() {
		mu.Lock()
		delete(clients, userID)
		mu.Unlock()
		conn.Close()
	}()

	for {
		_, _, err := conn.ReadMessage()
		if err != nil {
			break
		}
	}
}

func SendUpdate(userID string, data interface{}) {
	mu.Lock()
	defer mu.Unlock()

	if client, ok := clients[userID]; ok {
		client.Conn.WriteJSON(data)
	}
}

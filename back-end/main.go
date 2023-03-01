package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"github.com/gin-gonic/gin"
	"io/ioutil"
	"net/http"
)

const openAiKey string = "填写官网apikey的内容"

func main() {
	r := gin.Default()
	r.GET("/", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "helloword",
		})
	})
	r.POST("/message", func(c *gin.Context) {
		chatdata := make(map[string]interface{})
		c.BindJSON(&chatdata)
		fmt.Printf("%#v", &chatdata)
		AuthorizationApiKey := fmt.Sprintf("Bearer %s", openAiKey)
		if chatdata["type"] == "文本" {
			toChatJson := map[string]interface{}{
				"prompt":            chatdata["msg"],
				"max_tokens":        chatdata["maxtoken"],
				"model":             "text-davinci-003",
				"temperature":       0,
				"frequency_penalty": 0,
				"presence_penalty":  0.6,
			}
			fmt.Println("接收到的消息为：", chatdata["maxtoken"])
			toChatData, err := json.Marshal(toChatJson)
			if err != nil {
				fmt.Println("在请求文本资源将数据序列化为JSON出错", err)
			}
			fmt.Println("转换完成数据为：", string(toChatData))
			req, err := http.NewRequest("POST", "https://api.openai.com/v1/completions", bytes.NewBuffer(toChatData))
			if err != nil {
				fmt.Println("处理文本数据在向chatgpt官方发送POST请求时出错", err)
			}
			req.Header.Set("Content-Type", "application/json")
			req.Header.Set("Authorization", AuthorizationApiKey)

			client := &http.Client{}
			resp, err := client.Do(req)
			defer resp.Body.Close()
			if err != nil {
				fmt.Println("向chatgpt官方发送请求失败,错误码：", resp.StatusCode, err)
			}
			if resp.StatusCode == 200 {
				body, err := ioutil.ReadAll(resp.Body)
				if err != nil {
					fmt.Println("接收chatgpt官方返回的数据的body出错,错误码为", resp.StatusCode, err)
					return
				}
				fmt.Printf("返回的数据是%#v", string(body))
				res := map[string]string{
					"resmsg": string(body),
					"code":   "200",
				}

				c.JSON(http.StatusOK, res)
			} else {
				c.JSON(502, "")
			}
		} else {
			toChatJson := map[string]interface{}{
				"prompt": chatdata["msg"],
				"size":   "1024x1024",
				"n":      1,
			}
			toChatData, err := json.Marshal(toChatJson)
			if err != nil {
				fmt.Println(err)
			}
			req, err := http.NewRequest("POST", "https://api.openai.com/v1/images/generations", bytes.NewBuffer(toChatData))
			if err != nil {
				panic(err)
			}
			req.Header.Set("Content-Type", "application/json")
			req.Header.Set("Authorization", AuthorizationApiKey)

			client := &http.Client{}
			resp, err := client.Do(req)
			defer resp.Body.Close()
			if err != nil {
				fmt.Println("向chatgpt官方发送请求失败")
			}
			if resp.StatusCode == 200 {
				body, err := ioutil.ReadAll(resp.Body)
				if err != nil {
					fmt.Println("在向chatgpt官方发送请求时出错1")
					return
				}
				fmt.Printf("返回的数据是%#v", string(body))
				res := map[string]string{
					"resmsg": string(body),
					"code":   "200",
				}

				c.JSON(http.StatusOK, res)
			} else {
				c.JSON(502, "")
			}
		}

	})

	//r.Run(":80")
	r.RunTLS(":443", "./cert/aichat.2lc.top-cert.pem", "./cert/aichat.2lc.top.key")
}

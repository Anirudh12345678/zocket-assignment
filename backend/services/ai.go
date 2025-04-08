package services

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"os"
)

func GetTaskSuggestions(prompt string) ([]string, error) {
	payload := map[string]interface{}{
		"model":       "gpt-3.5-turbo-instruct",
		"prompt":      prompt,
		"temperature": 0.7,
		"max_tokens":  150,
	}
	body, _ := json.Marshal(payload)
	req, _ := http.NewRequest("POST", "https://api.openai.com/v1/completions", bytes.NewBuffer(body))
	req.Header.Set("Authorization", "Bearer "+"Your Api-key")
	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	var result struct {
		Choices []struct {
			Text string `json:"text"`
		} `json:"choices"`
	}
	json.NewDecoder(resp.Body).Decode(&result)

	if len(result.Choices) == 0 {
		return []string{}, nil
	}

	raw := result.Choices[0].Text
	lines := []string{}
	for _, line := range bytes.Split([]byte(raw), []byte("\n")) {
		trimmed := string(bytes.TrimSpace(line))
		if trimmed != "" {
			if len(trimmed) > 2 && (trimmed[:2] == "- " || (trimmed[1] == '.' && trimmed[0] >= '1' && trimmed[0] <= '9')) {
				trimmed = trimmed[2:]
			}
			lines = append(lines, trimmed)
		}
	}

	return lines, nil
}

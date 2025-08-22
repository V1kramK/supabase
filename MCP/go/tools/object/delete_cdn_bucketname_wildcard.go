package tools

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"

	"github.com/supabase-storage-api/mcp-server/config"
	"github.com/supabase-storage-api/mcp-server/models"
	"github.com/mark3labs/mcp-go/mcp"
)

func Delete_cdn_bucketname_wildcardHandler(cfg *config.APIConfig) func(ctx context.Context, request mcp.CallToolRequest) (*mcp.CallToolResult, error) {
	return func(ctx context.Context, request mcp.CallToolRequest) (*mcp.CallToolResult, error) {
		args, ok := request.Params.Arguments.(map[string]any)
		if !ok {
			return mcp.NewToolResultError("Invalid arguments object"), nil
		}
		bucketNameVal, ok := args["bucketName"]
		if !ok {
			return mcp.NewToolResultError("Missing required path parameter: bucketName"), nil
		}
		bucketName, ok := bucketNameVal.(string)
		if !ok {
			return mcp.NewToolResultError("Invalid path parameter: bucketName"), nil
		}
		*Val, ok := args["*"]
		if !ok {
			return mcp.NewToolResultError("Missing required path parameter: *"), nil
		}
		*, ok := *Val.(string)
		if !ok {
			return mcp.NewToolResultError("Invalid path parameter: *"), nil
		}
		url := fmt.Sprintf("%s/cdn/%s/%s", cfg.BaseURL, bucketName, *)
		req, err := http.NewRequest("DELETE", url, nil)
		if err != nil {
			return mcp.NewToolResultErrorFromErr("Failed to create request", err), nil
		}
		// No authentication required for this endpoint
		req.Header.Set("Accept", "application/json")
		if val, ok := args["authorization"]; ok {
			req.Header.Set("authorization", fmt.Sprintf("%v", val))
		}

		resp, err := http.DefaultClient.Do(req)
		if err != nil {
			return mcp.NewToolResultErrorFromErr("Request failed", err), nil
		}
		defer resp.Body.Close()

		body, err := io.ReadAll(resp.Body)
		if err != nil {
			return mcp.NewToolResultErrorFromErr("Failed to read response body", err), nil
		}

		if resp.StatusCode >= 400 {
			return mcp.NewToolResultError(fmt.Sprintf("API error: %s", body)), nil
		}
		// Use properly typed response
		var result map[string]interface{}
		if err := json.Unmarshal(body, &result); err != nil {
			// Fallback to raw text if unmarshaling fails
			return mcp.NewToolResultText(string(body)), nil
		}

		prettyJSON, err := json.MarshalIndent(result, "", "  ")
		if err != nil {
			return mcp.NewToolResultErrorFromErr("Failed to format JSON", err), nil
		}

		return mcp.NewToolResultText(string(prettyJSON)), nil
	}
}

func CreateDelete_cdn_bucketname_wildcardTool(cfg *config.APIConfig) models.Tool {
	tool := mcp.NewTool("delete_cdn_bucketName_wildcard",
		mcp.WithDescription("Purge cache for an object"),
		mcp.WithString("bucketName", mcp.Required(), mcp.Description("")),
		mcp.WithString("*", mcp.Required(), mcp.Description("")),
		mcp.WithString("authorization", mcp.Required(), mcp.Description("")),
	)

	return models.Tool{
		Definition: tool,
		Handler:    Delete_cdn_bucketname_wildcardHandler(cfg),
	}
}

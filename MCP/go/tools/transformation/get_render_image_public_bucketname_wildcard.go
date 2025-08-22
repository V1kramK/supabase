package tools

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"strings"

	"github.com/supabase-storage-api/mcp-server/config"
	"github.com/supabase-storage-api/mcp-server/models"
	"github.com/mark3labs/mcp-go/mcp"
)

func Get_render_image_public_bucketname_wildcardHandler(cfg *config.APIConfig) func(ctx context.Context, request mcp.CallToolRequest) (*mcp.CallToolResult, error) {
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
		queryParams := make([]string, 0)
		if val, ok := args["height"]; ok {
			queryParams = append(queryParams, fmt.Sprintf("height=%v", val))
		}
		if val, ok := args["width"]; ok {
			queryParams = append(queryParams, fmt.Sprintf("width=%v", val))
		}
		if val, ok := args["resize"]; ok {
			queryParams = append(queryParams, fmt.Sprintf("resize=%v", val))
		}
		if val, ok := args["format"]; ok {
			queryParams = append(queryParams, fmt.Sprintf("format=%v", val))
		}
		if val, ok := args["quality"]; ok {
			queryParams = append(queryParams, fmt.Sprintf("quality=%v", val))
		}
		if val, ok := args["download"]; ok {
			queryParams = append(queryParams, fmt.Sprintf("download=%v", val))
		}
		queryString := ""
		if len(queryParams) > 0 {
			queryString = "?" + strings.Join(queryParams, "&")
		}
		url := fmt.Sprintf("%s/render/image/public/%s/%s%s", cfg.BaseURL, bucketName, *, queryString)
		req, err := http.NewRequest("GET", url, nil)
		if err != nil {
			return mcp.NewToolResultErrorFromErr("Failed to create request", err), nil
		}
		// No authentication required for this endpoint
		req.Header.Set("Accept", "application/json")

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

func CreateGet_render_image_public_bucketname_wildcardTool(cfg *config.APIConfig) models.Tool {
	tool := mcp.NewTool("get_render_image_public_bucketName_wildcard",
		mcp.WithDescription("Render a public image with the given transformations"),
		mcp.WithNumber("height", mcp.Description("")),
		mcp.WithNumber("width", mcp.Description("")),
		mcp.WithString("resize", mcp.Description("")),
		mcp.WithString("format", mcp.Description("")),
		mcp.WithNumber("quality", mcp.Description("")),
		mcp.WithString("download", mcp.Description("")),
		mcp.WithString("bucketName", mcp.Required(), mcp.Description("")),
		mcp.WithString("*", mcp.Required(), mcp.Description("")),
	)

	return models.Tool{
		Definition: tool,
		Handler:    Get_render_image_public_bucketname_wildcardHandler(cfg),
	}
}

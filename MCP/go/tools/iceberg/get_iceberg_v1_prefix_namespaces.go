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

func Get_iceberg_v1_prefix_namespacesHandler(cfg *config.APIConfig) func(ctx context.Context, request mcp.CallToolRequest) (*mcp.CallToolResult, error) {
	return func(ctx context.Context, request mcp.CallToolRequest) (*mcp.CallToolResult, error) {
		args, ok := request.Params.Arguments.(map[string]any)
		if !ok {
			return mcp.NewToolResultError("Invalid arguments object"), nil
		}
		prefixVal, ok := args["prefix"]
		if !ok {
			return mcp.NewToolResultError("Missing required path parameter: prefix"), nil
		}
		prefix, ok := prefixVal.(string)
		if !ok {
			return mcp.NewToolResultError("Invalid path parameter: prefix"), nil
		}
		queryParams := make([]string, 0)
		if val, ok := args["pageToken"]; ok {
			queryParams = append(queryParams, fmt.Sprintf("pageToken=%v", val))
		}
		if val, ok := args["pageSize"]; ok {
			queryParams = append(queryParams, fmt.Sprintf("pageSize=%v", val))
		}
		if val, ok := args["parent"]; ok {
			queryParams = append(queryParams, fmt.Sprintf("parent=%v", val))
		}
		queryString := ""
		if len(queryParams) > 0 {
			queryString = "?" + strings.Join(queryParams, "&")
		}
		url := fmt.Sprintf("%s/iceberg/v1/%s/namespaces%s", cfg.BaseURL, prefix, queryString)
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

func CreateGet_iceberg_v1_prefix_namespacesTool(cfg *config.APIConfig) models.Tool {
	tool := mcp.NewTool("get_iceberg_v1_prefix_namespaces",
		mcp.WithDescription("List namespaces"),
		mcp.WithString("pageToken", mcp.Description("")),
		mcp.WithString("pageSize", mcp.Description("")),
		mcp.WithString("parent", mcp.Description("")),
		mcp.WithString("prefix", mcp.Required(), mcp.Description("")),
	)

	return models.Tool{
		Definition: tool,
		Handler:    Get_iceberg_v1_prefix_namespacesHandler(cfg),
	}
}

package tools

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"bytes"

	"github.com/supabase-storage-api/mcp-server/config"
	"github.com/supabase-storage-api/mcp-server/models"
	"github.com/mark3labs/mcp-go/mcp"
)

func Post_iceberg_v1_prefix_namespaces_namespace_tables_tableHandler(cfg *config.APIConfig) func(ctx context.Context, request mcp.CallToolRequest) (*mcp.CallToolResult, error) {
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
		namespaceVal, ok := args["namespace"]
		if !ok {
			return mcp.NewToolResultError("Missing required path parameter: namespace"), nil
		}
		namespace, ok := namespaceVal.(string)
		if !ok {
			return mcp.NewToolResultError("Invalid path parameter: namespace"), nil
		}
		tableVal, ok := args["table"]
		if !ok {
			return mcp.NewToolResultError("Missing required path parameter: table"), nil
		}
		table, ok := tableVal.(string)
		if !ok {
			return mcp.NewToolResultError("Invalid path parameter: table"), nil
		}
		// Create properly typed request body using the generated schema
		var requestBody map[string]interface{}
		
		// Optimized: Single marshal/unmarshal with JSON tags handling field mapping
		if argsJSON, err := json.Marshal(args); err == nil {
			if err := json.Unmarshal(argsJSON, &requestBody); err != nil {
				return mcp.NewToolResultError(fmt.Sprintf("Failed to convert arguments to request type: %v", err)), nil
			}
		} else {
			return mcp.NewToolResultError(fmt.Sprintf("Failed to marshal arguments: %v", err)), nil
		}
		
		bodyBytes, err := json.Marshal(requestBody)
		if err != nil {
			return mcp.NewToolResultErrorFromErr("Failed to encode request body", err), nil
		}
		url := fmt.Sprintf("%s/iceberg/v1/%s/namespaces/%s/tables/%s", cfg.BaseURL, prefix, namespace, table)
		req, err := http.NewRequest("POST", url, bytes.NewBuffer(bodyBytes))
		req.Header.Set("Content-Type", "application/json")
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

func CreatePost_iceberg_v1_prefix_namespaces_namespace_tables_tableTool(cfg *config.APIConfig) models.Tool {
	tool := mcp.NewTool("post_iceberg_v1_prefix_namespaces_namespace_tables_table",
		mcp.WithDescription("Commit updates to multiple tables in an atomic operation"),
		mcp.WithString("prefix", mcp.Required(), mcp.Description("")),
		mcp.WithString("namespace", mcp.Required(), mcp.Description("")),
		mcp.WithString("table", mcp.Required(), mcp.Description("")),
		mcp.WithArray("updates", mcp.Required(), mcp.Description("Input parameter: Metadata updates to apply to the table")),
		mcp.WithArray("requirements", mcp.Required(), mcp.Description("Input parameter: Assertions to validate before applying updates")),
	)

	return models.Tool{
		Definition: tool,
		Handler:    Post_iceberg_v1_prefix_namespaces_namespace_tables_tableHandler(cfg),
	}
}

/**
 * MCP Server function for Commit updates to multiple tables in an atomic operation
 */

import axios, { AxiosResponse } from 'axios';

interface APIConfig {
    baseUrl: string;
    apiKey: string;
}

interface MCPRequest {
    params?: {
        arguments?: Record<string, any>;
    };
}

interface MCPToolResult {
    content: string;
    isError: boolean;
}

interface ToolDefinition {
    name: string;
    description: string;
    parameters: Record<string, {
        type: string;
        required: boolean;
        description: string;
    }>;
}

interface Tool {
    definition: ToolDefinition;
    handler: (ctx: any, request: MCPRequest) => Promise<MCPToolResult>;
}

class MCPToolResultImpl implements MCPToolResult {
    constructor(
        public content: string,
        public isError: boolean = false
    ) {}
}

function getPost_Iceberg_V1_Prefix_Namespaces_Namespace_Tables_TableHandler(config: APIConfig): (ctx: any, request: MCPRequest) => Promise<MCPToolResult> {
    return async function(ctx: any, request: MCPRequest): Promise<MCPToolResult> {
        try {
            const args = request?.params?.arguments || {};
            if (typeof args !== 'object') {
                return new MCPToolResultImpl("Invalid arguments object", true);
            }
            
            const queryParams: string[] = [];
    if (args.prefix !== undefined) {
        queryParams.push(`prefix=${args.prefix}`);
    }
    if (args.namespace !== undefined) {
        queryParams.push(`namespace=${args.namespace}`);
    }
    if (args.table !== undefined) {
        queryParams.push(`table=${args.table}`);
    }
    if (args.updates !== undefined) {
        queryParams.push(`updates=${args.updates}`);
    }
    if (args.requirements !== undefined) {
        queryParams.push(`requirements=${args.requirements}`);
    }
            
            const queryString = queryParams.length > 0 ? '?' + queryParams.join('&') : '';
            const url = `${config.baseUrl}/api/v2/post_iceberg_v1_prefix_namespaces_namespace_tables_table${queryString}`;
            
            const headers = {
                'Authorization': `Bearer ${config.apiKey}`,
                'Accept': 'application/json'
            };
            
            const response: AxiosResponse = await axios.get(url, { headers });
            
            if (response.status >= 400) {
                return new MCPToolResultImpl(`API error: ${response.data}`, true);
            }
            
            const prettyJSON = JSON.stringify(response.data, null, 2);
            return new MCPToolResultImpl(prettyJSON);
            
        } catch (error: any) {
            if (error.response) {
                return new MCPToolResultImpl(`Request failed: ${error.response.data}`, true);
            }
            return new MCPToolResultImpl(`Unexpected error: ${error.message}`, true);
        }
    };
}

function createPost_Iceberg_V1_Prefix_Namespaces_Namespace_Tables_TableTool(config: APIConfig): Tool {
    return {
        definition: {
            name: "post_iceberg_v1_prefix_namespaces_namespace_tables_table",
            description: "Commit updates to multiple tables in an atomic operation",
            parameters: {
        prefix: { type: "string", required: true, description: "" },
        namespace: { type: "string", required: true, description: "" },
        table: { type: "string", required: true, description: "" },
        updates: { type: "string", required: true, description: "Input parameter: Metadata updates to apply to the table" },
        requirements: { type: "string", required: true, description: "Input parameter: Assertions to validate before applying updates" },
            }
        },
        handler: getPost_Iceberg_V1_Prefix_Namespaces_Namespace_Tables_TableHandler(config)
    };
}

export {
    APIConfig,
    MCPRequest,
    MCPToolResult,
    MCPToolResultImpl,
    Tool,
    ToolDefinition,
    getPost_Iceberg_V1_Prefix_Namespaces_Namespace_Tables_TableHandler,
    createPost_Iceberg_V1_Prefix_Namespaces_Namespace_Tables_TableTool
};
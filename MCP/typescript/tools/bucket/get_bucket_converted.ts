/**
 * MCP Server function for Gets all buckets
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

function getGet_BucketHandler(config: APIConfig): (ctx: any, request: MCPRequest) => Promise<MCPToolResult> {
    return async function(ctx: any, request: MCPRequest): Promise<MCPToolResult> {
        try {
            const args = request?.params?.arguments || {};
            if (typeof args !== 'object') {
                return new MCPToolResultImpl("Invalid arguments object", true);
            }
            
            const queryParams: string[] = [];
    if (args.sortColumn !== undefined) {
        queryParams.push(`sortColumn=${args.sortColumn}`);
    }
    if (args.sortOrder !== undefined) {
        queryParams.push(`sortOrder=${args.sortOrder}`);
    }
    if (args.search !== undefined) {
        queryParams.push(`search=${args.search}`);
    }
    if (args.authorization !== undefined) {
        queryParams.push(`authorization=${args.authorization}`);
    }
    if (args.limit !== undefined) {
        queryParams.push(`limit=${args.limit}`);
    }
    if (args.offset !== undefined) {
        queryParams.push(`offset=${args.offset}`);
    }
            
            const queryString = queryParams.length > 0 ? '?' + queryParams.join('&') : '';
            const url = `${config.baseUrl}/api/v2/get_bucket${queryString}`;
            
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

function createGet_BucketTool(config: APIConfig): Tool {
    return {
        definition: {
            name: "get_bucket",
            description: "Gets all buckets",
            parameters: {
        sortColumn: { type: "string", required: false, description: "" },
        sortOrder: { type: "string", required: false, description: "" },
        search: { type: "string", required: false, description: "" },
        authorization: { type: "string", required: true, description: "" },
        limit: { type: "string", required: false, description: "" },
        offset: { type: "string", required: false, description: "" },
            }
        },
        handler: getGet_BucketHandler(config)
    };
}

export {
    APIConfig,
    MCPRequest,
    MCPToolResult,
    MCPToolResultImpl,
    Tool,
    ToolDefinition,
    getGet_BucketHandler,
    createGet_BucketTool
};
/**
 * MCP Server function for Create a bucket
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

function getPost_BucketHandler(config: APIConfig): (ctx: any, request: MCPRequest) => Promise<MCPToolResult> {
    return async function(ctx: any, request: MCPRequest): Promise<MCPToolResult> {
        try {
            const args = request?.params?.arguments || {};
            if (typeof args !== 'object') {
                return new MCPToolResultImpl("Invalid arguments object", true);
            }
            
            const queryParams: string[] = [];
    if (args.authorization !== undefined) {
        queryParams.push(`authorization=${args.authorization}`);
    }
    if (args.file_size_limit !== undefined) {
        queryParams.push(`file_size_limit=${args.file_size_limit}`);
    }
    if (args.id !== undefined) {
        queryParams.push(`id=${args.id}`);
    }
    if (args.name !== undefined) {
        queryParams.push(`name=${args.name}`);
    }
    if (args.type !== undefined) {
        queryParams.push(`type=${args.type}`);
    }
    if (args.public !== undefined) {
        queryParams.push(`public=${args.public}`);
    }
    if (args.allowed_mime_types !== undefined) {
        queryParams.push(`allowed_mime_types=${args.allowed_mime_types}`);
    }
            
            const queryString = queryParams.length > 0 ? '?' + queryParams.join('&') : '';
            const url = `${config.baseUrl}/api/v2/post_bucket${queryString}`;
            
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

function createPost_BucketTool(config: APIConfig): Tool {
    return {
        definition: {
            name: "post_bucket",
            description: "Create a bucket",
            parameters: {
        authorization: { type: "string", required: true, description: "" },
        file_size_limit: { type: "string", required: false, description: "" },
        id: { type: "string", required: false, description: "" },
        name: { type: "string", required: true, description: "" },
        type: { type: "string", required: false, description: "" },
        public: { type: "string", required: false, description: "" },
        allowed_mime_types: { type: "string", required: false, description: "" },
            }
        },
        handler: getPost_BucketHandler(config)
    };
}

export {
    APIConfig,
    MCPRequest,
    MCPToolResult,
    MCPToolResultImpl,
    Tool,
    ToolDefinition,
    getPost_BucketHandler,
    createPost_BucketTool
};
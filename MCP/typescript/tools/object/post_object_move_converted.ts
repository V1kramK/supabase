/**
 * MCP Server function for Moves an object
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

function getPost_Object_MoveHandler(config: APIConfig): (ctx: any, request: MCPRequest) => Promise<MCPToolResult> {
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
    if (args.destinationKey !== undefined) {
        queryParams.push(`destinationKey=${args.destinationKey}`);
    }
    if (args.sourceKey !== undefined) {
        queryParams.push(`sourceKey=${args.sourceKey}`);
    }
    if (args.bucketId !== undefined) {
        queryParams.push(`bucketId=${args.bucketId}`);
    }
    if (args.destinationBucket !== undefined) {
        queryParams.push(`destinationBucket=${args.destinationBucket}`);
    }
            
            const queryString = queryParams.length > 0 ? '?' + queryParams.join('&') : '';
            const url = `${config.baseUrl}/api/v2/post_object_move${queryString}`;
            
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

function createPost_Object_MoveTool(config: APIConfig): Tool {
    return {
        definition: {
            name: "post_object_move",
            description: "Moves an object",
            parameters: {
        authorization: { type: "string", required: true, description: "" },
        destinationKey: { type: "string", required: true, description: "" },
        sourceKey: { type: "string", required: true, description: "" },
        bucketId: { type: "string", required: true, description: "" },
        destinationBucket: { type: "string", required: false, description: "" },
            }
        },
        handler: getPost_Object_MoveHandler(config)
    };
}

export {
    APIConfig,
    MCPRequest,
    MCPToolResult,
    MCPToolResultImpl,
    Tool,
    ToolDefinition,
    getPost_Object_MoveHandler,
    createPost_Object_MoveTool
};
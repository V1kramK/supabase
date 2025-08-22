/**
 * MCP Server function for Copies an object
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

function getPost_Object_CopyHandler(config: APIConfig): (ctx: any, request: MCPRequest) => Promise<MCPToolResult> {
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
    if (args.sourceKey !== undefined) {
        queryParams.push(`sourceKey=${args.sourceKey}`);
    }
    if (args.bucketId !== undefined) {
        queryParams.push(`bucketId=${args.bucketId}`);
    }
    if (args.destinationBucket !== undefined) {
        queryParams.push(`destinationBucket=${args.destinationBucket}`);
    }
    if (args.destinationKey !== undefined) {
        queryParams.push(`destinationKey=${args.destinationKey}`);
    }
    if (args.copyMetadata !== undefined) {
        queryParams.push(`copyMetadata=${args.copyMetadata}`);
    }
    if (args.metadata !== undefined) {
        queryParams.push(`metadata=${args.metadata}`);
    }
            
            const queryString = queryParams.length > 0 ? '?' + queryParams.join('&') : '';
            const url = `${config.baseUrl}/api/v2/post_object_copy${queryString}`;
            
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

function createPost_Object_CopyTool(config: APIConfig): Tool {
    return {
        definition: {
            name: "post_object_copy",
            description: "Copies an object",
            parameters: {
        authorization: { type: "string", required: true, description: "" },
        sourceKey: { type: "string", required: true, description: "" },
        bucketId: { type: "string", required: true, description: "" },
        destinationBucket: { type: "string", required: false, description: "" },
        destinationKey: { type: "string", required: true, description: "" },
        copyMetadata: { type: "string", required: false, description: "" },
        metadata: { type: "string", required: false, description: "" },
            }
        },
        handler: getPost_Object_CopyHandler(config)
    };
}

export {
    APIConfig,
    MCPRequest,
    MCPToolResult,
    MCPToolResultImpl,
    Tool,
    ToolDefinition,
    getPost_Object_CopyHandler,
    createPost_Object_CopyTool
};
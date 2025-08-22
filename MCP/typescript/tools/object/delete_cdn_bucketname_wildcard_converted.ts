/**
 * MCP Server function for Purge cache for an object
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

function getDelete_Cdn_Bucket_Name_WildcardHandler(config: APIConfig): (ctx: any, request: MCPRequest) => Promise<MCPToolResult> {
    return async function(ctx: any, request: MCPRequest): Promise<MCPToolResult> {
        try {
            const args = request?.params?.arguments || {};
            if (typeof args !== 'object') {
                return new MCPToolResultImpl("Invalid arguments object", true);
            }
            
            const queryParams: string[] = [];
    if (args.bucketName !== undefined) {
        queryParams.push(`bucketName=${args.bucketName}`);
    }
    if (args.* !== undefined) {
        queryParams.push(`*=${args.*}`);
    }
    if (args.authorization !== undefined) {
        queryParams.push(`authorization=${args.authorization}`);
    }
            
            const queryString = queryParams.length > 0 ? '?' + queryParams.join('&') : '';
            const url = `${config.baseUrl}/api/v2/delete_cdn_bucket_name_wildcard${queryString}`;
            
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

function createDelete_Cdn_Bucket_Name_WildcardTool(config: APIConfig): Tool {
    return {
        definition: {
            name: "delete_cdn_bucket_name_wildcard",
            description: "Purge cache for an object",
            parameters: {
        bucketName: { type: "string", required: true, description: "" },
        *: { type: "string", required: true, description: "" },
        authorization: { type: "string", required: true, description: "" },
            }
        },
        handler: getDelete_Cdn_Bucket_Name_WildcardHandler(config)
    };
}

export {
    APIConfig,
    MCPRequest,
    MCPToolResult,
    MCPToolResultImpl,
    Tool,
    ToolDefinition,
    getDelete_Cdn_Bucket_Name_WildcardHandler,
    createDelete_Cdn_Bucket_Name_WildcardTool
};
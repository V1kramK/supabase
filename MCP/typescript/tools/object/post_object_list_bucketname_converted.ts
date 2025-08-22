/**
 * MCP Server function for Search for objects under a prefix
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

function getPost_Object_List_Bucket_NameHandler(config: APIConfig): (ctx: any, request: MCPRequest) => Promise<MCPToolResult> {
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
    if (args.authorization !== undefined) {
        queryParams.push(`authorization=${args.authorization}`);
    }
    if (args.prefix !== undefined) {
        queryParams.push(`prefix=${args.prefix}`);
    }
    if (args.search !== undefined) {
        queryParams.push(`search=${args.search}`);
    }
    if (args.limit !== undefined) {
        queryParams.push(`limit=${args.limit}`);
    }
    if (args.offset !== undefined) {
        queryParams.push(`offset=${args.offset}`);
    }
    if (args.sortBy !== undefined) {
        queryParams.push(`sortBy=${args.sortBy}`);
    }
            
            const queryString = queryParams.length > 0 ? '?' + queryParams.join('&') : '';
            const url = `${config.baseUrl}/api/v2/post_object_list_bucket_name${queryString}`;
            
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

function createPost_Object_List_Bucket_NameTool(config: APIConfig): Tool {
    return {
        definition: {
            name: "post_object_list_bucket_name",
            description: "Search for objects under a prefix",
            parameters: {
        bucketName: { type: "string", required: true, description: "" },
        authorization: { type: "string", required: true, description: "" },
        prefix: { type: "string", required: true, description: "" },
        search: { type: "string", required: false, description: "" },
        limit: { type: "string", required: false, description: "" },
        offset: { type: "string", required: false, description: "" },
        sortBy: { type: "string", required: false, description: "" },
            }
        },
        handler: getPost_Object_List_Bucket_NameHandler(config)
    };
}

export {
    APIConfig,
    MCPRequest,
    MCPToolResult,
    MCPToolResultImpl,
    Tool,
    ToolDefinition,
    getPost_Object_List_Bucket_NameHandler,
    createPost_Object_List_Bucket_NameTool
};
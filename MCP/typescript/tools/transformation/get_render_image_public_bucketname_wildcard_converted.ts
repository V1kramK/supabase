/**
 * MCP Server function for Render a public image with the given transformations
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

function getGet_Render_Image_Public_Bucket_Name_WildcardHandler(config: APIConfig): (ctx: any, request: MCPRequest) => Promise<MCPToolResult> {
    return async function(ctx: any, request: MCPRequest): Promise<MCPToolResult> {
        try {
            const args = request?.params?.arguments || {};
            if (typeof args !== 'object') {
                return new MCPToolResultImpl("Invalid arguments object", true);
            }
            
            const queryParams: string[] = [];
    if (args.resize !== undefined) {
        queryParams.push(`resize=${args.resize}`);
    }
    if (args.format !== undefined) {
        queryParams.push(`format=${args.format}`);
    }
    if (args.download !== undefined) {
        queryParams.push(`download=${args.download}`);
    }
    if (args.bucketName !== undefined) {
        queryParams.push(`bucketName=${args.bucketName}`);
    }
    if (args.* !== undefined) {
        queryParams.push(`*=${args.*}`);
    }
    if (args.height !== undefined) {
        queryParams.push(`height=${args.height}`);
    }
    if (args.width !== undefined) {
        queryParams.push(`width=${args.width}`);
    }
    if (args.quality !== undefined) {
        queryParams.push(`quality=${args.quality}`);
    }
            
            const queryString = queryParams.length > 0 ? '?' + queryParams.join('&') : '';
            const url = `${config.baseUrl}/api/v2/get_render_image_public_bucket_name_wildcard${queryString}`;
            
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

function createGet_Render_Image_Public_Bucket_Name_WildcardTool(config: APIConfig): Tool {
    return {
        definition: {
            name: "get_render_image_public_bucket_name_wildcard",
            description: "Render a public image with the given transformations",
            parameters: {
        resize: { type: "string", required: false, description: "" },
        format: { type: "string", required: false, description: "" },
        download: { type: "string", required: false, description: "" },
        bucketName: { type: "string", required: true, description: "" },
        *: { type: "string", required: true, description: "" },
        height: { type: "string", required: false, description: "" },
        width: { type: "string", required: false, description: "" },
        quality: { type: "string", required: false, description: "" },
            }
        },
        handler: getGet_Render_Image_Public_Bucket_Name_WildcardHandler(config)
    };
}

export {
    APIConfig,
    MCPRequest,
    MCPToolResult,
    MCPToolResultImpl,
    Tool,
    ToolDefinition,
    getGet_Render_Image_Public_Bucket_Name_WildcardHandler,
    createGet_Render_Image_Public_Bucket_Name_WildcardTool
};
/**
 * MCP Server function for Create a table in the given namespace
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

function getPost_Iceberg_V1_Prefix_Namespaces_Namespace_TablesHandler(config: APIConfig): (ctx: any, request: MCPRequest) => Promise<MCPToolResult> {
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
    if (args.location !== undefined) {
        queryParams.push(`location=${args.location}`);
    }
    if (args.name !== undefined) {
        queryParams.push(`name=${args.name}`);
    }
    if (args.schema !== undefined) {
        queryParams.push(`schema=${args.schema}`);
    }
    if (args.stage-create !== undefined) {
        queryParams.push(`stage-create=${args.stage-create}`);
    }
    if (args.properties !== undefined) {
        queryParams.push(`properties=${args.properties}`);
    }
    if (args.spec !== undefined) {
        queryParams.push(`spec=${args.spec}`);
    }
    if (args.write-order !== undefined) {
        queryParams.push(`write-order=${args.write-order}`);
    }
            
            const queryString = queryParams.length > 0 ? '?' + queryParams.join('&') : '';
            const url = `${config.baseUrl}/api/v2/post_iceberg_v1_prefix_namespaces_namespace_tables${queryString}`;
            
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

function createPost_Iceberg_V1_Prefix_Namespaces_Namespace_TablesTool(config: APIConfig): Tool {
    return {
        definition: {
            name: "post_iceberg_v1_prefix_namespaces_namespace_tables",
            description: "Create a table in the given namespace",
            parameters: {
        prefix: { type: "string", required: true, description: "" },
        namespace: { type: "string", required: true, description: "" },
        location: { type: "string", required: false, description: "" },
        name: { type: "string", required: true, description: "" },
        schema: { type: "string", required: true, description: "" },
        stage-create: { type: "string", required: false, description: "" },
        properties: { type: "string", required: false, description: "" },
        spec: { type: "string", required: false, description: "" },
        write-order: { type: "string", required: false, description: "" },
            }
        },
        handler: getPost_Iceberg_V1_Prefix_Namespaces_Namespace_TablesHandler(config)
    };
}

export {
    APIConfig,
    MCPRequest,
    MCPToolResult,
    MCPToolResultImpl,
    Tool,
    ToolDefinition,
    getPost_Iceberg_V1_Prefix_Namespaces_Namespace_TablesHandler,
    createPost_Iceberg_V1_Prefix_Namespaces_Namespace_TablesTool
};
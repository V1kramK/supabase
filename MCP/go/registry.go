package main

import (
	"github.com/supabase-storage-api/mcp-server/config"
	"github.com/supabase-storage-api/mcp-server/models"
	tools_object "github.com/supabase-storage-api/mcp-server/tools/object"
	tools_transformation "github.com/supabase-storage-api/mcp-server/tools/transformation"
	tools_iceberg "github.com/supabase-storage-api/mcp-server/tools/iceberg"
	tools_s3 "github.com/supabase-storage-api/mcp-server/tools/s3"
	tools_bucket "github.com/supabase-storage-api/mcp-server/tools/bucket"
	tools_metrics "github.com/supabase-storage-api/mcp-server/tools/metrics"
	tools_resumable "github.com/supabase-storage-api/mcp-server/tools/resumable"
	tools_health "github.com/supabase-storage-api/mcp-server/tools/health"
)

func GetAll(cfg *config.APIConfig) []models.Tool {
	return []models.Tool{
		tools_object.CreateGet_object_info_authenticated_bucketname_wildcardTool(cfg),
		tools_object.CreateGet_object_public_bucketname_wildcardTool(cfg),
		tools_transformation.CreateGet_render_image_sign_bucketname_wildcardTool(cfg),
		tools_object.CreateGet_object_info_public_bucketname_wildcardTool(cfg),
		tools_object.CreateGet_object_info_bucketname_wildcardTool(cfg),
		tools_object.CreatePost_object_list_v2_bucketnameTool(cfg),
		tools_object.CreatePost_object_sign_bucketnameTool(cfg),
		tools_object.CreateDelete_object_bucketnameTool(cfg),
		tools_iceberg.CreateDelete_iceberg_v1_prefix_namespaces_namespace_tables_tableTool(cfg),
		tools_iceberg.CreateGet_iceberg_v1_prefix_namespaces_namespace_tables_tableTool(cfg),
		tools_iceberg.CreatePost_iceberg_v1_prefix_namespaces_namespace_tables_tableTool(cfg),
		tools_iceberg.CreateGet_iceberg_v1_prefix_namespaces_namespace_tablesTool(cfg),
		tools_iceberg.CreatePost_iceberg_v1_prefix_namespaces_namespace_tablesTool(cfg),
		tools_s3.CreateGet_s3Tool(cfg),
		tools_bucket.CreateDelete_bucket_bucketidTool(cfg),
		tools_bucket.CreateGet_bucket_bucketidTool(cfg),
		tools_bucket.CreatePut_bucket_bucketidTool(cfg),
		tools_object.CreatePost_object_list_bucketnameTool(cfg),
		tools_transformation.CreateGet_render_image_public_bucketname_wildcardTool(cfg),
		tools_metrics.CreateGet_metricsTool(cfg),
		tools_transformation.CreateGet_render_image_authenticated_bucketname_wildcardTool(cfg),
		tools_resumable.CreateDelete_upload_resumable_sign_wildcardTool(cfg),
		tools_resumable.CreateOptions_upload_resumable_sign_wildcardTool(cfg),
		tools_resumable.CreatePatch_upload_resumable_sign_wildcardTool(cfg),
		tools_resumable.CreatePost_upload_resumable_sign_wildcardTool(cfg),
		tools_resumable.CreatePut_upload_resumable_sign_wildcardTool(cfg),
		tools_bucket.CreateGet_bucketTool(cfg),
		tools_bucket.CreatePost_bucketTool(cfg),
		tools_resumable.CreatePut_upload_resumable_wildcardTool(cfg),
		tools_resumable.CreateDelete_upload_resumable_wildcardTool(cfg),
		tools_resumable.CreateOptions_upload_resumable_wildcardTool(cfg),
		tools_resumable.CreatePatch_upload_resumable_wildcardTool(cfg),
		tools_resumable.CreatePost_upload_resumable_wildcardTool(cfg),
		tools_iceberg.CreateGet_iceberg_v1_configTool(cfg),
		tools_object.CreateGet_object_sign_bucketname_wildcardTool(cfg),
		tools_object.CreatePost_object_sign_bucketname_wildcardTool(cfg),
		tools_resumable.CreatePost_upload_resumable_signTool(cfg),
		tools_resumable.CreateOptions_upload_resumable_signTool(cfg),
		tools_iceberg.CreateGet_iceberg_v1_prefix_namespacesTool(cfg),
		tools_iceberg.CreatePost_iceberg_v1_prefix_namespacesTool(cfg),
		tools_object.CreatePost_object_moveTool(cfg),
		tools_s3.CreateGet_s3_bucketTool(cfg),
		tools_s3.CreatePost_s3_bucketTool(cfg),
		tools_s3.CreatePut_s3_bucketTool(cfg),
		tools_s3.CreateDelete_s3_bucketTool(cfg),
		tools_resumable.CreateOptions_upload_resumableTool(cfg),
		tools_resumable.CreatePost_upload_resumableTool(cfg),
		tools_object.CreateDelete_cdn_bucketname_wildcardTool(cfg),
		tools_iceberg.CreateDelete_iceberg_v1_prefix_namespaces_namespaceTool(cfg),
		tools_iceberg.CreateGet_iceberg_v1_prefix_namespaces_namespaceTool(cfg),
		tools_health.CreateGet_healthTool(cfg),
		tools_s3.CreateDelete_s3_bucketTool(cfg),
		tools_s3.CreateGet_s3_bucketTool(cfg),
		tools_s3.CreatePost_s3_bucketTool(cfg),
		tools_s3.CreatePut_s3_bucketTool(cfg),
		tools_s3.CreateDelete_s3_bucket_wildcardTool(cfg),
		tools_s3.CreateGet_s3_bucket_wildcardTool(cfg),
		tools_s3.CreatePost_s3_bucket_wildcardTool(cfg),
		tools_s3.CreatePut_s3_bucket_wildcardTool(cfg),
		tools_bucket.CreatePost_bucket_bucketid_emptyTool(cfg),
		tools_object.CreateDelete_object_bucketname_wildcardTool(cfg),
		tools_object.CreateGet_object_bucketname_wildcardTool(cfg),
		tools_object.CreatePost_object_bucketname_wildcardTool(cfg),
		tools_object.CreatePut_object_bucketname_wildcardTool(cfg),
		tools_object.CreateGet_object_authenticated_bucketname_wildcardTool(cfg),
		tools_object.CreatePost_object_copyTool(cfg),
		tools_object.CreatePost_object_upload_sign_bucketname_wildcardTool(cfg),
		tools_object.CreatePut_object_upload_sign_bucketname_wildcardTool(cfg),
	}
}

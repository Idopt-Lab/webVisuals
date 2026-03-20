export default {
    async fetch(): Promise<Response> {
        // Static assets are served automatically by the [assets] config in wrangler.toml.
        // This worker only handles requests that don't match a static file.
        // Return the index.html for SPA client-side routing.
        return new Response(null, { status: 404 });
    },
};

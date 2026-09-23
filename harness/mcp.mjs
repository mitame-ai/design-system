import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { z } from 'zod'
import { checkDesign, loadHarness, readResource, resolveContext, searchDesign } from './core.mjs'

export async function serve() {
  const harness = loadHarness()
  const origin = process.env.TEZAWARI_PREVIEW_ORIGIN
  const server = new McpServer(
    { name: 'tezawari-design', version: harness.packageVersion },
    {
      instructions:
        'Resolve a scenario before building. Read its resources and task skills. Checks exercise a local preview with mocked writes. Mechanical success is not contextual acceptance. Restart after package changes.',
    },
  )
  for (const resource of harness.resources) {
    server.registerResource(
      resource.id,
      resource.uri,
      { title: resource.title, description: resource.description },
      async () => ({ contents: [readResource(harness, resource.uri)] }),
    )
  }
  const register = (name, description, inputSchema, run) => {
    server.registerTool(name, { description, inputSchema }, async (input) => {
      try {
        const result = await run(input)
        return {
          content: [{ type: 'text', text: JSON.stringify(result) }],
          structuredContent: result,
        }
      } catch (error) {
        return { isError: true, content: [{ type: 'text', text: error.message }] }
      }
    })
  }
  register(
    'search_design',
    'Search packaged design IDs, titles and descriptions. At most 20 results with a truncation flag.',
    { query: z.string().trim().min(1).max(200) },
    ({ query }) => searchDesign(harness, query),
  )
  register(
    'resolve_design_context',
    'Resolve an existing scenario and all its references and skills. Unknown IDs fail.',
    { scenarioId: z.string().min(1) },
    ({ scenarioId }) => resolveContext(harness, scenarioId),
  )
  register(
    'check_design',
    'Exercise the supported profile-edit scenario in the startup-configured local preview. Saves are intercepted. Returns rule findings, artifact identity and coverage; does not grant visual approval. Requires installed Playwright Chromium.',
    { scenarioId: z.string().min(1), route: z.string().default('/') },
    (input) => checkDesign(harness, input, { origin }),
  )
  await server.connect(new StdioServerTransport())
  return server
}

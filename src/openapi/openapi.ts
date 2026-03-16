import { readFileSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { parse } from 'yaml';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export function generateOpenApiDocument() {
  // Load OpenAPI spec from YAML file
  // Path is relative to this file: ../docs/api/openapi.yaml
  const yamlPath = join(__dirname, '../docs/api/openapi.yaml');
  const yamlContent = readFileSync(yamlPath, 'utf-8');
  const openApiDocument = parse(yamlContent);

  return openApiDocument;
}
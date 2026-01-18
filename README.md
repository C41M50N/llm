# @cbuff/llm

Type-safe LLM wrapper built on [Vercel AI SDK](https://sdk.vercel.ai/) with provider/model registry and optional cost tracking.

## Installation

```bash
bun add @cbuff/llm ai
```

Install the provider SDKs you need:

```bash
bun add @ai-sdk/openai @ai-sdk/anthropic @ai-sdk/google
```

## Usage

```typescript
import { createLLM } from "@cbuff/llm";
import { createOpenAI } from "@ai-sdk/openai";

const llm = createLLM({
  providers: {
    openai: () => createOpenAI({ apiKey: process.env.OPENAI_API_KEY }),
    anthropic: async () => {
      const { createAnthropic } = await import("@ai-sdk/anthropic");
      return createAnthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    },
  },
  models: {
    fast: { provider: "openai", id: "gpt-4o-mini" },
    smart: { provider: "openai", id: "gpt-4o", costs: { input: 2.5, output: 10 } },
    claude: { provider: "anthropic", id: "claude-sonnet-4-20250514", costs: { input: 3, output: 15 } },
  },
});

// Full autocomplete on model names
const { data, metadata } = await llm.generate({
  model: "fast",
  prompt: "Hello, world!",
});

console.log(data);
console.log(metadata.totalCostUsd); // undefined if costs not configured
```

## Features

- **Type-safe model selection** — Full autocomplete on model aliases, provider references validated at compile time
- **Lazy provider loading** — Providers can be sync or async, loaded on first use and cached
- **Optional cost tracking** — Define `costs: { input, output }` per model (USD per 1M tokens), skip if you don't need it
- **Unified config** — Single `createLLM()` call with providers and models in one object

## API

### `createLLM(config)`

Creates a typed LLM client.

```typescript
const llm = createLLM({
  providers: {
    [key: string]: () => Provider | Promise<Provider>
  },
  models: {
    [alias: string]: {
      provider: string;  // must match a key in providers
      id: string;        // actual model ID sent to provider
      costs?: { input: number; output: number };  // USD per 1M tokens
    }
  }
});
```

### `llm.generate(params)`

Generate text or structured output.

```typescript
const { data, metadata } = await llm.generate({
  model: "fast",           // required, autocompletes to your model aliases
  prompt: "Hello",         // required
  system: "Be helpful",    // optional
  temperature: 0.7,        // optional
  maxOutputTokens: 1000,   // optional
  output: schema,          // optional, for structured output
  logKey: "my-request",    // optional, logs timing and cost
});
```

**Returns:**

```typescript
{
  data: string | T,  // text or structured output
  metadata: {
    responseTimeMs: number,
    inputTokens: number,
    outputTokens: number,
    inputCostUsd?: number,   // undefined if costs not configured
    outputCostUsd?: number,
    totalCostUsd?: number,
  }
}
```

## License

MIT

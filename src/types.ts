import type { generateText, LanguageModel, Output, InferGenerateOutput } from "ai";

// ############################################################################
// Provider Types
// ############################################################################

/**
 * A provider instance that can create language models.
 * This is the return type of provider factories like `createOpenAI()`.
 */
export type LanguageModelProvider = (modelId: string) => LanguageModel;

/**
 * A factory function that creates a provider instance.
 * Can be sync or async (for lazy-loading provider SDKs).
 */
export type ProviderFactory = () => LanguageModelProvider | Promise<LanguageModelProvider>;

// ############################################################################
// Model Types
// ############################################################################

/**
 * Configuration for a single model.
 * @template TProviders - Union of available provider keys
 */
export type ModelEntry<TProviders extends string> = {
  /** The provider key to use for this model */
  provider: TProviders;
  /** The actual model ID to pass to the provider */
  id: string;
  /** Optional cost tracking (per 1M tokens in USD) */
  costs?: {
    input: number;
    output: number;
  };
};

// ############################################################################
// Config Types
// ############################################################################

/**
 * Full configuration object for createLLM.
 * @template TProviders - Record of provider factories
 * @template TModels - Record of model configurations
 */
export type LLMConfig<
  TProviders extends Record<string, ProviderFactory>,
  TModels extends Record<string, ModelEntry<keyof TProviders & string>>
> = {
  providers: TProviders;
  models: TModels;
};

// ############################################################################
// Generate Types
// ############################################################################

type GenerateTextParams = Parameters<typeof generateText>[0];

type DefaultOutput = Output.Output<string, string>;

/**
 * Parameters for the generate function.
 * @template TModels - Union of available model keys
 * @template TOutput - Output schema type
 */
export type GenerateParams<
  TModels extends string,
  TOutput extends Output.Output = DefaultOutput
> = {
  /** The model alias to use */
  model: TModels;
  /** The user prompt */
  prompt: string;
  /** Optional system prompt */
  system?: string;
  /** Optional output schema for structured generation */
  output?: TOutput;
  /** Optional key for logging */
  logKey?: string;
} & Pick<GenerateTextParams, "temperature" | "maxOutputTokens">;

/**
 * Response metadata from a generate call.
 */
export type GenerateMetadata = {
  /** Response time in milliseconds */
  responseTimeMs: number;
  /** Number of input tokens used */
  inputTokens: number;
  /** Number of output tokens generated */
  outputTokens: number;
  /** Cost of input tokens in USD (undefined if costs not configured) */
  inputCostUsd?: number;
  /** Cost of output tokens in USD (undefined if costs not configured) */
  outputCostUsd?: number;
  /** Total cost in USD (undefined if costs not configured) */
  totalCostUsd?: number;
};

/**
 * Response from a generate call.
 * @template TOutput - Output schema type
 */
export type GenerateResponse<TOutput extends Output.Output = DefaultOutput> = {
  /** The generated data */
  data: InferGenerateOutput<TOutput>;
  /** Metadata about the generation */
  metadata: GenerateMetadata;
};

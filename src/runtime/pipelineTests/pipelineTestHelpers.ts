import ConsoleLogger from "@/tests/ConsoleLogger";
import { Block, UnknownObject } from "@/types";
import { propertiesToSchema } from "@/validators/generic";
import { ApiVersion, BlockArg, BlockOptions } from "@/core";
import { InitialValues } from "@/runtime/reducePipeline";
import apiVersionOptions from "@/runtime/apiVersionOptions";

const logger = new ConsoleLogger();

class ContextBlock extends Block {
  constructor() {
    super("test/context", "Return Context");
  }

  inputSchema = propertiesToSchema({});

  async run(arg: BlockArg, { ctxt }: BlockOptions) {
    return ctxt;
  }
}

class EchoBlock extends Block {
  constructor() {
    super("test/echo", "Echo Block");
  }

  inputSchema = propertiesToSchema({
    message: {
      type: "string",
    },
  });

  async run({ message }: BlockArg) {
    return { message };
  }
}

export const echoBlock = new EchoBlock();
export const contextBlock = new ContextBlock();

/**
 * Helper method to pass only `input` to reducePipeline.
 */
export function simpleInput(input: UnknownObject): InitialValues {
  return {
    input,
    root: null,
    serviceContext: {},
    optionsArgs: {},
  };
}

/**
 * Common reducePipeline options
 */
export function testOptions(version: ApiVersion) {
  return {
    logger,
    ...apiVersionOptions(version),
  };
}

export const TEST_BLOCKS = [echoBlock, contextBlock];

/**
 * Copied from ReactSymbols.js
 * https://github.com/facebook/react/blob/master/packages/shared/ReactSymbols.js
 */

export type ReactSymbol = symbol | number;

// eslint-disable-next-line unicorn/number-literal-case, unicorn/numeric-separators-style
export let REACT_MEMO_TYPE: ReactSymbol = 0xead3;
// eslint-disable-next-line unicorn/number-literal-case, unicorn/numeric-separators-style
export let REACT_FORWARD_REF_TYPE: ReactSymbol = 0xead0;

const symbolFor = typeof Symbol === "function" && Symbol.for;

/* istanbul ignore else */
if (symbolFor) {
  REACT_MEMO_TYPE = Symbol.for("react.memo");
  REACT_FORWARD_REF_TYPE = Symbol.for("react.forward_ref");
}

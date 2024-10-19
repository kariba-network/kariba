import type { UnwrappedEthersResult } from "&/drips/common/types.js";

export default function unwrapEthersResult<T>(
  result: T | T[],
): UnwrappedEthersResult<T> | UnwrappedEthersResult<T[]> {
  if (Array.isArray(result) && result.length === 1) {
    return result[0] as UnwrappedEthersResult<T>;
  }

  return result as UnwrappedEthersResult<T[]>;
}

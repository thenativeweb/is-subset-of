import { Type } from 'typedescriptor';

const allowedTypes = [ 'array', 'object', 'null' ];

const isSubsetOf = function (
  subset: any[] | { [key: string]: any | undefined } | null,
  superset: any[] | { [key: string]: any | undefined } | null,
  visited: string[] = []
): boolean {
  const subsetType = Type.of(subset);
  const supersetType = Type.of(superset);

  if (!allowedTypes.includes(subsetType)) {
    throw new Error(`Type '${subsetType}' is not supported.`);
  }
  if (!allowedTypes.includes(supersetType)) {
    throw new Error(`Type '${supersetType}' is not supported.`);
  }

  if (Type.isArray(subset)) {
    if (!Type.isArray(superset)) {
      throw new Error(`Types '${subsetType}' and '${supersetType}' do not match.`);
    }
    if (subset.length > superset.length) {
      return false;
    }

    for (const subsetItem of subset) {
      const subsetItemType = Type.of(subsetItem);

      let isItemInSuperset;

      switch (subsetItemType) {
        case 'array':
        case 'object': {
          if (visited.includes(subsetItem)) {
            continue;
          }

          visited.push(subsetItem);

          isItemInSuperset = superset.some((supersetItem: any): boolean => {
            try {
              return isSubsetOf(subsetItem, supersetItem, visited);
            } catch {
              return false;
            }
          });
          break;
        }
        default: {
          isItemInSuperset = superset.some(
            (supersetItem: any): boolean => subsetItem === supersetItem
          );
        }
      }

      if (!isItemInSuperset) {
        return false;
      }
    }

    return true;
  }

  if (Type.isObject(subset)) {
    if (!Type.isObject(superset) || Type.isArray(superset)) {
      throw new Error(`Types '${subsetType}' and '${supersetType}' do not match.`);
    }
    if (Object.keys(subset).length > Object.keys(superset).length) {
      return false;
    }

    for (const [ subsetKey, subsetValue ] of Object.entries(subset)) {
      const supersetValue = superset[subsetKey];

      const subsetValueType = Type.of(subsetValue);

      switch (subsetValueType) {
        case 'array':
        case 'object': {
          if (visited.includes(subsetValue)) {
            continue;
          }

          visited.push(subsetValue);

          try {
            const isInSuperset = isSubsetOf(subsetValue, supersetValue, visited);

            if (!isInSuperset) {
              return false;
            }
          } catch {
            return false;
          }
          break;
        }
        default: {
          if (subsetValue !== supersetValue) {
            return false;
          }
        }
      }
    }

    return true;
  }

  if (Type.isNull(subset)) {
    if (!Type.isNull(superset)) {
      throw new Error(`Types '${subsetType}' and '${supersetType}' do not match.`);
    }

    return true;
  }

  throw new Error('Invalid operation.');
};

isSubsetOf.structural = function (
  subset: { [key: string]: any } | null,
  superset: { [key: string]: any } | null,
  visited: string[] = []
): boolean {
  if (!Type.isObject(subset)) {
    throw new Error(`Type '${Type.of(subset)}' is not supported.`);
  }

  if (!Type.isObject(superset)) {
    throw new Error(`Type '${Type.of(superset)}' is not supported.`);
  }

  for (const [ subsetKey, subsetValue ] of Object.entries(subset)) {
    if (superset[subsetKey] === undefined) {
      return false;
    }

    const subsetValueType = Type.of(subsetValue);
    const supersetValue = superset[subsetKey];

    if (subsetValueType === 'object') {
      if (visited.includes(subsetValue)) {
        continue;
      }

      visited.push(subsetValue);

      try {
        const isInSuperset = isSubsetOf.structural(subsetValue, supersetValue, visited);

        if (!isInSuperset) {
          return false;
        }
      } catch {
        return false;
      }
    }
  }

  return true;
};

export { isSubsetOf };

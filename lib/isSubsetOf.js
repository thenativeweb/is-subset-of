'use strict';

const Type = require('typedescriptor');

const allowedTypes = [ 'array', 'object', 'null' ];

const isSubsetOf = function (subset, superset, visited = []) {
  const subsetType = Type.of(subset);
  const supersetType = Type.of(superset);

  if (!allowedTypes.includes(subsetType)) {
    throw new Error(`Type '${subsetType}' is not supported.`);
  }
  if (!allowedTypes.includes(supersetType)) {
    throw new Error(`Type '${supersetType}' is not supported.`);
  }

  if (subsetType !== supersetType) {
    throw new Error(`Types '${subsetType}' and '${supersetType}' do not match.`);
  }

  switch (subsetType) {
    case 'array': {
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

            isItemInSuperset = superset.some(supersetItem => {
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
              supersetItem => subsetItem === supersetItem
            );
          }
        }

        if (!isItemInSuperset) {
          return false;
        }
      }

      return true;
    }

    case 'object': {
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

    case 'null': {
      return true;
    }

    default: {
      throw new Error('Invalid operation.');
    }
  }
};

isSubsetOf.structural = function (subset, superset, visited = []) {
  const subsetType = Type.of(subset);
  const supersetType = Type.of(superset);

  if (subsetType !== 'object') {
    throw new Error(`Type '${subsetType}' is not supported.`);
  }
  if (supersetType !== 'object') {
    throw new Error(`Type '${supersetType}' is not supported.`);
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

module.exports = isSubsetOf;

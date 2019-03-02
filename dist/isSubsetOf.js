'use strict';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));

var Type = require('typedescriptor');

var allowedTypes = ['array', 'object', 'null'];

var isSubsetOf = function isSubsetOf(subset, superset) {
  var visited = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
  var subsetType = Type.of(subset);
  var supersetType = Type.of(superset);

  if (!allowedTypes.includes(subsetType)) {
    throw new Error("Type '".concat(subsetType, "' is not supported."));
  }

  if (!allowedTypes.includes(supersetType)) {
    throw new Error("Type '".concat(supersetType, "' is not supported."));
  }

  if (subsetType !== supersetType) {
    throw new Error("Types '".concat(subsetType, "' and '").concat(supersetType, "' do not match."));
  }

  switch (subsetType) {
    case 'array':
      {
        if (subset.length > superset.length) {
          return false;
        }

        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          var _loop = function _loop() {
            var subsetItem = _step.value;
            var subsetItemType = Type.of(subsetItem);
            var isItemInSuperset = void 0;

            switch (subsetItemType) {
              case 'array':
              case 'object':
                {
                  if (visited.includes(subsetItem)) {
                    return "continue";
                  }

                  visited.push(subsetItem);
                  isItemInSuperset = superset.some(function (supersetItem) {
                    try {
                      return isSubsetOf(subsetItem, supersetItem, visited);
                    } catch (ex) {
                      return false;
                    }
                  });
                  break;
                }

              default:
                {
                  isItemInSuperset = superset.some(function (supersetItem) {
                    return subsetItem === supersetItem;
                  });
                }
            }

            if (!isItemInSuperset) {
              return {
                v: false
              };
            }
          };

          for (var _iterator = subset[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var _ret = _loop();

            switch (_ret) {
              case "continue":
                continue;

              default:
                if ((0, _typeof2.default)(_ret) === "object") return _ret.v;
            }
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator.return != null) {
              _iterator.return();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }

        return true;
      }

    case 'object':
      {
        if (Object.keys(subset).length > Object.keys(superset).length) {
          return false;
        }

        var _arr = Object.entries(subset);

        for (var _i = 0; _i < _arr.length; _i++) {
          var _arr$_i = (0, _slicedToArray2.default)(_arr[_i], 2),
              subsetKey = _arr$_i[0],
              subsetValue = _arr$_i[1];

          var supersetValue = superset[subsetKey];
          var subsetValueType = Type.of(subsetValue);

          switch (subsetValueType) {
            case 'array':
            case 'object':
              {
                if (visited.includes(subsetValue)) {
                  continue;
                }

                visited.push(subsetValue);

                try {
                  var isInSuperset = isSubsetOf(subsetValue, supersetValue, visited);

                  if (!isInSuperset) {
                    return false;
                  }
                } catch (ex) {
                  return false;
                }

                break;
              }

            default:
              {
                if (subsetValue !== supersetValue) {
                  return false;
                }
              }
          }
        }

        return true;
      }

    case 'null':
      {
        return true;
      }

    default:
      {
        throw new Error('Invalid operation.');
      }
  }
};

isSubsetOf.structural = function (subset, superset) {
  var visited = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
  var subsetType = Type.of(subset);
  var supersetType = Type.of(superset);

  if (subsetType !== 'object') {
    throw new Error("Type '".concat(subsetType, "' is not supported."));
  }

  if (supersetType !== 'object') {
    throw new Error("Type '".concat(supersetType, "' is not supported."));
  }

  var _arr2 = Object.entries(subset);

  for (var _i2 = 0; _i2 < _arr2.length; _i2++) {
    var _arr2$_i = (0, _slicedToArray2.default)(_arr2[_i2], 2),
        subsetKey = _arr2$_i[0],
        subsetValue = _arr2$_i[1];

    if (superset[subsetKey] === undefined) {
      return false;
    }

    var subsetValueType = Type.of(subsetValue);
    var supersetValue = superset[subsetKey];

    if (subsetValueType === 'object') {
      if (visited.includes(subsetValueType)) {
        continue;
      }

      visited.push(subsetValueType);

      try {
        var isInSuperset = isSubsetOf.structural(subsetValue, supersetValue, visited);

        if (!isInSuperset) {
          return false;
        }
      } catch (ex) {
        return false;
      }
    }
  }

  return true;
};

module.exports = isSubsetOf;
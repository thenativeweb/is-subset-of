'use strict';

const assert = require('assertthat');

const isSubsetOf = require('../../src/isSubsetOf');

suite('isSubsetOf', () => {
  test('is a function.', async () => {
    assert.that(isSubsetOf).is.ofType('function');
  });

  test('throws an error if the given subset is an unsupported type.', async () => {
    assert.that(() => {
      isSubsetOf('the native web', []);
    }).is.throwing(`Type 'string' is not supported.`);
  });

  test('throws an error if the given superset is an unsupported type.', async () => {
    assert.that(() => {
      isSubsetOf([], 42);
    }).is.throwing(`Type 'number' is not supported.`);
  });

  test('throws an error if the given subset and superset are of distinct types.', async () => {
    assert.that(() => {
      isSubsetOf([], {});
    }).is.throwing(`Types 'array' and 'object' do not match.`);
  });

  suite('array', () => {
    test('returns true if the given subset is actually a subset of the given superset.', async () => {
      const pairs = [
        { subset: [], superset: []},
        { subset: [], superset: [ 2 ]},
        { subset: [ 2, 3, 5 ], superset: [ 2, 3, 5 ]},
        { subset: [ 2, 3, 5 ], superset: [ 2, 3, 5, 7 ]},
        { subset: [ 5 ], superset: [ 2, 3, 5, 7 ]},

        { subset: [], superset: [[]]},
        { subset: [], superset: [[ 2 ]]},
        { subset: [[ 2, 3, 5 ]], superset: [[ 2, 3, 5 ]]},
        { subset: [[ 2, 3, 5 ]], superset: [[ 2, 3, 5, 7 ]]},
        { subset: [[ 5 ]], superset: [[ 2, 3, 5, 7 ]]},
        { subset: [[ 2, 3 ], [ 5 ]], superset: [[ 2, 3 ], [ 5 ]]},
        { subset: [[ 2, 3 ], [ 5 ]], superset: [[ 5 ], [ 2, 3 ]]}
      ];

      for (const { subset, superset } of pairs) {
        assert.that(isSubsetOf(subset, superset)).is.true();
      }
    });

    test('returns false if the given subset is not a subset of the given superset.', async () => {
      const pairs = [
        { subset: [ 2 ], superset: []},
        { subset: [ 2 ], superset: [ 3 ]},
        { subset: [ 2, 3, 5 ], superset: [ 2, 3, 7 ]},

        { subset: [[]], superset: []},
        { subset: [[ 2 ]], superset: []},
        { subset: [[ 2, 3, 5, 7 ]], superset: [[ 2, 3, 5 ]]},
        { subset: [[ 2, 3, 5, 7 ]], superset: [[ 5 ]]},
        { subset: [[ 2, 3 ], [ 5 ]], superset: [[ 2, 3 ]]},
        { subset: [[ 2 ]], superset: [ 'the native web' ]}
      ];

      for (const { subset, superset } of pairs) {
        assert.that(isSubsetOf(subset, superset)).is.false();
      }
    });
  });

  suite('object', () => {
    test('returns true if the given subset is actually a subset of the given superset.', async () => {
      const pairs = [
        { subset: {}, superset: {}},
        { subset: {}, superset: { name: 'the native web' }},
        { subset: { name: 'the native web' }, superset: { name: 'the native web' }},
        { subset: { name: 'the native web' }, superset: { name: 'the native web', city: 'Riegel am Kaiserstuhl' }},

        { subset: {}, superset: { name: {}}},
        { subset: {}, superset: { name: { full: 'the native web', abbreviation: 'tnw' }}},
        { subset: { name: { full: 'the native web', abbreviation: 'tnw' }}, superset: { name: { full: 'the native web', abbreviation: 'tnw' }}},
        { subset: { name: { full: 'the native web' }}, superset: { name: { full: 'the native web', abbreviation: 'tnw' }}}
      ];

      for (const { subset, superset } of pairs) {
        assert.that(isSubsetOf(subset, superset)).is.true();
      }
    });

    test('returns false if the given subset is not a subset of the given superset.', async () => {
      const pairs = [
        { subset: { name: 'the native web' }, superset: {}},
        { subset: { name: 'the native web', city: 'Riegel am Kaiserstuhl' }, superset: { name: 'the native web' }},
        { subset: { name: 'the native web', city: 'Riegel am Kaiserstuhl' }, superset: { name: 'the native web', country: 'Germany' }},

        { subset: { name: {}}, superset: {}},
        { subset: { name: { full: 'the native web', abbreviation: 'tnw' }}, superset: {}},
        { subset: { name: { full: 'the native web', abbreviation: 'tnw' }}, superset: { name: { full: 'the native web' }}},
        { subset: { name: { full: 'the native web' }}, superset: { name: 'the native web' }},
        { subset: { name: { full: 'the native web' }, city: 'Riegel am Kaiserstuhl' }, superset: { name: { full: 'the native web' }, country: 'Germany' }}
      ];

      for (const { subset, superset } of pairs) {
        assert.that(isSubsetOf(subset, superset)).is.false();
      }
    });
  });

  suite('null', () => {
    test('returns true if null is given as a subset and a superset.', async () => {
      const pairs = [
        { subset: null, superset: null }
      ];

      for (const { subset, superset } of pairs) {
        assert.that(isSubsetOf(subset, superset)).is.true();
      }
    });
  });

  suite('mixed', () => {
    test('returns true if the given subset is actually a subset of the given superset.', async () => {
      const pairs = [
        { subset: [], superset: [{ name: 'the native web' }]},
        { subset: [{ name: 'the native web' }], superset: [{ name: 'the native web' }]},
        { subset: [{ name: 'the native web' }], superset: [{ name: 'the native web', city: 'Riegel am Kaiserstuhl' }]},

        { subset: {}, superset: { names: [ 'the native web', 'tnw' ]}},
        { subset: { names: [ 'the native web', 'tnw' ]}, superset: { names: [ 'the native web', 'tnw' ]}}
      ];

      for (const { subset, superset } of pairs) {
        assert.that(isSubsetOf(subset, superset)).is.true();
      }
    });

    test('returns false if the given subset is not a subset of the given superset.', async () => {
      const pairs = [
        { subset: [{ name: 'the native web' }], superset: []},
        { subset: [{ name: 'the native web', city: 'Riegel am Kaiserstuhl' }], superset: [{ name: 'the native web' }]},
        { subset: [{ name: 'the native web', city: 'Riegel am Kaiserstuhl' }], superset: [{ name: 'the native web', country: 'Germany' }]},

        { subset: { names: [ 'the native web', 'tnw' ]}, superset: {}},
        { subset: { names: [ 'the native web', 'tnw' ]}, superset: { names: [ 'the native web' ]}}
      ];

      for (const { subset, superset } of pairs) {
        assert.that(isSubsetOf(subset, superset)).is.false();
      }
    });
  });

  suite('recursion', () => {
    test('stops if recursion is detected.', async () => {
      const subsetArray = [];
      const supersetArray = [];

      subsetArray.push(subsetArray);
      supersetArray.push(supersetArray);

      const subsetObject = {};
      const supersetObject = {};

      subsetObject.key = subsetObject;
      supersetObject.key = supersetObject;

      const pairs = [
        { subset: subsetArray, superset: supersetArray },
        { subset: subsetObject, superset: supersetObject }
      ];

      for (const { subset, superset } of pairs) {
        assert.that(isSubsetOf(subset, superset)).is.true();
      }
    });
  });

  suite('structural', () => {
    test('is a function.', async () => {
      assert.that(isSubsetOf.structural).is.ofType('function');
    });

    test('throws an error if the given subset is an unsupported type.', async () => {
      assert.that(() => {
        isSubsetOf.structural('the native web', {});
      }).is.throwing(`Type 'string' is not supported.`);
    });

    test('throws an error if the given superset is an unsupported type.', async () => {
      assert.that(() => {
        isSubsetOf.structural({}, 42);
      }).is.throwing(`Type 'number' is not supported.`);
    });

    test('returns true if the given subset is a structural subset of the given superset.', async () => {
      const pairs = [
        { subset: {}, superset: {}},
        { subset: {}, superset: { name: 'the native web' }},
        { subset: { name: 'the native web' }, superset: { name: 'Intuity' }},
        { subset: { name: 'the native web' }, superset: { name: 'Intuity', city: 'Stuttgart' }},

        { subset: {}, superset: { name: {}}},
        { subset: {}, superset: { name: { full: 'the native web', abbreviation: 'tnw' }}},
        { subset: { name: { full: 'the native web', abbreviation: 'tnw' }}, superset: { name: { full: 'Intuity', abbreviation: 'ity' }}},
        { subset: { name: { full: 'the native web' }}, superset: { name: { full: 'Intuity', abbreviation: 'ity' }}}
      ];

      for (const { subset, superset } of pairs) {
        assert.that(isSubsetOf.structural(subset, superset)).is.true();
      }
    });

    test('returns false if the given subset is not a structural subset of the given superset.', async () => {
      const pairs = [
        { subset: { name: 'the native web' }, superset: {}},
        { subset: { name: 'the native web', city: 'Riegel am Kaiserstuhl' }, superset: { name: 'Intuity' }},
        { subset: { name: 'the native web', city: 'Riegel am Kaiserstuhl' }, superset: { name: 'Intuity', country: 'Germany' }},

        { subset: { name: {}}, superset: {}},
        { subset: { name: { full: 'the native web', abbreviation: 'tnw' }}, superset: {}},
        { subset: { name: { full: 'the native web', abbreviation: 'tnw' }}, superset: { name: { full: 'Intuity' }}},
        { subset: { name: { full: 'the native web' }}, superset: { name: 'Intuity' }}
      ];

      for (const { subset, superset } of pairs) {
        assert.that(isSubsetOf.structural(subset, superset)).is.false();
      }
    });

    suite('recursion', () => {
      test('stops if recursion is detected.', async () => {
        const subsetObject = { };
        const supersetObject = { };

        subsetObject.key = subsetObject;
        supersetObject.key = supersetObject;

        const pairs = [
          { subset: subsetObject, superset: supersetObject }
        ];

        for (const { subset, superset } of pairs) {
          assert.that(isSubsetOf.structural(subset, superset)).is.true();
        }
      });
    });
  });
});

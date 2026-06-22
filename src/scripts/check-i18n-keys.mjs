// Verify ru.json and en.json have identical key sets.
import ru from '../../messages/ru.json' with { type: 'json' };
import en from '../../messages/en.json' with { type: 'json' };

const flat = (o, p = '') =>
  Object.entries(o).flatMap(([k, v]) =>
    v && typeof v === 'object' ? flat(v, p + k + '.') : [p + k],
  );

const R = flat(ru).sort();
const E = flat(en).sort();
const diff = (a, b) => a.filter((x) => !b.includes(x));

const onlyRu = diff(R, E);
const onlyEn = diff(E, R);

console.log('only in ru:', onlyRu.length ? onlyRu : '(none)');
console.log('only in en:', onlyEn.length ? onlyEn : '(none)');
process.exit(onlyRu.length || onlyEn.length ? 1 : 0);

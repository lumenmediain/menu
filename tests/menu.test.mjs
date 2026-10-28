import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import ts from "typescript";
function load(file) {
  const code = ts.transpileModule(fs.readFileSync(file, "utf8"), {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
    },
  }).outputText;
  const exports = {};
  vm.runInNewContext(code, { exports, Intl });
  return exports;
}
const { paginate, money } = load("src/lib/types.ts");
const { demoData } = load("src/lib/demo.ts");
test("long categories become bounded leaves without dropping or reordering dishes", () => {
  const items = Array.from({ length: 37 }, (_, n) => ({ id: String(n) }));
  const pages = paginate({
    categories: [{ id: "long", title: "Long category", items }],
  });
  assert.equal(pages[0].kind, "cover");
  assert.equal(pages.at(-1).kind, "info");
  const leaves = pages.filter((p) => p.kind === "category");
  assert.equal(leaves.length, 10);
  assert.deepEqual(
    Array.from(
      leaves.flatMap((p) => p.category.items),
      (item) => item.id,
    ),
    items.map((i) => i.id),
  );
  assert.ok(leaves.every((p) => p.category.items.length <= 4));
  assert.equal(leaves[0].continuation, false);
  assert.equal(leaves[1].continuation, true);
  assert.equal(items.length, 37);
});
test("empty published menus retain cover and café information", () => {
  assert.equal(paginate({ categories: [] }).length, 2);
  assert.equal(
    paginate({ categories: [{ id: "empty", items: [] }] }).length,
    3,
  );
});
test("compact paper pagination preserves every item at two and three dishes per leaf", () => {
  for (const capacity of [2, 3]) {
    const pages = paginate(demoData, capacity);
    const leaves = pages.filter((page) => page.category);
    assert.ok(leaves.every((page) => page.category.items.length <= capacity));
    assert.deepEqual(
      Array.from(
        leaves.flatMap((page) => page.category.items),
        (item) => item.id,
      ),
      Array.from(
        demoData.categories.flatMap((category) =>
          category.items.map((item) => item.id),
        ),
      ),
    );
  }
});
test("demo items have unique identities, local photographs and valid currency", () => {
  const items = demoData.categories.flatMap((c) => c.items);
  assert.equal(new Set(items.map((i) => i.id)).size, items.length);
  for (const item of items) {
    assert.ok(item.price >= 0);
    assert.ok(money(item).length > 1);
    assert.ok(fs.existsSync(`public${item.image}`));
  }
  assert.equal(demoData.settings.orderingEnabled, false);
  assert.equal(demoData.demo, true);
});

const { menuBackgrounds, resolveCategoryBackground, resolveCoverBackground } = load("src/lib/menu-backgrounds.ts");
test("background assignments reference real assets and cover never falls back to food categories", () => {
  for (const entry of Object.values(menuBackgrounds)) {
    for (const file of [entry.artwork, entry.fallback].filter(Boolean)) assert.ok(fs.existsSync(`public${file}`), file);
  }
  assert.equal(resolveCoverBackground({}), "/images/coffee-cup.jpg");
  assert.equal(resolveCoverBackground({coverImage: "https://cdn.sanity.io/custom-cover.jpg"}), "https://cdn.sanity.io/custom-cover.jpg");
});
test("specific category identity wins over broad themes and missing art is never invented", () => {
  const category = {id: "ice-cream", title: "Ice cream", theme: "dessert", items: []};
  assert.equal(resolveCategoryBackground(category).src, undefined);
  assert.equal(resolveCategoryBackground({...category, id: "sandwiches", title: "Sandwiches"}).src, "/images/scenes/sandwich.webp");
  assert.equal(resolveCategoryBackground({...category, id: "burgers", title: "Burgers"}).src, "/images/scenes/burger.webp");
  assert.equal(resolveCategoryBackground({...category, id: "tofu", title: "Tofu"}).src, undefined);
});
test("CMS backgrounds are retained and continuations have intentional alternate positions", () => {
  const category = {id: "pizza", title: "Pizza", theme: "pizza", items: []};
  const first = resolveCategoryBackground(category), next = resolveCategoryBackground(category, true);
  assert.equal(first.src, "/images/scenes/pizza.webp");
  assert.notEqual(first.position, next.position);
  assert.equal(resolveCategoryBackground({...category, background: "https://cdn.sanity.io/portrait.jpg"}).src, "https://cdn.sanity.io/portrait.jpg");
});

test("artwork page limits preserve every dish while leaving the food area free", () => {
  const { backgroundPageLimits } = load("src/lib/menu-backgrounds.ts");
  const categories = [
    {id:"pizza", title:"Pizza", theme:"pizza", items:[{id:"a"},{id:"b"},{id:"c"}]},
    {id:"coffee", title:"Coffee", theme:"coffee", items:[{id:"d"},{id:"e"}]},
  ];
  const pages = paginate({categories}, 2, backgroundPageLimits(categories));
  assert.equal(pages.filter(p=>p.category?.id==="pizza").length, 3);
  assert.equal(pages.filter(p=>p.category?.id==="coffee").length, 1);
  assert.equal(pages.flatMap(p=>p.category?.items||[]).map(i=>i.id).join(","), "a,b,c,d,e");
});

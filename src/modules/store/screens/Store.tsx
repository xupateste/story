"use client";

import type {Product} from "~/product/types";

import {useMemo, useState} from "react";
import {SearchIcon, X, Table, StretchHorizontal, ChevronDown} from "lucide-react";

import {useCart} from "~/cart/context/client";
import ProductCard from "~/product/components/ProductCard";
import {Input} from "~/ui/components/form/input";
import {Toggle} from "~/ui/components/form/toggle";
import {cn} from "~/ui/utils";

function StoreScreen({products}: {products: Product[]}) {
  const [, {addItem}] = useCart();
  const [query, setQuery] = useState<string>("");
  const [layout, setLayout] = useState<"list" | "grid">(() =>
    "grid",
  );
  const [selectedCategory, setSelectedCategory] = useState<Product["category"] | null>(null);
  const categories = useMemo<[Product["category"], Product[]][]>(() => {
    let draft = products;

    // Filter products by search query
    if (query) {
      draft = draft.filter(({title, description}) =>
        (title.toLowerCase() + description.toLowerCase()).includes(query.toLowerCase()),
      );
    }

    // Group products by category
    const groups = draft.reduce<Map<Product["category"], Product[]>>((map, product) => {
      if (!map.has(product.category)) {
        map.set(product.category, []);
      }

      map.set(product.category, map.get(product.category)!.concat(product));

      return map;
    }, new Map());

    // Return them in a tuple of [category, products]
    return Array.from(groups.entries());
  }, [query, products]);

  function handleSelectCategory(category: Product["category"]) {
    setSelectedCategory((currentSelectedCategory) =>
      currentSelectedCategory === category ? null : category,
    );

    // Scroll to the category
    queueMicrotask(() => {
      const categoryElement = document.getElementById(category)!;
      const filtersElement = document.getElementById("filters")!;
      const offset = filtersElement.getBoundingClientRect().height;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = categoryElement.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
      });
    });
  }

  return (
    <div className="flex flex-col">
      {/* Filters */}
      <div
        className="sticky top-0 z-10 w-full flex items-center justify-between bg-teal-50 dark:bg-teal-950 gap-2 bg-background py-4"
        id="filters"
      >
        <div className="relative flex w-full items-center pl-3">
          <SearchIcon className="absolute left-6 h-4 w-4 text-gray-700"/>
          <Input
            className="px-9 text-base bg-white dark:bg-gray-250 text-gray-700"
            placeholder="El que busca encuentra..."
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          {Boolean(query) && (
            <X
              className="absolute right-4 h-4 w-4 cursor-pointer text-gray-700"
              onClick={() => setQuery("")}
            />
          )}
        </div>
        <div className="flex gap-2 pr-2">
          <Toggle
            aria-label="Vista de lista"
            pressed={layout === "list"}
            onClick={() => setLayout("list")}
          >
            <div className="text-2xl">
              <StretchHorizontal className="h-6 w-6 cursor-pointer opacity-40" />
            </div>
          </Toggle>
          <Toggle
            aria-label="Vista de grilla"
            pressed={layout === "grid"}
            onClick={() => setLayout("grid")}
          >
            <div className="text-2xl">
              <Table className="h-6 w-6 cursor-pointer opacity-40" />
            </div>
          </Toggle>
        </div>
      </div>
      {/* Grid of products by category */}
      <div className="flex flex-col">
        {categories.length ? (
          categories.map(([category, categoryProducts]) => (
            <div key={category} className="flex flex-col gap-4 border-t py-4" id={category}>
              <div
                className={cn("flex items-center justify-between gap-4 px-4", {
                  "cursor-pointer": layout === "list",
                })}
                onClick={() => handleSelectCategory(category)}
              >
                <h2 className="text-xl font-medium sm:text-2xl">
                  {category} <span className="opacity-70">({categoryProducts.length})</span>
                </h2>
                {layout === "list" && <ChevronDown className="h-6 w-6 opacity-40" />}
              </div>
              {((layout === "list" && selectedCategory === category) || layout === "grid") && (
                <div className="grid gap-2 sm:gap-4 grid-flow-col items-start auto-cols-[minmax(0,220)] overflow-x-auto overflow-y-hidden pb-2 px-4">
                  {categoryProducts.length ? (
                    categoryProducts.map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        onAdd={(item: Product) => addItem(Date.now(), {...item, quantity: 1})}
                      />
                    ))
                  ) : (
                    <div className="my-12 flex flex-col gap-4">
                      <h2 className="text-center text-xl text-muted-foreground">
                        No hay productos
                      </h2>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="my-12 flex flex-col gap-4">
            <h2 className="text-center text-xl text-muted-foreground">No hay productos</h2>
          </div>
        )}
      </div>
    </div>
  );
}

export default StoreScreen;

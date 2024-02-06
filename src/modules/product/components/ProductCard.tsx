"use client";

import type {CartItem} from "~/cart/types";

import type {Product} from "../types";

import {useState, useMemo} from "react";
import {ImageOff} from "lucide-react";

import CartItemDrawer from "~/cart/components/CartItemDrawer";
import {parseCurrency} from "~/currency/utils";

function ProductCard({product, onAdd}: {product: Product; onAdd: (product: Product) => void}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const cartItem = useMemo<CartItem>(() => ({...product, quantity: 1}), [product]);


  return (
    <>
      <div
        key={product.id}
        className="flex-col items-end border-white/300 flex cursor-pointer relative justify-between rounded-md border p-1 sm:p-2 pb-2 bg-gray-50 dark:bg-gray-800"
        data-testid="product"
        onClick={() => setIsModalOpen(true)}
      >
        <div className="flex-end flex-col space-between relative">
          {product.image ? (
            <img
              alt={product.title}
              className="min-w-36 sm:min-h-48 sm:min-w-48 aspect-square w-full rounded-md bg-muted/50 object-cover sm:h-36 sm:w-36"
              loading="lazy"
              src={product.image}
            />
          ) : (
            <div className="min-w-24 sm:min-w-36 flex aspect-square h-24 w-24 items-center justify-center rounded-md bg-muted/50 object-cover sm:h-36 sm:w-36">
              <ImageOff className="m-auto h-12 w-12 opacity-10 sm:h-16 sm:w-16" />
            </div>
          )}
          <div className="flex flex-col justify-between gap-1">
            <div className="flex flex-col gap-1 pt-1">
              <p className="text-sm font-medium leading-4 font-sans tracking-tight">{(product.title)}</p>
            </div>
            <div className="flex items-end">
              <p className="text-lg font-medium text-incentive leading-4">{parseCurrency(product.price)}</p>
            </div>
          </div>
        </div>
      </div>
      {isModalOpen ? (
        <CartItemDrawer
          open
          item={cartItem}
          onClose={() => setIsModalOpen(false)}
          onSubmit={(item: CartItem) => {
            onAdd(item);
            setIsModalOpen(false);
          }}
        />
      ) : null}
    </>
  );
}

export default ProductCard;

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
        className="flex-col items-end border-white/300 flex cursor-pointer relative justify-between rounded-md border"
        data-testid="product"
        onClick={() => setIsModalOpen(true)}
      >
        <div className="flex gap-4 p-4">
          <div className="flex flex-col justify-between gap-1">
            <div className="flex flex-col gap-1">
              <p className="line-clamp-[1] font-medium sm:line-clamp-[2]">{product.title}</p>
              <p className="line-clamp-[2] text-sm text-muted-foreground sm:line-clamp-3">
                {product.description}
              </p>
            </div>
            <div className="flex items-end">
              <p className="text-sm font-medium text-incentive">{parseCurrency(product.price)}</p>
            </div>
          </div>
          {product.image ? (
            <img
              fadeIn
              alt={product.title}
              className="min-w-24 sm:min-w-36 aspect-square h-24 w-24 rounded-md bg-muted/50 object-cover sm:h-36 sm:w-36"
              loading="lazy"
              src={product.image}
            />
          ) : (
            <div className="min-w-24 sm:min-w-36 flex aspect-square h-24 w-24 items-center justify-center rounded-md bg-muted/50 object-cover sm:h-36 sm:w-36">
              <ImageOff className="m-auto h-12 w-12 opacity-10 sm:h-16 sm:w-16" />
            </div>
          )}
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

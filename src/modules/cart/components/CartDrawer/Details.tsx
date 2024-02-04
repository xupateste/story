import type {Cart, CartItem} from "../../types";

import {Button} from "~/ui/components/control/button";
import {parseCurrency} from "~/currency/utils";

import {getCartItemPrice, getCartItemOptionsSummary} from "../../utils";

function Details({cart, onChange}: {cart: Cart; onChange: (id: number, item: CartItem) => void}) {
  return (
    <div className="flex flex-col gap-4">
      {Array.from(cart.entries()).map(([id, item]) => (
        <div key={id.toString()} className="flex gap-2" data-testid={`cart-item-${item.id}`}>
          <div className="flex w-full flex-col gap-1">
            <div className="flex items-start justify-between gap-4">
              <div className="flex flex-col">
                <p className="text-lg font-medium">{item.title}</p>
                {Boolean(item.options) && (
                  <p className="text-muted-foreground">{getCartItemOptionsSummary(item.options)}</p>
                )}
              </div>
              <p className="font-medium leading-[1.9rem]">
                {parseCurrency(getCartItemPrice(item))}
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                className="text-md h-6 w-6 rounded-full"
                data-testid="decrement"
                size="xs"
                variant="brand"
                onClick={() => onChange(id, {...item, quantity: item.quantity - 1})}
              >
                {" "}
                -{" "}
              </Button>
              <p className="min-w-[24px] text-center font-medium" data-testid="quantity">
                {item.quantity}
              </p>
              <Button
                className="text-md h-6 w-6 rounded-full"
                data-testid="increment"
                size="xs"
                variant="brand"
                onClick={() => onChange(id, {...item, quantity: item.quantity + 1})}
              >
                {" "}
                +{" "}
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Details;

import { useMemo, useCallback } from 'react';
import { useSelector } from 'react-redux';

export const useCart = () => {
  const cartItems = useSelector((state) => state.cart.items);
  const products = useSelector((state) => state.products.items);

  const getAvailableStock = useCallback((productId) => 
    products.find(p => p.id === productId)?.quantity ?? 0,
    [products]
  );

  const isQuantityExceedsStock = useCallback((item) => 
    item.quantity > getAvailableStock(item.id),
    [getAvailableStock]
  );

  const total = useMemo(() => 
    cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
    [cartItems]
  );

  const hasInvalidItems = useMemo(() => 
    cartItems.some(isQuantityExceedsStock),
    [cartItems, isQuantityExceedsStock]
  );

  return {
    cartItems,
    getAvailableStock,
    isQuantityExceedsStock,
    total,
    hasInvalidItems
  };
};
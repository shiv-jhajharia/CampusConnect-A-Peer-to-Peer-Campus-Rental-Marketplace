import React from "react";
import ProductCard from "./ProductCard";

export default function ProductList({ products, isOwner = false, onDelete, onEdit, onChat, emptyMessage, emptyIcon = "📦", onEmptyAction, emptyActionText }) {
  if (!products || products.length === 0) {
    return (
      <div className="py-24 text-center glass rounded-3xl border-2 border-dashed border-slate-300 w-full">
         <div className="text-5xl mb-4 opacity-50">{emptyIcon}</div>
         <h3 className="text-2xl font-bold text-slate-700 mb-2">No Items Found</h3>
         <p className="text-slate-500 max-w-md mx-auto mb-6">{emptyMessage || "There are no products to display right now."}</p>
         
         {onEmptyAction && (
           <button 
             onClick={onEmptyAction} 
             className="py-3 px-8 bg-slate-900 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:bg-slate-800 transition-all"
           >
             {emptyActionText || "Take Action"}
           </button>
         )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6 md:gap-8 w-full">
      {products.map((product) => (
        <React.Fragment key={product.id || product._id}>
          <ProductCard 
            product={product} 
            isOwner={isOwner} 
            onDelete={onDelete} 
            onEdit={onEdit} 
            onChat={onChat} 
          />
        </React.Fragment>
      ))}
    </div>
  );
}
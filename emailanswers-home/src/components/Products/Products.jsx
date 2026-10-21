import "./product.css";
import ProductShowcase from "./ProductShowcase";
import ProtectList from "./ProtectList";

// The whole Product part of the page: interactive showcase + the Protect list.
export default function Product() {
  return (
    <>
      <ProductShowcase />
      <ProtectList />
    </>
  );
}

export { default as ProductMenu } from "./ProductMenu";

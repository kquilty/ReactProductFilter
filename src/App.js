import { useState } from "react";

const PRODUCTS = [
    {category: "Fruits", price: "$1", stocked: true, name: "Apple"},
    {category: "Fruits", price: "$1", stocked: true, name: "Dragonfruit"},
    {category: "Fruits", price: "$2", stocked: false, name: "Passionfruit"},
    {category: "Vegetables", price: "$2", stocked: true, name: "Spinach"},
    {category: "Vegetables", price: "$4", stocked: false, name: "Pumpkin"},
    {category: "Vegetables", price: "$1", stocked: true, name: "Peas"}
];

export default function App() {
    
    return (
        <FilterableProductTable products={PRODUCTS} />
    );
}

function FilterableProductTable({products}) {
    const [searchText, setSearchText] = useState("");
    const [inStockOnly, setInStockOnly] = useState(false);

    return (
        <>
            <SearchBar 
                searchText={searchText}  
                inStockOnly={inStockOnly}
                onSearchTextChange={setSearchText}
                onInStockOnlyChange={setInStockOnly}
            />
            <ProductTable 
                products={products}
                searchText={searchText}
                inStockOnly={inStockOnly} 
            />
        </>
    );
}

function SearchBar({ searchText, inStockOnly, onSearchTextChange, onInStockOnlyChange }) {
    return (
        <div className="search-bar">
            <input 
                type="text" 
                placeholder="Filter by..." 
                value={searchText}
                onChange={(e) => onSearchTextChange(e.target.value)}
            />
            <input 
                type="checkbox" 
                checked={inStockOnly}
                onChange={(e) => onInStockOnlyChange(e.target.checked)}
            />
            <label>Only show products in stock</label>
        </div>
    );
}

function ProductTable({ products, searchText, inStockOnly }) {
    let rows = [];
    let lastCategory = null;

    
    products.forEach((product) => {


        // Show the category if it has changed
        if (product.category !== lastCategory) {
            rows.push(
                <ProductCategoryRow 
                    categoryName={product.category} 
                    key={product.category} />
            );
            lastCategory = product.category;
        }

        // Filter by search text
        if (product.name.toLowerCase().indexOf(searchText.toLowerCase()) === -1) {
            // If the product name does not contain the search text, skip it
            return;
        }

        if (inStockOnly && !product.stocked) {
            // If the product is not stocked, skip it
            return;
        }

        // Show the product
        rows.push(
        <ProductRow 
            key={product.name} 
            product={product}
            searchText={searchText} />
        );
    });

    return (
        <table className="product-table">
            <tr>
                <td>
                    Name
                </td>
                <td>
                    Price
                </td>
            </tr>
            {rows}
        </table>
    );
}

function ProductCategoryRow({ categoryName }) {
    return (
        <tr>
            <th colSpan="2">
                {categoryName}
            </th>
        </tr>
    );
}
function ProductRow({product, searchText}) {

    // No highlighting by default
    let highlightedName = product.name;

    // If there's anything to highlight...
    if(searchText.length > 0
        && product.name.toLowerCase().indexOf(searchText.toLowerCase()) !== -1
    ){
        // Highlight it
        const indexStart = highlightedName.toLowerCase().indexOf(searchText.toLowerCase());
        highlightedName = (
            <div>
                {highlightedName.substring(0, indexStart)} 
                <span className="highlighted-text">
                    {highlightedName.substring(indexStart, indexStart + searchText.length)}
                </span>
                {highlightedName.substring(indexStart + searchText.length)}
            </div>
        );
    }

    return (
        <tr>
            <td style={{color: product.stocked ? 'black' : 'red'}}>
                {highlightedName}
            </td>   
            <td>
                {product.price}
            </td>
        </tr>
    );
}
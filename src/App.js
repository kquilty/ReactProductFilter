import { useState } from "react";



export default function App() {
    const [products, setProducts] = useState([
        {id:1, category: "Fruits", price: "$1", stocked: true, name: "Apple"},
        {id:2, category: "Fruits", price: "$1", stocked: true, name: "Dragonfruit"},
        {id:3, category: "Fruits", price: "$2", stocked: false, name: "Passionfruit"},
        {id:4, category: "Vegetables", price: "$2", stocked: true, name: "Spinach"},
        {id:5, category: "Vegetables", price: "$4", stocked: false, name: "Pumpkin"},
        {id:6, category: "Vegetables", price: "$1", stocked: true, name: "Peas"}
    ]);

    const handleDeleteProduct = (productId) => {
        if (!window.confirm("Delete this product?")) {
            return;
        }
        let newProducts = products.filter(product => product.id !== productId);
        setProducts(newProducts);
    };

    return (
        <FilterableProductTable products={products} onProductDelete={handleDeleteProduct} />
    );
}

function FilterableProductTable({products, onProductDelete}) {
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
                onProductDelete={onProductDelete}
            />
        </>
    );
}

function SearchBar({ searchText, inStockOnly, onSearchTextChange, onInStockOnlyChange }) {
    return (
        <div>
            <input 
                type="text" 
                placeholder="Search..." 
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

function ProductTable({ products, searchText, inStockOnly, onProductDelete }) {
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
            key={product.id} 
            product={product}
            onProductDelete={onProductDelete} />
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
                <td>
                    (admin)
                </td>
            </tr>
            {rows}
        </table>
    );
}

function ProductCategoryRow({ categoryName }) {
    return (
        <tr>
            <th colSpan="3">
                {categoryName}
            </th>
        </tr>
    );
}
function ProductRow({product, onProductDelete}) {
    return (
        <tr>
            <td style={{color: product.stocked ? 'black' : 'red'}}>
                {product.name}
            </td>   
            <td>
                {product.price}
            </td>
            <td>
                <button onClick={() => onProductDelete(product.id)}>Delete</button>
            </td>
        </tr>
    );
}
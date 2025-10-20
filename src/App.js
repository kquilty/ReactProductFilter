import { useState, useEffect } from "react";



export default function App() {
    const [products, setProducts] = useState([]);
    const [isLoadingProducts, setIsLoadingProducts] = useState(true);//<-- start as loading (since we'll be firing this off right away)

    const handleDeleteProduct = (productId) => {
        if (!window.confirm("Delete this product?")) {
            return;
        }
        let newProducts = products.filter(product => product.id !== productId);
        setProducts(newProducts);
    };

    const fetchProductsFromServer = () => {
        console.log("Fetching products from server...");
        setIsLoadingProducts(true);
        fetch("http://localhost:8000/products")
        .then(response => {

            // Simulate network delay
            ///*
                return new Promise((resolve, reject) => {
                    setTimeout(() => {
                        response.json().then(resolve).catch(reject);
                    }, 1000);
                });
            //*/

            //return response.json();

        })
        .then((data) => {
            console.log("Products fetched: " + data.length);
            setProducts(data);
            setIsLoadingProducts(false);
        })
        .catch(error => {
            console.error("Error fetching products:", error);
            setIsLoadingProducts(false);
        });
    }

    // On page load, fetch products from the server
    useEffect(() => {
        fetchProductsFromServer();
    }, []); // <--- [] means run only once on component mount


    return (
        <>
            <FilterableProductTable 
                products={products} 
                onProductDelete={handleDeleteProduct} 
                isLoadingProducts={isLoadingProducts} />

            { !isLoadingProducts && 
                <>
                    <br /><br />
                    <button onClick={() => fetchProductsFromServer()}>Reload List</button>
                </>
            }
        </>
    );
}

function FilterableProductTable({products, onProductDelete, isLoadingProducts}) {
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
            { isLoadingProducts 
                ?
                    <div>Loading products...</div>
                :
                    <>
                        <ProductTable 
                            products={products}
                            searchText={searchText}
                            inStockOnly={inStockOnly} 
                            onProductDelete={onProductDelete}
                        />
                    </>
            }
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

function ProductTable({ products, searchText, inStockOnly, onProductDelete }) {
    let rows = [];
    let lastCategory = null;
    let totalRowsInCategory = 0;

    if ( typeof products === "undefined" || products.length === 0) {
        return <div>No products available.</div>;
    }

    products.forEach((product) => {


        // Show the category if it has changed
        if (product.category !== lastCategory) {

            // If no rows were added for the last category, remove it
            if (lastCategory !== null && totalRowsInCategory === 0) {
                rows.pop();
            }
            
            rows.push(
                <ProductCategoryRow 
                    categoryName={product.category} 
                    key={product.category} />
            );
            
            lastCategory = product.category;
            totalRowsInCategory = 0;
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
            searchText={searchText}
            onProductDelete={onProductDelete} />
        );

        totalRowsInCategory++;
    });

    // If no rows were added for the last category, remove it
    if (lastCategory !== null && totalRowsInCategory === 0) {
        rows.pop();
    }

    return (
        <table className="product-table">
            <thead>
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
            </thead>
            <tbody>
                {rows}
            </tbody>
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

function ProductRow({product, searchText, onProductDelete}) {

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
            <td>
                <button onClick={() => onProductDelete(product.id)}>Delete</button>
            </td>
        </tr>
    );
}
import './App.css'
import PersonForm from "./components/PersonForm.tsx";
import type { Person } from "./types/person.ts";
import PersonCard from "./components/PersonCard.tsx";
import ProductForm from "./components/ProductForm.tsx";
import ProductCard from "./components/ProductCard.tsx";
import type { Product } from "./types/product.ts";
import { useEffect, useState } from "react";
import AddPeople from "./components/AddPeople.tsx";
import BillSplit from "./components/BillSplit.tsx";
import type { PersonProduct } from "./types/personProduct.ts";
import {
    loadPersons,
    loadProducts,
    loadPersonProducts,
    removePerson,
    removeProduct
} from "./utils/utils.ts";

function App() {

    const [selectedProductId, setSelectedProductId] =
        useState<number | null>(null);

    const [persons, setPersons] = useState<Person[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [personProducts, setPersonProducts] =
        useState<PersonProduct[]>([]);

    useEffect(() => {
        setPersons(loadPersons());
        setProducts(loadProducts());
        setPersonProducts(loadPersonProducts());
    }, []);

    function handleRemovePerson(personId: number) {
        const relations = removePerson(personId);

        setPersons(loadPersons());
        setPersonProducts(relations);
    }

    function handleRemoveProduct(productId: number) {
        const relations = removeProduct(productId);

        setProducts(loadProducts());
        setPersonProducts(relations);
    }

    return (
        <div className="app-container">
            <header className="app-header">
                <h1>Divisor de Conta</h1>
            </header>

            <div className="app-grid">
                <section className="panel">
                    <h2>Pessoas</h2>

                    <PersonForm
                        onPersonCreated={() => {
                            setPersons(loadPersons());
                        }}
                    />

                    <div className="card-list">
                        {persons.map((person) => (
                            <PersonCard
                                key={person.id}
                                id={person.id}
                                name={person.name}
                                products={products}
                                personProducts={personProducts}
                                onRemove={handleRemovePerson}
                            />
                        ))}
                    </div>
                </section>

                <section className="panel">
                    <h2>Produtos</h2>

                    <ProductForm
                        onProductCreated={() => {
                            setProducts(loadProducts());
                        }}
                    />

                    <div className="card-list">
                        {products.map((product) => (
                            <ProductCard
                                key={product.id}
                                id={product.id}
                                name={product.name}
                                price={product.price}
                                persons={persons}
                                personsProducts={personProducts}
                                onAddPeople={() => {
                                    setSelectedProductId(product.id);
                                }}
                                onRemove={handleRemoveProduct}
                            />
                        ))}
                    </div>
                </section>
            </div>

            {selectedProductId !== null && (
                <AddPeople
                    productId={selectedProductId}
                    persons={persons}
                    personProducts={personProducts}
                    onClose={() => setSelectedProductId(null)}
                    onRelationsChanged={() => {
                        setPersonProducts(loadPersonProducts());
                    }}
                />
            )}

            <section className="panel">
                <BillSplit
                    persons={persons}
                    products={products}
                    personProducts={personProducts}
                />
            </section>
        </div>
    );
}

export default App;
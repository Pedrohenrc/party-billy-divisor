import './App.css'
import PersonForm from "./components/PersonForm.tsx";
import type {Person} from "./types/person.ts";
import {getAllByPrefix} from "./utils/utils.ts";
import PersonCard from "./components/PersonCard.tsx";
import ProductForm  from "./components/ProductForm.tsx";
import ProductCard from "./components/ProductCard.tsx";
import type {Product} from "./types/product.ts";

function App() {

    const persons: Person[] = getAllByPrefix('person')
    const products: Product[] = getAllByPrefix('product')

    return (
        <>

            <PersonForm/>
            {persons.map((person: Person) => (
                <PersonCard name={person.name} />
            ))}

            <ProductForm/>
            {products.map((product: Product) => (
                <ProductCard name={product.name} price={product.price} />
            ))}
        </>
    )

}

export default App

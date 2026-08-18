export function getNextId(prefix: string): number {
    const keys = Object.keys(localStorage).filter(key => {
        const id = key.replace(prefix, "");
        return key.startsWith(prefix) && !isNaN(Number(id));
    });

    let maxId = 0;

    for (const key of keys) {
        const id = Number(key.replace(prefix, ""));

        if (id > maxId) {
            maxId = id;
        }
    }

    return maxId + 1;
}

export function getAllByPrefix<T>(prefix: string): T[] {
    const list: T[] = [];

    for (const key of Object.keys(localStorage)) {
        const id = key.replace(prefix, "");

        if (!key.startsWith(prefix) || isNaN(Number(id))) {
            continue;
        }

        const item = localStorage.getItem(key);

        if (item) {
            list.push(JSON.parse(item) as T);
        }
    }

    return list;
}

import type { Person } from "../types/person.ts";
import type { Product } from "../types/product.ts";
import type { PersonProduct } from "../types/personProduct.ts";

export function loadPersons(): Person[] {
    return getAllByPrefix<Person>("person");
}

export function loadProducts(): Product[] {
    return getAllByPrefix<Product>("product");
}

export function loadPersonProducts(): PersonProduct[] {
    return JSON.parse(
        localStorage.getItem("personProducts") || "[]"
    );
}

export function removePerson(personId: number): PersonProduct[] {
    localStorage.removeItem(`person${personId}`);

    const relations = loadPersonProducts();

    const updatedRelations = relations.filter(
        relation => relation.personId !== personId
    );

    localStorage.setItem(
        "personProducts",
        JSON.stringify(updatedRelations)
    );

    return updatedRelations;
}

export function removeProduct(productId: number): PersonProduct[] {
    localStorage.removeItem(`product${productId}`);

    const relations = loadPersonProducts();

    const updatedRelations = relations.filter(
        relation => relation.productId !== productId
    );

    localStorage.setItem(
        "personProducts",
        JSON.stringify(updatedRelations)
    );

    return updatedRelations;
}
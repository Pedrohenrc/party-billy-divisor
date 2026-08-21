import type { Person } from "../types/person.ts";
import type { Product } from "../types/product.ts";
import type { PersonProduct } from "../types/personProduct.ts";
import type { PersonSplit, PersonSplitItem, SplitResult } from "../types/split.ts";

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

function roundMoney(value: number): number {
    return Math.round(value * 100) / 100;
}

export function calculateBillSplit(
    persons: Person[],
    products: Product[],
    personProducts: PersonProduct[]
): SplitResult {

    const missingProducts = products
        .filter((product) =>
            !personProducts.some((relation) => relation.productId === product.id)
        )
        .map((product) => product.name);

    if (missingProducts.length > 0) {
        return {
            success: false,
            missingProducts,
        };
    }

    const splits: PersonSplit[] = persons.map((person) => {
        const items: PersonSplitItem[] = products
            .filter((product) =>
                personProducts.some((relation) =>
                    relation.productId === product.id && relation.personId === person.id
                )
            )
            .map((product) => {
                const participantsCount = personProducts.filter(
                    (relation) => relation.productId === product.id
                ).length;

                return {
                    productId: product.id,
                    productName: product.name,
                    productPrice: product.price,
                    participantsCount,
                    shareValue: roundMoney(product.price / participantsCount),
                };
            });

        const total = roundMoney(
            items.reduce((sum, item) => sum + item.shareValue, 0)
        );

        return {
            personId: person.id,
            personName: person.name,
            items,
            total,
        };
    });

    const totalBill = roundMoney(
        splits.reduce((sum, split) => sum + split.total, 0)
    );

    return {
        success: true,
        splits,
        totalBill,
    };
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
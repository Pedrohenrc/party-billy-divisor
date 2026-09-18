import type { Person } from './person.ts';
import type { Product } from './product.ts';
import type { PersonProduct } from './personProduct.ts';

/**
 * Rascunho local de uma conta, antes de ser salva na API.
 * Fica no localStorage para não se perder ao recarregar a página.
 */
export interface BillDraft {
    title: string;
    persons: Person[];
    products: Product[];
    relations: PersonProduct[];
}

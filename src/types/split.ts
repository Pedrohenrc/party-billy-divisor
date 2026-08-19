export interface PersonSplitItem {
    productId: number;
    productName: string;
    productPrice: number;
    participantsCount: number;
    shareValue: number;
}

export interface PersonSplit {
    personId: number;
    personName: string;
    items: PersonSplitItem[];
    total: number;
}

export interface SplitSuccess {
    success: true;
    splits: PersonSplit[];
    totalBill: number;
}

export interface SplitError {
    success: false;
    missingProducts: string[];
}

export type SplitResult = SplitSuccess | SplitError;

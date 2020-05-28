export class MortgageInfo {
    startDate: Date = new Date();
    loanAmount: number = 0;
    term: number = 0;
    housePrice: number = 0;
    rate: number = 0;
    period: 'monthly' | 'biweekly' = 'monthly';
}

let nextId = 0;

export class EventDefinition {
    id = ++nextId;
    name: string = '';
    amount: number = 0;
    startDate: Date = new Date;
    endDate: Date | null = null;
    period: 'once' | 'months' | 'weeks' = 'months';
    /** Number of `period`s between events. */
    periodCount: number = 1;
}

export interface Transaction {
    date: Date;
    name: string;
    amount: number;
}
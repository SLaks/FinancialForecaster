export class MortgageInfo {
    loanAmount: number = 0;
    term: number = 0;
    downPayment: number = 0;
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
    period: 'months' | 'weeks' = 'months';
    /** Number of `period`s between events. */
    periodCount: number = 1;
    /** Day in the `period` that the event happens. */
    periodSubIndex: number = 0;
}

export interface Transaction {
    date: Date;
    name: string;
    amount: number;
}
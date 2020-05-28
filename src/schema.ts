export class BankInfo {
    asOfDate: Date = new Date();

    /** Balance, as of `asOf`, of account used for expenses. */
    checkingBalance = 1000;
    /** APR for checking account, in percentage points (0-100). */
    checkingGrowthRate = .1;

    /** Desired balance of checking account.  Excess funds are transferred to savings monthly. */
    checkingTarget = 1000;

    /** Balance, as of `asOf`, of account that only grows. */
    savingsBalance = 10000;
    /** APR for savings account, in percentage points (0-100). */
    savingsGrowthRate = 6;
}

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
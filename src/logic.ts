import { MortgageInfo, Transaction, EventDefinition, BankRecord, BankInfo } from './schema';
import { addMonths, startOfMonth, differenceInCalendarDays, addWeeks, add, addDays, startOfDay, endOfDay, subBusinessDays } from 'date-fns'
import { findLast } from 'lodash';
export function generateMortgage(loan: MortgageInfo): Transaction[] {
    if (!loan.loanAmount) return [];
    let monthlyRate = loan.rate / 12 / 100;
    const basePaymentCount = loan.term * 12;
    let paymentAmount =
        loan.loanAmount
        * monthlyRate * ((monthlyRate + 1) ** basePaymentCount)
        / ((monthlyRate + 1) ** basePaymentCount - 1);

    const result: Transaction[] = [];

    // Beginning of period ending with first payment.
    let paymentDate = addMonths(startOfMonth(loan.startDate), 1);

    result.push({
        date: loan.startDate,
        name: 'Mortgage: Down payment',
        amount: - (loan.housePrice - loan.loanAmount),
    });
    result.push({
        date: loan.startDate,
        name: 'Mortgage: Closing Fee Interest',
        amount: - loan.loanAmount * monthlyRate / 30
            * differenceInCalendarDays(paymentDate, loan.startDate),
    });

    let remainingPrinciple = loan.loanAmount;
    switch (loan.period) {
        case 'monthly':
            while (remainingPrinciple > 0) {
                paymentDate = addMonths(paymentDate, 1);
                addNormalPayment();
            }
            break;

        case 'biweekly':
            monthlyRate /= 2;
            paymentAmount /= 2;
            for (let i = 0; remainingPrinciple > 0 && i < loan.term * 26; i++) {
                paymentDate = addWeeks(paymentDate, 2);
                if (i % 26 < 24) {
                    addNormalPayment();
                }
                else {
                    remainingPrinciple -= paymentAmount;
                    result.push({
                        date: paymentDate,
                        name: 'Mortgage: Extra payment',
                        amount: -paymentAmount,
                    });
                }
            }
            break;
    }
    return result;

    function addNormalPayment() {
        const interestPaid = remainingPrinciple * monthlyRate;
        const principalPaid = paymentAmount - interestPaid;
        remainingPrinciple -= principalPaid;
        result.push({
            date: paymentDate,
            name: 'Mortgage: Payment',
            amount: -paymentAmount,
        });

        if (result.length > 10000) throw new Error('Too big!!!');
    }
}

export function generateEventTransactions(def: EventDefinition, endDate: Date): Transaction[] {
    if (!def.name || !def.amount) return [];

    const transactions: Transaction[] = [];
    for (let curDate = def.startDate; curDate < (def.endDate ?? endDate);) {
        transactions.push({
            name: def.name,
            amount: def.amount,
            date: curDate,
        });

        if (transactions.length > 10000) throw new Error('Too big!!!');

        if (def.period === 'once') break;
        curDate = add(curDate, { [def.period]: def.periodCount });
    }

    return transactions;
}

export function generateBankRecords(bankInfo: BankInfo, endDate: Date, transactions: Transaction[]): BankRecord[] {
    const nextRecord: BankRecord = {
        date: startOfDay(bankInfo.asOfDate),
        checkingBalance: bankInfo.checkingBalance,
        savingsBalance: bankInfo.savingsBalance
    };
    let transactionIndex = transactions.findIndex(t => t.date >= nextRecord.date);
    if (transactionIndex < 0) return [];

    const lastBigExpenseDate = findLast(transactions, t => t.amount <= -bankInfo.checkingTarget / 2)?.date;

    const checkingRate = 1 + bankInfo.checkingGrowthRate / 100 / 12
    const savingsRate = 1 + bankInfo.savingsGrowthRate / 100 / 12

    const records: BankRecord[] = [];
    for (; nextRecord.date <= endDate; nextRecord.date = addDays(nextRecord.date, 1)) {
        for (; transactionIndex < transactions.length && transactions[transactionIndex].date <= endOfDay(nextRecord.date); transactionIndex++) {
            let delta = transactions[transactionIndex].amount;
            nextRecord.checkingBalance += delta;
            if (nextRecord.checkingBalance < 0) {
                nextRecord.savingsBalance += nextRecord.checkingBalance;
                nextRecord.checkingBalance = 0;
            }
        }

        if (transactionIndex >= transactions.length) break;

        if (+nextRecord.date === +subBusinessDays(addMonths(startOfMonth(nextRecord.date), 1), 1)) {
            nextRecord.checkingBalance *= checkingRate;
            nextRecord.savingsBalance *= savingsRate;

            if (!lastBigExpenseDate || nextRecord.date > lastBigExpenseDate) {
                nextRecord.savingsBalance += nextRecord.checkingBalance - bankInfo.checkingTarget;
                nextRecord.checkingBalance = bankInfo.checkingTarget;
            }
        }

        records.push({ ...nextRecord });
    }
    return records;
}
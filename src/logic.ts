import { MortgageInfo, Transaction, EventDefinition } from './schema';
import { addMonths, startOfMonth, differenceInCalendarDays, addWeeks, add } from 'date-fns'
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
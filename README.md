# FinancialForecaster

FinancialForecaster is a simple tool for financial forecasting. You can input a mortgage, general income / expenses (one-time or recurring), and checking / savings account details / rates, and it will forecast growth over time.

Note: This forecaster (currently) does not model enough details (eg, income tax) to give precise forecasts, and should only be relied on for general rates.

## Usage

The forecaster assumes that all income & expenses are draw from the checking account. Every month, it will transfer any excess balance from checking to savings. If the checking account runs dry, it will withdraw expenses from savings.

It requires the following inputs:

1.  Bank account info
    - Enter the current balances (as of the start date) and growth rate for each account.
    - Enter the target balance for the checking account. If it grows beyond this amount (and there aren't larger upcoming expenses), excess funds will be transferred to savings monthly.
    - All transactions before the start date will be ignored. Therefore, you can update the start date & current balances as time passes to correct for errors in the forecast.
2.  Mortgage
    - If there is a mortgage, enter its details here. It will be automatically tracked from the checking account.
    - If there is no mortgage, enter `0` as the house price.
3.  Payments/income
    - Enter all one-time or recurring transactions for the checking account.
    - Enter income as positive numbers and expenses as negative.
    - Click the recur column to set transactions to recur every _X_ weeks or months.

All inputs are saved in the URL as you type, so you can clone the browser tab to compare different forecasts.

As you enter data, it will display a table of monthly transactions and a graph of balances & expenses over time.

## Upcoming features

I may or may not implement these:

- Unit tests
- Define custom accounts
- Better transaction entry on mobile
- Allow expenses from other accounts
- Model retirement funds / income tax
- Allow multiple mortgages
- Save / load data from localStorage
- Save / load data from Google Sheets
- Add presets for the expenses table
- Emoji dropdown for expense names

# FinancialForecaster ![logo](https://financial-forecaster.slaks.net/favicon-32x32.png)

FinancialForecaster is a simple tool for financial forecasting. You can input a mortgage, general income / expenses (one-time or recurring), and checking / savings account details / rates, and it will forecast growth over time.

Note: This forecaster (currently) does not model enough details (eg, income tax) to give precise forecasts, and should only be relied on for general rates.

## [▶ &nbsp; Run](https://financial-forecaster.slaks.net/)

You will need to enter your own financial data (don't worry; this app never talks to any servers).

For a quick demo, try some [sample data].


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


[sample data]:https://financial-forecaster.slaks.net/#{%22bankInfo%22:{%22asOfDate%22:%222020-06-30T04:00:00.000Z%22,%22checkingBalance%22:1000,%22checkingGrowthRate%22:0.1,%22checkingTarget%22:5000,%22savingsBalance%22:10000,%22savingsGrowthRate%22:2},%22mortgageInfo%22:{%22startDate%22:%222020-06-15T00:00:34.841Z%22,%22loanAmount%22:160000,%22term%22:30,%22housePrice%22:200000,%22rate%22:5,%22period%22:%22monthly%22},%22events%22:[{%22id%22:1,%22name%22:%22Paycheck%22,%22amount%22:1500,%22startDate%22:%222020-06-12T04:00:00.000Z%22,%22endDate%22:null,%22period%22:%22weeks%22,%22periodCount%22:2},{%22id%22:2,%22name%22:%22Bills%22,%22amount%22:-200,%22startDate%22:%222020-06-01T04:00:00.000Z%22,%22endDate%22:null,%22period%22:%22months%22,%22periodCount%22:1},{%22id%22:3,%22name%22:%22Grocceries%22,%22amount%22:-50,%22startDate%22:%222020-06-15T00:14:12.574Z%22,%22endDate%22:null,%22period%22:%22weeks%22,%22periodCount%22:2},{%22id%22:4,%22name%22:%22Super%20fun%20stuff!%22,%22amount%22:-100,%22startDate%22:%222020-06-15T00:14:25.809Z%22,%22endDate%22:null,%22period%22:%22months%22,%22periodCount%22:2},{%22id%22:5,%22name%22:%22New%20pool%22,%22amount%22:-2000,%22startDate%22:%222020-08-10T04:00:00.000Z%22,%22endDate%22:null,%22period%22:%22once%22,%22periodCount%22:1},{%22id%22:6,%22name%22:%22Taxes%22,%22amount%22:-2000,%22startDate%22:%222020-04-15T04:00:00.000Z%22,%22endDate%22:null,%22period%22:%22months%22,%22periodCount%22:12}],%22settingsTab%22:2,%22isDark%22:false}
# Expense Tracker – Personal Finance Manager

A responsive browser-based application for recording income and expenses, categorizing transactions, calculating the current balance, and viewing an expense breakdown.

## Features
- Add income and expense transactions
- Choose a category and transaction date
- Automatically calculate total income, total expenses, and balance
- Search transactions and filter by type
- Delete individual transactions or clear all data
- View expense totals by category in a doughnut chart
- Responsive layout for desktop, tablet, and mobile
- Save data in browser `localStorage`

## Tech Stack
- HTML5
- CSS3
- JavaScript (Vanilla)
- Chart.js (loaded from jsDelivr CDN)

## Project Structure
```text
expense-tracker/
├── index.html
├── README.md
├── LICENSE
├── .gitignore
├── css/
│   └── style.css
├── js/
│   └── app.js
└── assets/
    └── README.md
```

## Run Locally
1. Download or clone this repository:
   ```bash
   git clone https://github.com/YOUR-USERNAME/expense-tracker.git
   ```
2. Open the `expense-tracker` folder.
3. Open `index.html` in a modern web browser.

No build step or package installation is required. An internet connection is needed to load Chart.js from its CDN; the rest of the application runs locally in the browser.

You can also use the VS Code **Live Server** extension and open `index.html` with Live Server.

## Data and Privacy
Transactions are stored in the browser's `localStorage` on the device and browser being used. They are not uploaded to a server or synchronized between devices. Clearing browser storage may delete saved transactions. Do not use this demo as a replacement for secure accounting or banking software.

## Deployment with GitHub Pages
1. Push the project files to a public GitHub repository.
2. Open **Settings → Pages** in the repository.
3. Under **Build and deployment**, select **Deploy from a branch**.
4. Select the `main` branch and `/ (root)` folder, then save.
5. Wait for GitHub Pages to publish the site. The published URL will appear in the Pages section.

## Future Improvements
- Export transactions to CSV
- Monthly budget limits and alerts
- Date-range reports
- Optional backend and user authentication

## Author
Add your name and profile link here.

TOKEN2049 Case Study

Node Version: v22.13.1
Framework: NextJS

Steps to run:
1. npm install
2. npm run dev

Assumptions made:
1. /checkout is called securely (non consumer-facing api)

Improvements:
1. Add authentication/session verification if /checkout is consumer facing
2. Add key verification for /webohook to ensure inbound requests are from Coinbase
3. Add more robust error handling in /checkout /webhook for logging/debugging
4. Add /check_charge that queries customer charge information
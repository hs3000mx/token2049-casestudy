import * as z from "zod";
import { NextResponse } from "next/server";
import { FlexibleError } from "@/app/lib/flexibleError";

export async function POST(req: Request) {
    
    const CheckoutBody = z.object({
        "amount": z.number(),
        "email": z.string()
    })
    
    try{
        //if an api key is required for route access, it would be checked here
        //if this as a consumer facing route, we can check their auth token / session here
        console.log("---------------------------")
        console.log("Running Checkout...")
        const _body = await req.json()
        console.log("Validating request body...")
        const parsedBody = CheckoutBody.parse(_body)
        console.log(parsedBody)

        //construct mock payload
        const mockCoinbaseURL = process.env.MOCK_COINBASE_URL

        if(!mockCoinbaseURL) {
            throw new FlexibleError("Missing environment variable", 500)
        }

        const mockCoinbasePayload = {
			pricing_type: "fixed_price",
			local_price: {
				amount: parsedBody.amount.toString(),
				currency: "USD",
			},
			metadata: {
				email: parsedBody.email,
			},
		};

        console.log("Calling Coinbase...")

        const res = await fetch(mockCoinbaseURL, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(mockCoinbasePayload)
        })

        const coinbaseResponse = await res.json()

        if(!res.ok) {
            throw new FlexibleError("Invalid Coinbase Response", 500)
        }

        const returnData = {
            url: coinbaseResponse.data?.url || ""
        }
    
        return NextResponse.json({ status: 200, message: `Success Mock Coinbase Charge`, data: returnData }, { status: 200 })

        //user will enter payment info in hosted payment url, coinbase will verify payment and call webhook

    }
    catch(err: any) {
        return NextResponse.json({ status: err.status ?? 500, message: err.message, data: null }, { status: err.status ?? 500 })
    }
}
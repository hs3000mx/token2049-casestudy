import * as z from "zod";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    
    //coinbase would provide the real payment url
    const payment_url = "https://fake.coinbase.com/pay/12345"

    const MockCoinbaseCharge = z.object({
        "pricing_type": z.string(),
        "local_price": z.object({
            "amount": z.string(),
            "currency": z.string()
        }),
        "metadata": z.object({
            "email": z.string()
        })
    })
    
    try{
        //the real API would check the authentication token here
        console.log("---------------------------")
        console.log("Running Mock Coinbase Charge...")
        const _body = await req.json()
        console.log("Validating request body...")
        const parsedBody = MockCoinbaseCharge.parse(_body)
        console.log(parsedBody)

        //the real API retrn data is much more robust with more metadata
        const returnData = {
            "url": payment_url
        }

        return NextResponse.json({ status: 200, message: `Success Mock Coinbase Charge`, data: returnData }, { status: 200 })

    }
    catch(err: any) {
        return NextResponse.json({ status: err.status ?? 500, message: err.message, data: null }, { status: err.status ?? 500 })
    }
}
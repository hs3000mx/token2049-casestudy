import { NextResponse } from "next/server";
import * as z from "zod";

export async function POST(req: Request) {

    const Webhook = z.object({
        "attempt_number": z.number(),
        "event": z.object({
            "data": z.object({
                "id": z.string(), //I am going to assume that this is the charge id that is generated on charge creation
                "pricing": z.object({
                    "local": z.object({
                        "amount": z.string(),
                        "currency": z.string()
                    }),
                    "settlement": z.object({
                        "amount": z.string(),
                        "currency": z.string()
                    })
                }),
                "metadata": z.object({
                    "name": z.string(),
                    "email": z.string()
                })
            }),
            "id": z.string()
        }),
        "id": z.string(),
        "scheduled_for": z.string()
    })

    try{
        //the real API would check the authentication token here
        console.log("---------------------------")
        console.log("Running Webhook...")
        const _body = await req.json()
        console.log("Validating request body...")
        const parsedBody = Webhook.parse(_body)
        console.log(parsedBody)
        
        //here we would usually store the event details in the database, if we need to relate the transaction to a user given an email, we can use the metadata->email field to find their UUID in the database and reference it

        //simulating event details insertion by logging
        console.log("user_id: string/uuid ->", "EXAMPLE UUID HERE")
        console.log("email: string ->", parsedBody?.event?.data?.metadata?.email) //redundant information for faster look up
        console.log("event_id: string/uuid ->", parsedBody?.event?.id)
        console.log("charge_id: string/uuid ->", parsedBody?.event?.data?.id)
        console.log("local_price: string ->", parsedBody?.event?.data?.pricing?.local?.amount) 
        console.log("local_currency: string ->", parsedBody?.event?.data?.pricing?.local?.currency)
        console.log("settlement_price: string ->", parsedBody?.event?.data?.pricing?.settlement?.amount)
        console.log("settlement_currency: string ->", parsedBody?.event?.data?.pricing?.settlement?.currency)

        //although the charge_id is enough to access all information, it may be useful to add redundant information (e.g. price) for customer support or data analysis

        return NextResponse.json({ status: 200, message: `Success Webhook`, data: null }, { status: 200 })

    }
    catch(err: any) {
        return NextResponse.json({ status: err.status ?? 500, message: err.message, data: null }, { status: err.status ?? 500 })
    }
}
import { NextResponse } from "next/server"

export async function PaymentFailed(event: any){
    console.log("Payment failed")
    const eventBody = await event.json()
    console.log(eventBody)
    //TODO: Implement payment failed
    return NextResponse.json(
        {
            message: "Payment failed"
        }
    )

}
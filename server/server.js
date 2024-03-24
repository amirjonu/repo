require('dotenv').config()


const express = require('express')


const app = express()

app.use(express.json())

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)


const storeItems = new Map([
    [1, {priceInCents: 7300, name:"Basic"}],
    [2, {priceInCents: 8500, name:"Deluxe"}],
    [3, {priceInCents: 9800, name:"Ultimate"}]
])



const cors = require('cors')
const e = require('express')

app.use (
    cors({
        origin: 'http://localhost:5500'
    })
)



app.post('http://localhost:3000/create-checkout-session', async (req, res) => {
    try{
        const session = await stripe.checkout.sessions.create(
            {
                payment_method_types: ['card'],
                mode: 'payment',
                line_items: req.body.items.map(item => {
                    const storeItem = storeItems.get(item.id)
                    return {
                        price_data: {
                            currency: 'usd',
                            product_data: {
                                name: storeItem.name,
                            },
                            unit_amount: storeItem.priceInCents,
                        },
                        quantity: item.quantity,
                    }
                }),
                success_url: '${process.env.CLIENT_URL}/pricing.html',
                cancel_url: '${process.env.CLIENT_URL}/index.html',
            }
        )
        res.json({url:session.url})
    }catch{
        res.status(500).json({error: e.message})
    }
})

app.listen
(
    3000, () => {
        console.log('Server is listening on port 3000')
    }
)